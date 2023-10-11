// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState } from "../codegen/Types.sol";
import { GameConfig, BattleConfig, RandomList, RandomListData, BoxList, BoxListData, Player, PlayerData, PlayerLocationLock} from "../codegen/Tables.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";
import { CommonUtils } from "./library/CommonUtils.sol";


contract RandomSystem is System {

    event NewRandom(uint256 randomId, address author);

    function raiseUserHP(
        uint256 _targetHP,
        uint256 _percent,
        address _user
    ) public {
        Player.setHP(_user, (_targetHP * _percent) / 100);
    }

    

    function getRandom(
        uint256 _randomId,
        uint256 _count
    ) internal view returns (uint8[] memory) {
        require(
            _msgSender() == RandomList.getAuthor(_randomId),
            "only random creator can get random"
        );
        uint8[] memory randomNumberList = new uint8[](_count);
        RandomListData memory r = RandomList.get(_randomId);
        require(
            block.number >= r.blockNumber + 2,
            "too early to get random seed"
        );
        uint256 seed = uint256(blockhash(r.blockNumber + 2));
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
        RandomList.setAuthor(randomId, _msgSender());
        RandomList.setBlockNumber(randomId, block.number);

        emit NewRandom(randomId, _msgSender());
    }



}