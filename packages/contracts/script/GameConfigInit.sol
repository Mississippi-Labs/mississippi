// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {console} from "forge-std/console.sol";
import {IWorld} from "../src/codegen/world/IWorld.sol";
import {GameConfig} from "../src/codegen/Tables.sol";
import { GAME_CONFIG_KEY } from "../src/Constants.sol";

library GameConfigInit {
    function initGameConfig(IWorld _world) internal {
        bytes32 merkleRoot = "";
        GameConfig.set(
            _world,
            GAME_CONFIG_KEY, //key
            merkleRoot, //merkleRoot
            0, //battleId,
            0, //randomId,
            100, //originX,
            100, //originY,
            0, //roomId,
            0 //boxId,
        );
    }
}