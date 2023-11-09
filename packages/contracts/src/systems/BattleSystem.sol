// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

// import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState, BattleEndType } from "@codegen/Types.sol";
import { GameConfig,  BoxListData, BattleList, BattleListData, Player, PlayerData, PlayerLocationLock, BoxList } from "@codegen/Tables.sol";
import { BattleUtils } from "./library/BattleUtils.sol";

// import "forge-std/console.sol";

contract BattleSystem is System {
  event BattleReveal(uint256 battleId, address sender);
  event BattleEnd(uint256 battleId, BattleEndType endType, address winner);

  function revealBattle(uint256 _battleId, bytes32 _action, uint256 _arg, bytes32 _nonce) external {
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
   
   if (BattleList.getAttackerState(_battleId) == BattleState.Revealed 
      && BattleList.getDefenderState(_battleId) == BattleState.Revealed) {
      // reveal 
      // console.log("reveal battle");
      revealWinner(_battleId);
    }
    // emit BattleReveal(_battleId, _msgSender());
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
        allEscape(_battleId);
    } else if (battle.attackerAction == bytes32("escape") && battle.defenderAction == bytes32("attack")) {
        attackerEscapeDenfenderAttack(_battleId, battle, attackerBuff, defenderBuff, defenderFirepower);
    } else if (battle.attackerAction == bytes32("attack") && battle.defenderAction == bytes32("escape")) {
        attackerAttackDenfenderEscape(_battleId, battle, attackerBuff, defenderBuff, attackerFirepower);
    }

    if (!BattleList.getIsEnd(_battleId)) {
      // console.log(" round end ");
      // emit BattleEnd(_battleId, BattleEndType.RoundEnd, address(0));
      BattleList.setDefenderState(_battleId, BattleState.Inited);
      BattleList.setAttackerState(_battleId, BattleState.Inited);
      BattleList.setEndTimestamp(_battleId, block.timestamp);
    } else {
      // set explore state
      if (Player.getState(battle.attacker) == PlayerState.Attacking) {
        Player.setState(battle.attacker, PlayerState.Exploring);
      }
      if (Player.getState(battle.defender) == PlayerState.Attacking) {
        Player.setState(battle.defender, PlayerState.Exploring);
      }
      BattleList.setEndTimestamp(_battleId, block.timestamp);
    }
    Player.setHp(battle.attacker, BattleList.getAttackerHP(_battleId));
    Player.setHp(battle.defender, BattleList.getDefenderHP(_battleId));
  }

  function allAttack(uint _battleId, BattleListData memory battle, Buff attackerBuff, Buff defenderBuff
      , uint attackerFirepower, uint defenderFirepower) internal {
      // 任意攻击buff都强于None
      uint256 attackerAttackPower = BattleUtils.getAttackPower(attackerBuff, defenderBuff, attackerFirepower);
      uint256 defenderAttackPower = BattleUtils.getAttackPower(defenderBuff, attackerBuff, defenderFirepower);

      BattleList.setAttackerHP(_battleId, BattleUtils.getAttackResult(battle.attackerHP, defenderAttackPower));
      BattleList.setDefenderHP(_battleId, BattleUtils.getAttackResult(battle.defenderHP, attackerAttackPower));
      if (BattleList.getAttackerHP(_battleId) == 0 || BattleList.getDefenderHP(_battleId) == 0) {
        address winner = battle.attackerHP == 0 ? battle.defender : battle.attacker;
        address looser = battle.attackerHP == 0 ? battle.attacker : battle.defender;
        BattleList.setWinner(_battleId, winner);  
        BattleList.setIsEnd(_battleId, true);
        BattleUtils.loseGame(looser, winner);
      } 
  }
  
  function allEscape(uint _battleId) internal {
      BattleList.setIsEnd(_battleId, true);
      BattleList.setWinner(_battleId, address(0));
  }

  function attackerEscapeDenfenderAttack(uint _battleId, BattleListData memory battle, Buff attackerBuff, 
    Buff defenderBuff, uint defenderFirepower) internal {
      // console.log(" escape --- 1");
      if (attackerBuff == defenderBuff || BattleUtils.compareBuff(attackerBuff, defenderBuff) == 2) {
        // escape success 
        BattleList.setWinner(_battleId, battle.defender);
        BattleList.setIsEnd(_battleId, true);
        // escaper will lock a while 
        PlayerLocationLock.set(battle.defender, block.timestamp);

      } else {
        // escape fail, cause hurt
        uint256 defenderAttackPower = BattleUtils.getAttackPower(defenderBuff, attackerBuff, defenderFirepower);
        BattleList.setAttackerHP(_battleId, BattleUtils.getAttackResult(battle.attackerHP, defenderAttackPower));
        if (BattleList.getAttackerHP(_battleId) == 0) {
          BattleList.setWinner(_battleId, battle.defender);
          BattleList.setIsEnd(_battleId, true);

          // emit BattleEnd(_battleId, BattleEndType.NormalEnd, battle.defender);
        }
      }
  }

  function attackerAttackDenfenderEscape(uint _battleId, BattleListData memory battle, Buff attackerBuff, Buff defenderBuff, uint attackerFirepower) internal {
    if (attackerBuff == defenderBuff || BattleUtils.compareBuff(defenderBuff, attackerBuff) == 2) {
        // escape success 
        BattleList.setWinner(_battleId, battle.attacker);
        BattleList.setIsEnd(_battleId, true);
        // escaper will lock a while 
        PlayerLocationLock.set(battle.attacker, block.timestamp);

        // console.log(" attacker escape success");
        // emit BattleEnd(_battleId, BattleEndType.NormalEnd, battle.attacker);
    } else {
       // escape fail, cause hurt
      uint256 attackerAttackPower = BattleUtils.getAttackPower(attackerBuff, defenderBuff, attackerFirepower);
      BattleList.setAttackerHP(_battleId, BattleUtils.getAttackResult(battle.attackerHP, attackerAttackPower));
      if (BattleList.getDefenderHP(_battleId) == 0) {
        BattleList.setWinner(_battleId, battle.attacker);
        BattleList.setIsEnd(_battleId, true);

        // emit BattleEnd(_battleId, BattleEndType.NormalEnd, battle.attacker);
      }
    }
  }

  
}