// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {console} from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState } from "../codegen/common.sol";
import { GameConfig, BattleConfig,  BattleList, BattleListData,BattleList1Data,BattleList1, Player, 
    PlayerData, PlayerLocationLock } from "../codegen/index.sol";
import { BattleUtils } from "./library/BattleUtils.sol";
import { CommonUtils } from "./library/CommonUtils.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";
import {Position} from "./Common.sol";

contract BattleForceSystem is System {
    function forceEnd(uint256 _battleId) external {
    require(!BattleList.getIsEnd(_battleId),"battel already end");

        BattleListData memory battle = BattleList.get(_battleId);
        BattleList1Data memory battle1 = BattleList1.get(_battleId);
        require(_msgSender() == battle.attacker || _msgSender() == battle.defender, "not in battle");
        require(block.timestamp - battle.endTimestamp > BattleConfig.getMaxTimeLimit(BATTLE_CONFIG_KEY), "battle not timeout");
        require(battle.isEnd == false, "battle already end");
        // 可以强制结束阶段为:confirmed, revealed

        BattleState oppositeState = _msgSender() == battle.attacker ? battle1.defenderState : battle1.attackerState;
        BattleState playerState = _msgSender() == battle.attacker ? battle1.attackerState : battle1.defenderState;

        address oppositer = _msgSender() == battle.attacker ? battle.defender : battle.attacker;
        require((oppositeState == BattleState.Inited && playerState == BattleState.Confirmed)||(oppositeState == BattleState.Confirmed && playerState == BattleState.Revealed), "battle state not correct");


        BattleList.setIsEnd(_battleId, true);
        BattleList.setWinner(_battleId, _msgSender());
        BattleUtils.endGame(oppositer, _msgSender(),_battleId);
    }
    // 还需要一个全局举报功能
}