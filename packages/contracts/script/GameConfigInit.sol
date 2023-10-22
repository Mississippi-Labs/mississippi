// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {console} from "forge-std/console.sol";
import {IWorld} from "../src/codegen/world/IWorld.sol";
import {GameConfig} from "../src/codegen/Tables.sol";
import { GAME_CONFIG_KEY } from "../src/Constants.sol";

library GameConfigInit {
    function initGameConfig(IWorld _world) internal {
        console.log(" ========= initGameConfig");
        // bytes32 merkleRoot = 0x5df91eca63323dbb115087ef262075c5bcea99b8eaf95f520efb8d48ff447499;
        bytes32 merkleRoot = 0xa969691ad8c2e97e3d516e08f5b10ee4decd5f278a5f03ac4fa3532be181c854;
        GameConfig.set(
            _world,
            GAME_CONFIG_KEY, //key
            merkleRoot, //merkleRoot
            1, //battleId,
            0, //randomId,
            4, //originX,
            5, //originY,
            0, //roomId,
            0 //boxId,
        );
    }

    function setInitPosition(IWorld _world) internal {
        GameConfig.setOriginX(_world, GAME_CONFIG_KEY, 4);
        GameConfig.setOriginY(_world, GAME_CONFIG_KEY, 4);
    }

    function getPosition(IWorld _world) internal view returns (uint256, uint256) {
        uint256 x = GameConfig.getOriginX(_world, GAME_CONFIG_KEY);
        uint256 y = GameConfig.getOriginY(_world, GAME_CONFIG_KEY);
        return (x,y);
    }


}