// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState } from "../codegen/common.sol";
import { GameConfig, BattleConfig, BattleList,BattleList1, BattleListData,BattleList1Data, Player,PlayerParams, PlayerData, PlayerLocationLock } from "../codegen/index.sol";
import { BattleUtils } from "./library/BattleUtils.sol";
import { CommonUtils } from "./library/CommonUtils.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";
import { Position } from "./Common.sol";

contract BattlePrepareSystem is System {
  event AttackStart(address player, address target);
  event BattleConfirmed(uint256 battleId, address sender, bytes32 buffHash);

  function joinBattlefield() public {
    // 加入战区,用户实际上是送到原点,状态改为探索中
    address player = _msgSender();
    PlayerState playerState = Player.getState(player);
    require(playerState == PlayerState.Preparing || playerState == PlayerState.Idle, "You should in preparing state");
    //实际上是送到原点
    // TODO似乎可以直接通过indexer获取,就不需要再次插入了

    Player.setX(player, GameConfig.getOriginX(GAME_CONFIG_KEY));
    Player.setY(player, GameConfig.getOriginY(GAME_CONFIG_KEY));
    Player.setState(player, PlayerState.Exploring);
 
  }

  function goHome() external {
    // 回家,将用户脱离战区,血量回满
    PlayerData memory player = Player.get(_msgSender());
    require(player.state == PlayerState.Exploring, "You should in exploring state");
    require(
      player.x == GameConfig.getOriginX(GAME_CONFIG_KEY) && player.y == GameConfig.getOriginY(GAME_CONFIG_KEY),
      "You are not in the origin point"
    );
    BattleUtils._goPreparing(_msgSender());
  }


  function battleInvitation(address _targetAddress, Position[] memory positionList) external {
    // 一个格子只能有一个人
    // 判断对战双方的状态是否是Exploring
    require(
      positionList.length > 0 && positionList.length <= BattleConfig.getMaxAttackzDistance(BATTLE_CONFIG_KEY),
      "invalid attack distance"
    );
    require(positionList.length <= PlayerParams.getAttackRange(_msgSender()), "exceed player attackRange"); //Todo: temp remove

    require(
      Player.getState(_msgSender()) == PlayerState.Exploring &&
        Player.getState(_targetAddress) == PlayerState.Exploring,
      "Each player must be in exploring state"
    );
    require(
      Player.getX(_targetAddress) == positionList[positionList.length - 1].x &&
        Player.getY(_targetAddress) == positionList[positionList.length - 1].y,
      "Target must be in the end of continuity"
    );
    // check continuity
    CommonUtils.CheckContinuity(_msgSender(), positionList);

    Player.setState(_msgSender(), PlayerState.Attacking);
    Player.setState(_targetAddress, PlayerState.Attacking);

    // Player.setHp(_msgSender(), initPlayerHp(_msgSender()));
    // Player.setHp(_targetAddress, initPlayerHp(_targetAddress)); //战斗结算才需要设置hp

    uint256 battleId = GameConfig.getBattleId(GAME_CONFIG_KEY);
    BattleList.setAttacker(battleId, _msgSender());
    BattleList.setDefender(battleId, _targetAddress);
    BattleList.setAttackerHP(battleId, initPlayerHp(_msgSender()));
    BattleList.setDefenderHP(battleId, initPlayerHp(_targetAddress));
    // BattleList.setStartTimestamp(battleId, block.timestamp);
    // BattleList.setEndTimestamp(battleId, block.timestamp); //结束时才需要设置
    GameConfig.setBattleId(GAME_CONFIG_KEY, battleId + 1);

    emit AttackStart(_msgSender(), _targetAddress);
  }

  function confirmBattle(bytes32 _buffHash, uint256 _battleId) external {
    // 战斗是否有用户,用户是否在当前战斗//战斗是否结束//是否已超时
    require(!BattleList.getIsEnd(_battleId),"battel already end");
    
    
    BattleListData memory battle = BattleList.get(_battleId);
    BattleList1Data memory battle1 = BattleList1.get(_battleId);
    BattleUtils.checkBattlePlayer(battle,battle1, _msgSender(), BattleState.Inited);

    // require(block.timestamp - battle.startTimestamp < BattleConfig.getMaxTimeLimit(BATTLE_CONFIG_KEY), "Battle is timeout");
    // TODO超时不可选择buff
    
    // 当前实现方法非常不优雅,使用两个额外存储槽来存储用户的选择
    if (battle.attacker == _msgSender()) {
      BattleList1.setAttackerBuffHash(_battleId, _buffHash);
      BattleList1.setAttackerState(_battleId, BattleState.Confirmed);
    } else {
      BattleList1.setDefenderBuffHash(_battleId, _buffHash);
      BattleList1.setDefenderState(_battleId, BattleState.Confirmed);
    }

    BattleList.setEndTimestamp(_battleId, block.timestamp);

    // TODO需要一个event通知前端验证buff
    emit BattleConfirmed(_battleId, _msgSender(), _buffHash);
  }

  function initPlayerHp(address _player) public returns (uint256) {
    uint256 lastBattleTime = Player.getLastBattleTime(_player);
    uint256 maxHp = PlayerParams.getMaxHp(_player);
    uint256 increase;
    if (lastBattleTime != 0) {
      increase = (((block.timestamp - lastBattleTime) / 10) * maxHp) / 100;
    }
    uint256 hp = PlayerParams.getHp(_player) + increase;
    Player.setLastBattleTime(_player, 0);

    return hp > maxHp ? maxHp : hp;
  }
}
