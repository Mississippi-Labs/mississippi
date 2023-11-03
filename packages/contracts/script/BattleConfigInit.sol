// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {console} from "forge-std/console.sol";
import {IWorld} from "../src/codegen/world/IWorld.sol";
import {BattleConfig} from "../src/codegen/Tables.sol";
import { BATTLE_CONFIG_KEY } from "../src/Constants.sol";

library BattleConfigInit {
    function initBattleConfig(IWorld _world) internal {
        address[] memory players;
        BattleConfig.set(
            _world,
            BATTLE_CONFIG_KEY, //key
            10,  //maxAttackzDistance
            15,  //maxMoveDistance,
            20, //maxTimeLimit,
            120, //maxUserLocationLockTime,
            120, //maxBoxBindTime,
            players
        );
    }
}