// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData, BattleConfig, GlobalConfig } from "@codegen/index.sol";
import { GLOBAL_CONFIG_KEY, GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "@src/Constants.sol";

contract InitSystem is System {
  address owner;
  
  function Init(address _userContract, address _lootContract, address _pluginContract, bytes32 _merkleRoot) public {
    if(owner == address(0)){
      owner = _msgSender();
      // 暂时先不考虑多人管理
    }else{
      require(owner == _msgSender(), "only owner can init");
    }

    GameConfig.set(
      GAME_CONFIG_KEY, //key
      GameConfigData({
        merkleRoot: _merkleRoot, //merkleRoot
        battleId: 1, //battleId,
        randomId: 1, //randomId,
        originX: 4, //originX,
        originY: 5, //originY,
        roomId: 1, //roomId,
        boxId: 1, //boxId,
        isOpen: true //isOpen
      })
    );
    address[] memory players;
    BattleConfig.set(
      BATTLE_CONFIG_KEY, //key
      10, //maxAttackzDistance
      15, //maxMoveDistance,
      20, //maxTimeLimit,
      10, //maxUserLocationLockTime,
      10 //maxBoxBindTime
    );
    GlobalConfig.setUserContract(
      GLOBAL_CONFIG_KEY, //key
      _userContract
    );
    GlobalConfig.setLootContract(
      GLOBAL_CONFIG_KEY, //key
      _lootContract
    );
    GlobalConfig.setPluginContract(
      GLOBAL_CONFIG_KEY, //key
      _pluginContract
    );
  }
}
