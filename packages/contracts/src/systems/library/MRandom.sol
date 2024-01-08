// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {console} from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState } from "../../codegen/common.sol";
import { GameConfig, BattleConfig, RandomList, RandomListData, BoxList, BoxListData, Player, PlayerData, PlayerLocationLock } from "../../codegen/index.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../../Constants.sol";
import { CommonUtils } from "@library/CommonUtils.sol";

library MRandom {
  event NewRandom(uint256 randomId, address author);

  function getRandom(address sender, uint256 _randomId, uint256 _count) internal view returns (uint8[] memory) {
    console.log(" author ", RandomList.getAuthor(_randomId), sender);
    require(sender == RandomList.getAuthor(_randomId), "only random creator can get random");
    uint8[] memory randomNumberList = new uint8[](_count);
    RandomListData memory r = RandomList.get(_randomId);
    require(block.number >= r.blockNumber + 1, "too early to get random seed");
    uint256 seed = uint256(blockhash(r.blockNumber + 1));
    // 一次处理一个uint256随机数
    uint256 randomNumber = uint256(keccak256(abi.encodePacked(seed)));
    // 截断后存入属性数组
    for (uint8 i = 0; i < _count; i++) {
      uint8 digit = uint8(randomNumber % 100);
      randomNumberList[i] = digit;
      randomNumber = randomNumber / 100;
    }
    return randomNumberList;
  }

  function requestRandom() external {
    uint256 randomId = GameConfig.getRandomId(GAME_CONFIG_KEY);
    RandomList.setAuthor(randomId, msg.sender);
    RandomList.setBlockNumber(randomId, block.number);

    emit NewRandom(randomId, msg.sender);
  }

  function choice(uint8 rand, string[] memory sourceArray) internal pure returns (string memory) {
    string memory output = sourceArray[rand % sourceArray.length];
    return output;
  }
}
