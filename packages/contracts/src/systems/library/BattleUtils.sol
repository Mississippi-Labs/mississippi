// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { BattleState, Buff, PlayerState } from "../../codegen/common.sol";
import { BattleListData,BattleList1Data,BattleList,BattleList1, Player, PlayerParams,BattleConfig, GameConfig, PlayerData, BoxListData, BoxList } from "../../codegen/index.sol";
import { BATTLE_CONFIG_KEY, GAME_CONFIG_KEY } from "../../Constants.sol";

library BattleUtils {
  function compareBuff(Buff _myBuff, Buff _targetBuff) internal pure returns (uint256) {
    // 0: fail , 1: equal , 2: success
    // "Fire"< "Water"<"Wind"

    if (
      (_myBuff == Buff.Water && _targetBuff == Buff.Fire) ||
      (_myBuff == Buff.Wind && _targetBuff == Buff.Water) ||
      (_myBuff == Buff.Fire && _targetBuff == Buff.Wind)
    ) {
      return 2;
    }
    if (
      (_myBuff == Buff.Fire && _targetBuff == Buff.Water) ||
      (_myBuff == Buff.Water && _targetBuff == Buff.Wind) ||
      (_myBuff == Buff.Wind && _targetBuff == Buff.Fire)
    ) {
      return 0;
    }
    return 1;
  }

  function _goPreparing(address _player) internal {
    PlayerParams.setHp(_player, PlayerParams.getMaxHp(_player));
    Player.setLastBattleTime(_player, 0); //清除战斗标记
    Player.setState(_player, PlayerState.Preparing);
  }

  function getAttackResult(uint256 _hp, uint256 _attackPower) internal pure returns (uint256) {
    // TODO 后期添加防御力抵消对方的攻击力
    // 如果攻击力大于血量,则血量最多扣为0
    return _attackPower > _hp?0:_hp - _attackPower;
  }

  function getAttackPower(Buff _myBuff, Buff _targetBuff, uint256 _attackPower) internal pure returns (uint256) {
    // TODO 后期添加防御力抵消对方的攻击力
    if (compareBuff(_myBuff, _targetBuff) == 0) {
      return (_attackPower * 5) / 10;
    }
    if (compareBuff(_myBuff, _targetBuff) == 2) {
      return (_attackPower * 15) / 10;
    }

    return _attackPower;
  }

  function checkBattlePlayer(
    BattleListData memory _battle,
    BattleList1Data  memory _battle1,
    address _msgSender,
    BattleState _battleState
  ) internal pure {
    
    BattleState battleState = _battle.attacker == _msgSender ? _battle1.attackerState : _battle1.defenderState;

    require(_battle.attacker == _msgSender || _battle.defender == _msgSender, "You are not in this _battle");
    require(battleState == _battleState, "You are in the wrong state");

    require(!_battle.isEnd, "Battle is end");
  }

  function endGame(address _looser,address _winner,uint256 _battleId) internal {
    // lose game; will go home and hp will full.
    //全局确认战胜方
      BattleList.setWinner(_battleId, _winner);
      BattleList.setIsEnd(_battleId, true);
    // 处理战败方
    // 爆装备
    uint256 boxId = GameConfig.getBoxId(GAME_CONFIG_KEY);
    PlayerData memory losser = Player.get(_looser);
    BoxListData memory box;
    box.x = losser.x;
    box.y = losser.y;
    box.opened = true;
    box.openTime = block.timestamp;
    box.owner = _winner;
    box.oreBalance = losser.oreBalance;
    box.treasureBalance = losser.treasureBalance;
    // box.dropTime = block.timestamp;
    BoxList.set(boxId, box);
    Player.setOreBalance(_looser, 0);
    Player.setTreasureBalance(_looser, 0);

    GameConfig.setBoxId(GAME_CONFIG_KEY, boxId + 1);
    // 回家
    _goPreparing(_looser);

    // 处理战胜方
    Player.setState(_winner, PlayerState.Exploring);
    Player.setLastBattleTime(_winner, block.timestamp);
    PlayerParams.setHp(_winner, BattleList.getAttackerHP(_battleId));


  }

 
}
