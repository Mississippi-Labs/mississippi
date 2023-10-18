// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

 

import { BattleState, Buff, PlayerState } from "../codegen/Types.sol";
import { GameConfig, BattleConfig, RandomList, RandomListData,BattleList, BoxList, BoxListData, Player, PlayerData, PlayerLocationLock} from "@codegen/Tables.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";
import {console} from "forge-std/console.sol";
import { CommonUtils } from "./library/CommonUtils.sol";
import {Move} from "./Common.sol";

contract MoveSystem is System {
    event MoveEvent(address indexed player, uint16 x, uint16 y);
    
    function unlockUserLocation() external {
        // 用户自行解锁
        require(PlayerLocationLock.get(_msgSender()) != 0, "You are not locked");
        require(
            PlayerLocationLock.get(_msgSender()) + BattleConfig.getMaxUserLocationLockTime(BATTLE_CONFIG_KEY) <
                block.timestamp,
            "You are not locked"
        );
        PlayerLocationLock.set(_msgSender(), 0);
    }

    function move(Move[] memory moveList) external {
        require(
            moveList.length > 0 && moveList.length <= BattleConfig.getMaxMoveDistance(BATTLE_CONFIG_KEY),
            "invalid move distance"
        );
        // require(moveList.length <= Player.getSpeed(_msgSender()), "exceed player speed");
        // check player lock 
        require(PlayerLocationLock.get(_msgSender()) == 0, "You are locked");
        // check continuity
        CommonUtils.CheckContinuity(_msgSender(), moveList);
       
        Player.setX(_msgSender(), moveList[moveList.length - 1].x);
        Player.setY(_msgSender(), moveList[moveList.length - 1].y);

        emit MoveEvent(
            _msgSender(),
            moveList[moveList.length - 1].x,
            moveList[moveList.length - 1].y
        );
    }
}