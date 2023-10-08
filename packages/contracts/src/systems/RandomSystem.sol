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

    function joinBattlefield(address _user) public {
        // 加入战区,用户实际上是送到原点,状态改为探索中
        // User storage player = Player[_user];
        PlayerState playerState = Player.getState(_user);
        require(
            playerState == PlayerState.Preparing || playerState == PlayerState.Idle,
            "You should in preparing state"
        );
        //实际上是送到原点//TODO通过常数设置原点参数
        Player.setX(_user, GameConfig.getOriginX(GAME_CONFIG_KEY));
        Player.setY(_user, GameConfig.getOriginY(GAME_CONFIG_KEY));
        BattleConfig.pushBattlefieldPlayers(BATTLE_CONFIG_KEY, _user);
        Player.setState(_user, PlayerState.Exploring);
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
        require(
            CommonUtils.isNear(_box.x, _user.x, _box.y, _user.y),
            "You are not near the box"
        );
        require(_box.opened == false, "Box is opened");
        uint8[] memory randomNumberList = getRandom(_box.randomId, 2);
        uint8 oreBalance = CommonUtils.dice(randomNumberList[0],20,10,1);
        uint8 treasureBalance = CommonUtils.dice(randomNumberList[1],80,10,1);
        BoxList.setOreBalance(roomId, boxId, oreBalance);
        BoxList.setTreasureBalance(roomId, boxId, treasureBalance);
        BoxList.setOpened(roomId, boxId, true);
        BoxList.setOpenTime(roomId, boxId, block.timestamp);
    }

    function getCollections(uint256 _boxId, uint16 _oreAmount,uint16 _treasureAmount) internal {
        uint256 roomId = GameConfig.getRoomId(GAME_CONFIG_KEY);
        uint256 boxId = GameConfig.getBoxId(GAME_CONFIG_KEY);
        require(BoxList.getDropTime(roomId, _boxId) != 0, "Invalid box");
        BoxListData memory _box = BoxList.get(roomId, boxId);
        PlayerData memory _user = Player.get(_box.owner);
        require(
            CommonUtils.isNear(_box.x, _user.x, _box.y, _user.y),
            "You are not near the box"
        );
        require(_box.opened == true, "Box is not opened");
        if(block.timestamp<_box.openTime + BattleConfig.getMaxBoxBindTime(BATTLE_CONFIG_KEY)){
            require(msg.sender==_box.owner,"The box is waiting for its opener, please wait");
        }
        require(_oreAmount<=_box.oreBalance&&_treasureAmount<=_box.treasureBalance,"Invalid amount");
        BoxList.setOreBalance(roomId, boxId, _box.oreBalance - _oreAmount);
        BoxList.setTreasureBalance(roomId, boxId, _box.treasureBalance - _treasureAmount);
        Player.setOreBalance(_box.owner, _user.oreBalance + _oreAmount);
        Player.setTreasureBalance(_box.owner, _user.treasureBalance + _treasureAmount);
    }


}