// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

// import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState, BattleEndType } from "../codegen/common.sol";
import { GameConfig, BoxListData, BattleList,BattleList1, BattleListData,BattleList1Data,BattleList1Data,BattleList1, Player,PlayerParams, PlayerData, PlayerLocationLock, BoxList } from "../codegen/index.sol";
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
    BattleList1Data memory battle1 = BattleList1.get(_battleId);

    BattleUtils.checkBattlePlayer(battle,battle1, _msgSender(), BattleState.Confirmed);

    // TODO reveal add time limit ?

    bytes32 buffHash = battle.attacker == _msgSender()
      ? BattleList1.getAttackerBuffHash(_battleId)
      : BattleList1.getDefenderBuffHash(_battleId);

    bytes32 proofHash = keccak256(abi.encodePacked(_action, _arg, _nonce));
    require(buffHash == proofHash, "Invalid buff hash proof");
    if (battle.attacker == _msgSender()) {
      BattleList1.setAttackerAction(_battleId, _action);
      BattleList1.setAttackerArg(_battleId, _arg);
      BattleList1.setAttackerState(_battleId, BattleState.Revealed);
    } else {
      BattleList1.setDefenderAction(_battleId, _action);
      BattleList1.setDefenderArg(_battleId, _arg);
      BattleList1.setDefenderState(_battleId, BattleState.Revealed);
    }

    if (
      BattleList1.getAttackerState(_battleId) == BattleState.Revealed &&
      BattleList1.getDefenderState(_battleId) == BattleState.Revealed
    ) {
      revealWinner(_battleId);
    }
  }

  function revealWinner(uint256 _battleId) public {
    BattleListData memory battle = BattleList.get(_battleId);
    BattleList1Data memory battle1 = BattleList1.get(_battleId);

    BattleUtils.checkBattlePlayer(battle,battle1, _msgSender(), BattleState.Revealed);

    //set attack
    uint256 attackerFirepower = PlayerParams.getAttack(battle.attacker);
    uint256 defenderFirepower = PlayerParams.getAttack(battle.defender);
    Buff attackerBuff = Buff(battle1.attackerArg);
    Buff defenderBuff = Buff(battle1.defenderArg);
    if (battle1.attackerAction == bytes32("attack") && battle1.defenderAction == bytes32("attack")) {
      allAttack(_battleId, battle, attackerBuff, defenderBuff, attackerFirepower, defenderFirepower);
    } else if (battle1.attackerAction == bytes32("escape") && battle1.defenderAction == bytes32("escape")) {
      allEscape(_battleId, battle);
    } else  {
      escapeAndAttack(_battleId, battle,battle1);
    } 
    if (!BattleList.getIsEnd(_battleId)) {
      // 如果战斗还没结束
      BattleList1.setDefenderState(_battleId, BattleState.Inited);
      BattleList1.setAttackerState(_battleId, BattleState.Inited);
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
    PlayerParams.setHp(_battle.attacker, BattleList.getAttackerHP(_battleId));
    PlayerParams.setHp(_battle.defender, BattleList.getDefenderHP(_battleId));
    BattleList.setIsEnd(_battleId, true);
    BattleList.setWinner(_battleId, address(0));
      Player.setLastBattleTime(_battle.attacker, block.timestamp);
      Player.setLastBattleTime(_battle.defender, block.timestamp);


  }

  // 

  function escapeAndAttack(uint _battleId, BattleListData memory battle,BattleList1Data memory battle1) internal {
    address escaper = battle1.attackerAction == bytes32("escape") ? battle.attacker : battle.defender;
    address other = battle1.attackerAction == bytes32("escape") ? battle.defender : battle.attacker;
    Buff escaperBuff = battle1.attackerAction == bytes32("escape") ? Buff(battle1.attackerArg) : Buff(battle1.defenderArg);
    Buff otherBuff = battle1.attackerAction == bytes32("escape") ? Buff(battle1.defenderArg) : Buff(battle1.attackerArg);
    if(BattleUtils.compareBuff(escaperBuff,otherBuff)>=1){
      // 逃跑成功
      // 胜利方为0,双方explowing,双方设定hp,一方锁定
      BattleList.setWinner(_battleId, other);
      BattleList.setIsEnd(_battleId, true);
      // escaper will lock a while
      PlayerLocationLock.set(other, block.timestamp);
      Player.setState(battle.attacker, PlayerState.Exploring);
      PlayerParams.setHp(battle.attacker, BattleList.getAttackerHP(_battleId));
      Player.setLastBattleTime(battle.attacker, block.timestamp);
      // console.log(" defender escape success");
      Player.setState(battle.defender, PlayerState.Exploring);
      PlayerParams.setHp(battle.defender, BattleList.getDefenderHP(_battleId));
      Player.setLastBattleTime(battle.defender, block.timestamp);

    }else{
      // 逃跑失败
      uint256 attack = PlayerParams.getAttack(other);
      uint256 attackPower = (attack*15)/10;
      if(battle.attacker==escaper){
        BattleList.setAttackerHP(_battleId,BattleUtils.getAttackResult(battle.attackerHP,attackPower));
      }else{
        BattleList.setDefenderHP(_battleId,BattleUtils.getAttackResult(battle.defenderHP,attackPower));
      }
    }

  }

}
