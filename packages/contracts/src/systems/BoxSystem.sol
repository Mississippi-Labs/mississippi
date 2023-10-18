// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState } from "@codegen/Types.sol";
import { GameConfig, BattleConfig, RandomList, RandomListData, BoxList, BoxListData, Player, PlayerData, PlayerLocationLock } from "../codegen/Tables.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";
import { CommonUtils } from "@library/CommonUtils.sol";
import { MRandom } from "@library/MRandom.sol";

contract BoxSystem is System {
  function creatBox(uint16 _x, uint16 _y) internal {
    uint256 roomId = GameConfig.getRoomId(GAME_CONFIG_KEY);
    uint256 boxId = GameConfig.getBoxId(GAME_CONFIG_KEY);
    BoxList.setX(roomId, boxId, _x);
    BoxList.setY(roomId, boxId, _y);

    uint256 randomId = GameConfig.getRandomId(GAME_CONFIG_KEY);
    BoxList.setRandomId(roomId, boxId, randomId);
    GameConfig.setRandomId(GAME_CONFIG_KEY, randomId + 1);
    GameConfig.setBoxId(GAME_CONFIG_KEY, boxId + 1);
  }

  function openBox(uint256 _boxId) external {
    // 宝箱打开时init内容物,根据自带randomId来实现随机
    uint256 roomId = GameConfig.getRoomId(GAME_CONFIG_KEY);
    uint256 boxId = GameConfig.getBoxId(GAME_CONFIG_KEY);
    require(BoxList.getDropTime(roomId, _boxId) != 0, "Invalid box");
    BoxListData memory _box = BoxList.get(roomId, boxId);
    PlayerData memory _user = Player.get(_box.owner);
    require(CommonUtils.isNear(_box.x, _user.x, _box.y, _user.y), "You are not near the box");
    require(_box.opened == false, "Box is opened");
    uint8[] memory randomNumberList = MRandom.getRandom(_box.randomId, 2);
    uint8 oreBalance = CommonUtils.dice(randomNumberList[0], 20, 10, 1);
    uint8 treasureBalance = CommonUtils.dice(randomNumberList[1], 80, 10, 1);
    BoxList.setOreBalance(roomId, boxId, oreBalance);
    BoxList.setTreasureBalance(roomId, boxId, treasureBalance);
    BoxList.setOpened(roomId, boxId, true);
    BoxList.setOpenTime(roomId, boxId, block.timestamp);
  }

  //Todo: add reveal box 
  

  function getCollections(uint256 _boxId, uint16 _oreAmount, uint16 _treasureAmount) internal {
 
    uint256 roomId = GameConfig.getRoomId(GAME_CONFIG_KEY);
    uint256 boxId = GameConfig.getBoxId(GAME_CONFIG_KEY);
    require(BoxList.getDropTime(roomId, _boxId) != 0, "Invalid box");
    BoxListData memory _box = BoxList.get(roomId, boxId);
    PlayerData memory _user = Player.get(_box.owner);
    require(CommonUtils.isNear(_box.x, _user.x, _box.y, _user.y), "You are not near the box");
    require(_box.opened == true, "Box is not opened");
    if (block.timestamp < _box.openTime + BattleConfig.getMaxBoxBindTime(BATTLE_CONFIG_KEY)) {
      require(msg.sender == _box.owner, "The box is waiting for its opener, please wait");
    }
    require(_oreAmount <= _box.oreBalance && _treasureAmount <= _box.treasureBalance, "Invalid amount");
    // check player strength 
    require(Player.getOreBalance(_box.owner) + _oreAmount < Player.getStrength(msg.sender), "Not enough strength");

    BoxList.setOreBalance(roomId, boxId, _box.oreBalance - _oreAmount);
    BoxList.setTreasureBalance(roomId, boxId, _box.treasureBalance - _treasureAmount);
    Player.setOreBalance(_box.owner, _user.oreBalance + _oreAmount);
    Player.setTreasureBalance(_box.owner, _user.treasureBalance + _treasureAmount);
  }
}
