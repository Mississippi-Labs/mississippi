// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { GameConfig, GameConfigData } from "../src/codegen/index.sol";
import { GAME_CONFIG_KEY } from "../src/Constants.sol";

library GameConfigInit {
  function initGameConfig(IWorld _world) internal {
    console.log(" ========= initGameConfig");
    bytes32 merkleRoot = 0x5df91eca63323dbb115087ef262075c5bcea99b8eaf95f520efb8d48ff447499;
    // bytes32 merkleRoot = 0xa969691ad8c2e97e3d516e08f5b10ee4decd5f278a5f03ac4fa3532be181c854;
    GameConfig.setBattleId(GAME_CONFIG_KEY,1);
    // GameConfig.set(
    //   GAME_CONFIG_KEY, //key
    //   GameConfigData({
    //     merkleRoot: merkleRoot, //merkleRoot
    //     battleId: 1, //battleId,
    //     randomId: 1, //randomId,
    //     originX: 4, //originX,
    //     originY: 5, //originY,
    //     roomId: 1, //roomId,
    //     boxId: 1, //boxId,
    //     isOpen: true //isOpen
    //   })
    // );
    console.log(" ========= initGameConfig2");

  }

  function setInitPosition(IWorld _world) internal {
    GameConfig.setOriginX(GAME_CONFIG_KEY, 4);
    GameConfig.setOriginY(GAME_CONFIG_KEY, 4);
  }

  function getPosition(IWorld _world) internal view returns (uint256, uint256) {
    uint256 x = GameConfig.getOriginX(GAME_CONFIG_KEY);
    uint256 y = GameConfig.getOriginY(GAME_CONFIG_KEY);
    return (x, y);
  }
}
