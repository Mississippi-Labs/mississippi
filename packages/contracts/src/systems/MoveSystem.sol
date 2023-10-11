// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState } from "../codegen/Types.sol";
import { GameConfig, BattleConfig, RandomList, RandomListData, BoxList, BoxListData, Player, PlayerData, PlayerLocationLock} from "../codegen/Tables.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";
import { CommonUtils } from "./library/CommonUtils.sol";


contract MoveSystem is System {
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


    function transfer(uint16 x, uint16 y) external {
        //传送门,将用户在战区和非战区移动
        // 将用户坐标随机转移到指定位置
        Player.setX(_msgSender(), x);
        Player.setY(_msgSender(), y);
    }


}