// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import { BattleState, Buff, PlayerState } from "../codegen/Types.sol";
import { GameConfig, BattleConfig, RandomList, RandomListData,BattleList, BoxList, BoxListData, Player, PlayerData, PlayerLocationLock} from "@codegen/Tables.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";
import { CommonUtils } from "./library/CommonUtils.sol";
import {Move} from "./Common.sol";

contract MoveSystem is System {
    event MoveEvent(address indexed player, uint16 x, uint16 y);
    event AttackStart(address player, address target);

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

    modifier CheckContinuity(Move[] memory moveList) {
        // 验证行走轨迹合法且连续
        uint8 prefer = 1;
        for (uint256 i; i < moveList.length; i++) {

            uint16 x2 = i > 0 ? moveList[i - 1].x : Player.getX(_msgSender());
            uint16 y2 = i > 0 ? moveList[i - 1].y : Player.getY(_msgSender());
            require(
                CommonUtils.isNear(moveList[i].x, x2, moveList[i].y, y2),
                "invalied move"
            );
            // 判断用户每一个移动连续性以及合法性,不能超出1格, 不能斜着走,不能原地踏步
            Move memory info = moveList[i];
            //prefer的意思是可以通行
            bytes32 leaf = keccak256(
                abi.encodePacked(info.x, ",", info.y, ",", prefer)
            );
            bool isValidLeaf = MerkleProof.verify(info.proof, GameConfig.getMerkleRoot(GAME_CONFIG_KEY), leaf);
            require(isValidLeaf, "bad position");
        }
        _;
    }

    function move(Move[] memory moveList) external CheckContinuity(moveList) {
        // 限制移动速度,每次移动需要间隔一定时间
        require(PlayerLocationLock.get(_msgSender()) == 0, "You are locked");
        require(
            moveList.length > 0 && moveList.length <= BattleConfig.getMaxMoveDistance(BATTLE_CONFIG_KEY),
            "invalid move distance"
        );

        Player.setX(_msgSender(), moveList[moveList.length - 1].x);
        Player.setY(_msgSender(), moveList[moveList.length - 1].y);

        emit MoveEvent(
            _msgSender(),
            moveList[moveList.length - 1].x,
            moveList[moveList.length - 1].y
        );
    }

    
    function battleInvitation(
        address _targetAddress,
        Move[] memory moveList
    ) external CheckContinuity(moveList) {
        // 攻击,首先确定地图x,y上有具体用户,其次确定用户之间最短距离proof为10
        // 需要考虑一个格子上有多个用户的情况//一个格子只能有一个人
        // 判断对战双方的状态是否是Exploring

        require(
            moveList.length > 0 && moveList.length <= BattleConfig.getMaxAttackzDistance(BATTLE_CONFIG_KEY),
            "invalid attack distance"
        );

        require(
            Player.getState(_msgSender()) == PlayerState.Exploring &&
               Player.getState(_targetAddress) == PlayerState.Exploring,
            "Each player must be in exploring state"
        );
        require(
            Player.getX(_targetAddress) == moveList[moveList.length - 1].x &&
                Player.getY(_targetAddress) == moveList[moveList.length - 1].y,
            "Target must be in the end of continuity"
        );

        Player.setState(_msgSender(), PlayerState.Attacking);
        Player.setState(_targetAddress, PlayerState.Attacking);

        uint256 battleId = GameConfig.getBattleId(GAME_CONFIG_KEY);
        BattleList.setAttacker(battleId, _msgSender());
        BattleList.setDefender(battleId, _targetAddress);
        BattleList.setTimestamp(battleId, block.timestamp);
        BattleList.setAttackerHP(battleId, Player.getHP(_msgSender()));
        BattleList.setDefenderHP(battleId, Player.getHP(_targetAddress));

        // battleId++;
        GameConfig.setBattleId(GAME_CONFIG_KEY, battleId + 1);

        emit AttackStart(_msgSender(), _targetAddress);
    }

    
    function joinBattlefield(address _user) public {
    // 加入战区,用户实际上是送到原点,状态改为探索中
    PlayerState playerState = Player.getState(_user);
    require(playerState == PlayerState.Preparing || playerState == PlayerState.Idle, "You should in preparing state");
    //实际上是送到原点//TODO通过常数设置原点参数
    // TODO似乎可以直接通过indexer获取,就不需要再次插入了
    
    Player.setX(_user, GameConfig.getOriginX(GAME_CONFIG_KEY));
    Player.setY(_user, GameConfig.getOriginY(GAME_CONFIG_KEY));
    // GameConfig.pushBattlefieldPlayers(GAME_CONFIG_KEY, _user);
    Player.setState(_user, PlayerState.Exploring);
  }


}