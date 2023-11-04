// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {console} from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState } from "../codegen/Types.sol";
import { GameConfig, BattleConfig,  BattleList, BattleListData, Player, 
    PlayerData, PlayerLocationLock } from "../codegen/Tables.sol";
import { BattleUtils } from "./library/BattleUtils.sol";
import { CommonUtils } from "./library/CommonUtils.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";
import {Position} from "./Common.sol";

contract BattleForceSystem is System {
    function forceEnd(uint256 _battleId) external {
        BattleListData memory battle = BattleList.get(_battleId);
        require(_msgSender() == battle.attacker || _msgSender() == battle.defender, "not in battle");
        require(block.timestamp - battle.endTimestamp > BattleConfig.getMaxTimeLimit(BATTLE_CONFIG_KEY), "battle not timeout");
        require(battle.isEnd == false, "battle already end");

        BattleState oppositeState = _msgSender() == battle.attacker ? battle.defenderState : battle.attackerState;
        BattleState playerState = _msgSender() == battle.attacker ? battle.attackerState : battle.defenderState;
        console.log("battle attacker ", battle.attacker);

        address oppositer = _msgSender() == battle.attacker ? battle.defender : battle.attacker;
        console.log(" opposite state ", uint(oppositeState));
        console.log(" player state ", uint(playerState));
        require(oppositeState == BattleState.Inited && playerState == BattleState.Confirmed, "battle state not correct");

        Player.setState(battle.attacker, PlayerState.Exploring);
        Player.setState(battle.defender, PlayerState.Exploring);

        BattleList.setDefenderState(_battleId, BattleState.Revealed);
        BattleList.setAttackerState(_battleId, BattleState.Revealed);
        BattleList.setIsEnd(_battleId, true);
        BattleList.setWinner(_battleId, _msgSender());
        

        BattleUtils.loseGame(oppositer, _msgSender());
    }
}