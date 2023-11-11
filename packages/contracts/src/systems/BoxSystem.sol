// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState } from "@codegen/Types.sol";
import { GameConfig, BattleConfig, RandomList, RandomListData, BoxList, BoxListData, Player, PlayerData, PlayerLocationLock } from "../codegen/Tables.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";
import { CommonUtils } from "@library/CommonUtils.sol";
import { MRandom } from "@library/MRandom.sol";

contract BoxSystem is System {
  function openBox(uint256 _boxId) external {
    // TODO use lock 
    require(BoxList.getDropTime(_boxId) != 0, "Invalid box");
    BoxListData memory box = BoxList.get(_boxId);
    console.log(" box owner ", box.owner);
    if (box.owner != address(0) && box.owner != _msgSender()) {
      revert("box already have owner");
    }
    require(box.opened == false, "Box is opened");

    PlayerData memory player = Player.get(_msgSender());
    require(CommonUtils.isNear(box.x, player.x, box.y, player.y), "You are not near the box");

    if (box.owner == address(0)) {
      BoxList.setOwner(_boxId, _msgSender());
    }

    uint256 randomId = GameConfig.getRandomId(GAME_CONFIG_KEY);
    BoxList.setRandomId(_boxId, randomId);
    GameConfig.setRandomId(GAME_CONFIG_KEY, randomId + 1);

    // RandomList.getAuthor(_randomId),
    RandomList.set(randomId, block.number, _msgSender());
  }

  function revealBox(uint256 _boxId) external {
    BoxListData memory _box = BoxList.get(_boxId);
    console.log("randomId ",  _box.randomId);


    uint8[] memory randomNumberList = MRandom.getRandom(_msgSender(), _box.randomId, 2);
    uint8 oreBalance = CommonUtils.dice(randomNumberList[0], 20, 10, 1);
    uint8 treasureBalance = CommonUtils.dice(randomNumberList[1], 80, 10, 1);
    BoxList.setOreBalance(_boxId, oreBalance);
    BoxList.setTreasureBalance(_boxId, treasureBalance);
    BoxList.setOpened(_boxId, true);
    BoxList.setOpenTime(_boxId, block.timestamp);
  }
  
  function getCollections(uint256 _boxId, uint16 _oreAmount, uint16 _treasureAmount) public {
    BoxListData memory _box = BoxList.get(_boxId);

    PlayerData memory _player = Player.get(_box.owner);
    require(CommonUtils.isNear(_box.x, _player.x, _box.y, _player.y), "You are not near the box");

    require(_box.opened == true, "Box is not opened");

    if (block.timestamp < _box.openTime + BattleConfig.getMaxBoxBindTime(BATTLE_CONFIG_KEY)) {
      require(msg.sender == _box.owner, "The box is waiting for its opener, please wait");
    }
    
    console.log("box oreBalance , treasureBalance ", _box.oreBalance, _box.treasureBalance);
    require(_oreAmount <= _box.oreBalance && _treasureAmount <= _box.treasureBalance, "Invalid amount");
    // check player strength 
    require(Player.getOreBalance(_box.owner) + _oreAmount < Player.getStrength(msg.sender), "Not enough strength");

    BoxList.setOreBalance(_boxId, _box.oreBalance - _oreAmount);
    BoxList.setTreasureBalance(_boxId, _box.treasureBalance - _treasureAmount);
    Player.setOreBalance(_box.owner, _player.oreBalance + _oreAmount);
    Player.setTreasureBalance(_box.owner, _player.treasureBalance + _treasureAmount);
    // TODO DEBUG 应该谁抢到归谁
    
  }
}
