// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState } from "../codegen/Types.sol";
import { GameConfig, BattleConfig,  BattleList, BattleListData, Player, 
    PlayerData, PlayerLocationLock } from "../codegen/Tables.sol";
import { BattleUtils } from "./library/BattleUtils.sol";
import { CommonUtils } from "./library/CommonUtils.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";
import {Move} from "./Common.sol";

contract BattlePrepareSystem is System {
    event AttackStart(address player, address target);
    event BattleConfirmed(uint256 battleId, address sender, bytes32 buffHash);
    
    function joinBattlefield(address _player) public {
        // 加入战区,用户实际上是送到原点,状态改为探索中
        PlayerState playerState = Player.getState(_player);
        require(playerState == PlayerState.Preparing || playerState == PlayerState.Idle, "You should in preparing state");
        //实际上是送到原点//TODO通过常数设置原点参数
        // TODO似乎可以直接通过indexer获取,就不需要再次插入了
        
        Player.setX(_player, GameConfig.getOriginX(GAME_CONFIG_KEY));
        Player.setY(_player, GameConfig.getOriginY(GAME_CONFIG_KEY));
        Player.setState(_player, PlayerState.Exploring);
        Player.setHp(_player, initPlayerHp(_player));

        // GameConfig.pushBattlefieldPlayers(GAME_CONFIG_KEY, _player);
    }

    function battleInvitation(
        address _targetAddress,
        Move[] memory moveList
    ) external {
        // 攻击,首先确定地图x,y上有具体用户,其次确定用户之间最短距离proof为10
        // 需要考虑一个格子上有多个用户的情况//一个格子只能有一个人
        // 判断对战双方的状态是否是Exploring

        require(
            moveList.length > 0 && moveList.length <= BattleConfig.getMaxAttackzDistance(BATTLE_CONFIG_KEY),
            "invalid attack distance"
        );
        require(moveList.length <= Player.getSpace(_msgSender()), "exceed player space");

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
        // check continuity
        CommonUtils.CheckContinuity(_msgSender(), moveList);

        Player.setState(_msgSender(), PlayerState.Attacking);
        Player.setState(_targetAddress, PlayerState.Attacking);

        uint256 battleId = GameConfig.getBattleId(GAME_CONFIG_KEY);
        BattleList.setAttacker(battleId, _msgSender());
        BattleList.setDefender(battleId, _targetAddress);
        BattleList.setTimestamp(battleId, block.timestamp);
        BattleList.setAttackerHP(battleId, Player.getHp(_msgSender()));
        BattleList.setDefenderHP(battleId, Player.getHp(_targetAddress));

        // battleId++;
        GameConfig.setBattleId(GAME_CONFIG_KEY, battleId + 1);

        emit AttackStart(_msgSender(), _targetAddress);
    }

    function confirmBattle(bytes32 _buffHash, uint256 _battleId) external {
        // 战斗是否有用户
        //战斗是否结束
        //是否已超时

        BattleListData memory battle = BattleList.get(_battleId);
        BattleUtils.checkBattlePlayer(battle, _msgSender(), BattleState.Inited);

        require(block.timestamp - battle.timestamp < BattleConfig.getMaxTimeLimit(BATTLE_CONFIG_KEY), "Battle is timeout");
        // 战斗是否已经选择buff
        BattleState _battleState = battle.attacker == _msgSender() ? battle.attackerState : battle.defenderState;

        require(_battleState == BattleState.Inited, "You have already selected buff");
        // 当前实现方法非常不优雅,使用两个额外存储槽来存储用户的选择
        if (battle.attacker == _msgSender()) {
        BattleList.setAttackerBuffHash(_battleId, _buffHash);
        BattleList.setAttackerState(_battleId, BattleState.Confirmed);
        } else {
        BattleList.setDefenderBuffHash(_battleId, _buffHash);
        BattleList.setDefenderState(_battleId, BattleState.Confirmed);
        }

        // TODO需要一个event通知前端验证buff
        emit BattleConfirmed(_battleId, _msgSender(), _buffHash);
    }

    function initPlayerHp(address _player) public view returns (uint256) {
        uint256 time = Player.getLastBattleTime(_player);
        uint256 maxHp = Player.getHp(_player);
        uint256 hp = Player.getHp(_player);

        if (hp > maxHp) {
            return maxHp;
        }

        uint256 elapsedTime = block.timestamp - time;
        uint256 increase = (elapsedTime / 10) / 100 * maxHp ; 
        hp = hp + increase;
        return (hp > maxHp) ? maxHp : hp;
  }
}