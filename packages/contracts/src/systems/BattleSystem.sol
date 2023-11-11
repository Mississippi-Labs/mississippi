// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

// import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState, BattleEndType } from "@codegen/Types.sol";
import { GameConfig, BoxListData, BattleList, BattleListData, Player, PlayerData, PlayerLocationLock, BoxList } from "@codegen/Tables.sol";
import { BattleUtils } from "./library/BattleUtils.sol";

// import "forge-std/console.sol";

contract BattleSystem is System {
  event BattleReveal(uint256 battleId, address sender);
  event BattleEnd(uint256 battleId, BattleEndType endType, address winner);

  function revealBattle(uint256 _battleId, bytes32 _action, uint256 _arg, bytes32 _nonce) external {
    require(!BattleList.getIsEnd(_battleId),"battel already end");
    require(_action == bytes32("attack") || _action == bytes32("escape"), "invalid action");
    // check battle
    BattleListData memory battle = BattleList.get(_battleId);
    BattleUtils.checkBattlePlayer(battle, _msgSender(), BattleState.Confirmed);

    // TODO reveal add time limit ?

    bytes32 buffHash = battle.attacker == _msgSender()
      ? BattleList.getAttackerBuffHash(_battleId)
      : BattleList.getDefenderBuffHash(_battleId);

    bytes32 proofHash = keccak256(abi.encodePacked(_action, _arg, _nonce));
    require(buffHash == proofHash, "Invalid buff hash proof");
    if (battle.attacker == _msgSender()) {
      BattleList.setAttackerAction(_battleId, _action);
      BattleList.setAttackerArg(_battleId, _arg);
      BattleList.setAttackerState(_battleId, BattleState.Revealed);
    } else {
      BattleList.setDefenderAction(_battleId, _action);
      BattleList.setDefenderArg(_battleId, _arg);
      BattleList.setDefenderState(_battleId, BattleState.Revealed);
    }

    if (
      BattleList.getAttackerState(_battleId) == BattleState.Revealed &&
      BattleList.getDefenderState(_battleId) == BattleState.Revealed
    ) {
      revealWinner(_battleId);
    }
  }

  function revealWinner(uint256 _battleId) public {
    BattleListData memory battle = BattleList.get(_battleId);
    BattleUtils.checkBattlePlayer(battle, _msgSender(), BattleState.Revealed);
    //set attack
    uint256 attackerFirepower = Player.getAttack(battle.attacker);
    uint256 defenderFirepower = Player.getAttack(battle.defender);
    Buff attackerBuff = Buff(battle.attackerArg);
    Buff defenderBuff = Buff(battle.defenderArg);
    if (battle.attackerAction == bytes32("attack") && battle.defenderAction == bytes32("attack")) {
      allAttack(_battleId, battle, attackerBuff, defenderBuff, attackerFirepower, defenderFirepower);
    } else if (battle.attackerAction == bytes32("escape") && battle.defenderAction == bytes32("escape")) {
      allEscape(_battleId, battle);
    } else  {
      escapeAndAttack(_battleId, battle);
    } 
    if (!BattleList.getIsEnd(_battleId)) {
      // 如果战斗还没结束
      BattleList.setDefenderState(_battleId, BattleState.Inited);
      BattleList.setAttackerState(_battleId, BattleState.Inited);
      if (BattleList.getAttackerHP(_battleId) == 0 || BattleList.getDefenderHP(_battleId) == 0) {
        address winner = BattleList.getDefenderHP(_battleId) == 0 ? battle.attacker : battle.defender;
        address looser = winner == battle.attacker ? battle.defender : battle.attacker;

        BattleUtils.endGame(looser, winner, _battleId);
      }
    } else {
      // 战斗已经结束
      emit BattleEnd(_battleId, BattleEndType.NormalEnd, BattleList.getWinner(_battleId));
    }

    BattleList.setEndTimestamp(_battleId, block.timestamp);
  }

  function allAttack(
    uint _battleId,
    BattleListData memory battle,
    Buff attackerBuff,
    Buff defenderBuff,
    uint attackerFirepower,
    uint defenderFirepower
  ) internal {
    // 任意攻击buff都强于None
    uint256 attackerAttackPower = BattleUtils.getAttackPower(attackerBuff, defenderBuff, attackerFirepower);
    uint256 defenderAttackPower = BattleUtils.getAttackPower(defenderBuff, attackerBuff, defenderFirepower);

    BattleList.setAttackerHP(_battleId, BattleUtils.getAttackResult(battle.attackerHP, defenderAttackPower));
    BattleList.setDefenderHP(_battleId, BattleUtils.getAttackResult(battle.defenderHP, attackerAttackPower));
  }

  function allEscape(uint _battleId, BattleListData memory _battle) internal {
    Player.setState(_battle.attacker, PlayerState.Exploring);
    Player.setState(_battle.defender, PlayerState.Exploring);
    Player.setHp(_battle.attacker, BattleList.getAttackerHP(_battleId));
    Player.setHp(_battle.defender, BattleList.getDefenderHP(_battleId));
    BattleList.setIsEnd(_battleId, true);
    BattleList.setWinner(_battleId, address(0));
  }

  // 

  function escapeAndAttack(uint _battleId, BattleListData memory battle) internal {
    address escaper = battle.attackerAction == bytes32("escape") ? battle.attacker : battle.defender;
    address other = battle.attackerAction == bytes32("escape") ? battle.defender : battle.attacker;
    Buff escaperBuff = battle.attackerAction == bytes32("escape") ? Buff(battle.attackerArg) : Buff(battle.defenderArg);
    Buff otherBuff = battle.attackerAction == bytes32("escape") ? Buff(battle.defenderArg) : Buff(battle.attackerArg);
    if(BattleUtils.compareBuff(escaperBuff,otherBuff)>=1){
      // 逃跑成功
      // 胜利方为0,双方explowing,双方设定hp,一方锁定
      BattleList.setWinner(_battleId, battle.defender);
      BattleList.setIsEnd(_battleId, true);
      // escaper will lock a while
      PlayerLocationLock.set(battle.defender, block.timestamp);
      Player.setState(battle.attacker, PlayerState.Exploring);
      Player.setHp(battle.attacker, BattleList.getAttackerHP(_battleId));
      // console.log(" defender escape success");
      Player.setState(battle.defender, PlayerState.Exploring);
      Player.setHp(battle.defender, BattleList.getDefenderHP(_battleId));

    }else{
      // 逃跑失败
      uint256 attack = Player.getAttack(other);
      uint256 attackPower = (attack*15)/10;
      if(battle.attacker==escaper){
        BattleList.setAttackerHP(_battleId,BattleUtils.getAttackResult(battle.attackerHP,attackPower));
      }else{
        BattleList.setDefenderHP(_battleId,BattleUtils.getAttackResult(battle.defenderHP,attackPower));
      }
    }

  }

}
