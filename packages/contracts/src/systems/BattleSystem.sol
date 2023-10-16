// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState } from "../codegen/Types.sol";
import { GameConfig, BattleConfig, BoxListData, BattleList, BattleListData, Player, PlayerData, PlayerLocationLock, BoxList } from "../codegen/Tables.sol";
import { BattleUtils } from "./library/BattleUtils.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";

contract BattleSystem is System {
  event BattleConfirmed(uint256 battleId, address sender, bytes32 buffHash);

  function checkBattlePlayer(BattleListData memory battle, BattleState _battleState) internal view {
    // BattleListData memory battle = BattleList.get(_battleId);

    BattleState battleState = battle.attacker == _msgSender() ? battle.attackerState : battle.defenderState;

    require(battle.attacker == _msgSender() || battle.defender == _msgSender(), "You are not in this battle");
    require(battleState == _battleState, "You are in the wrong state");

    require(!battle.isEnd, "Battle is end");
  }

  function confirmBattle(bytes32 _buffHash, uint256 _battleId) external {
    // 战斗是否有用户
    //战斗是否结束
    //是否已超时

    BattleListData memory battle = BattleList.get(_battleId);
    checkBattlePlayer(battle, BattleState.Inited);

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

  function revealBattle(uint256 _battleId, bytes32 _action, uint256 _arg, bytes32 _nonce) external {
    // check battle
    BattleListData memory battle = BattleList.get(_battleId);
    checkBattlePlayer(battle, BattleState.Confirmed);

    // TODO揭示阶段也应该添加时间限制
    // address attacker = BattleList.getAttacker(_battleId);

    bytes32 moveHash = battle.attacker == _msgSender()
      ? BattleList.getAttackerBuffHash(_battleId)
      : BattleList.getDefenderBuffHash(_battleId);

    bytes32 proofHash = keccak256(abi.encodePacked(_action, _arg, _nonce));
    require(moveHash == proofHash, "Invalid move hash proof");
    if (battle.attacker == _msgSender()) {
      BattleList.setAttackerAction(_battleId, _action);
      BattleList.setAttackerArg(_battleId, _arg);
      BattleList.setAttackerState(_battleId, BattleState.Revealed);
    } else {
      BattleList.setDefenderAction(_battleId, _action);
      BattleList.setDefenderArg(_battleId, _arg);
      BattleList.setDefenderState(_battleId, BattleState.Revealed);
    }
    if (battle.attackerState == BattleState.Revealed && battle.defenderState == BattleState.Revealed) {
      // 结算战斗
      revealWinner(_battleId);
    }
  }

  function revealWinner(uint256 _battleId) public {
    // 结算战斗
    BattleListData memory battle = BattleList.get(_battleId);
    checkBattlePlayer(battle, BattleState.Revealed);

    uint256 attackerFirepower = 100;
    uint256 defenderFirepower = 100;

    // address attacker = BattleList.getAttacker(_battleId);
    // address defender = BattleList.getDefender(_battleId);
    //用户的指令为attack,esacpe,useProps几种方案,attackArg和defenderArg分别是伴随指令传递的参数,对应执行attack,esacpe,useProps几个函数并传入参数
    // 默认用户的攻击力都为100,防御力都为100,攻击力和防御力在未来都是根据装备来判断
    //如果双方都执行attack,则对比buff,buff相同攻击力没有增益,否则按照water>fire>wind>water的顺序给优胜者增加50%攻击力
    //如果对方执行escape,则判断buff是否大于对方的buff,如果大于则对方逃跑成功
    if (battle.attackerAction == bytes32("attack") && battle.defenderAction == bytes32("attack")) {
      // Buff attackerBuff = Buff(battle.attackerArg);
      // Buff defenderBuff = Buff(battle.defenderArg);
      Buff attackerBuff = Buff(battle.attackerArg);
      Buff defenderBuff = Buff(battle.defenderArg);
      // 任意攻击buff都强于None
      uint256 attackerAttackPower = BattleUtils.getAttackPower(attackerBuff, defenderBuff, attackerFirepower);
      uint256 defenderAttackPower = BattleUtils.getAttackPower(defenderBuff, attackerBuff, defenderFirepower);

      BattleList.setAttackerHP(_battleId, BattleUtils.getAttackResult(battle.attackerHP, defenderAttackPower));
      BattleList.setDefenderHP(_battleId, BattleUtils.getAttackResult(battle.defenderHP, attackerAttackPower));

      if (battle.attackerHP == 0 || battle.defenderHP == 0) {
        address winner = battle.attackerHP == 0 ? battle.defender : battle.attacker;
        address looser = battle.attackerHP == 0 ? battle.attacker : battle.defender;
        // BattleList.setWinner(_battleId, winner);  // cause stack too deep compile error
        // BattleList.setIsEnd(_battleId, true);
        battle.winner = winner; //Todo: temmorary solution
        battle.isEnd = true;
        loseGame(looser, winner);
        Player.setHp(winner, initPlayerHp(winner));

        // TODO这里应该跟一个清算函数
        // 胜利者解除战斗形态,血量恢复20%
        // 失败者传送到非战区,血量回满
      }
    }

    if (battle.attackerAction == bytes32("escape") && battle.defenderAction == bytes32("escape")) {
      // 双方都逃走,则战斗结束(这里应该都传送到更远地方)
      // battle.isEnd = true;
      // battle.winer = address(0);

      BattleList.setIsEnd(_battleId, true);
      BattleList.setWinner(_battleId, address(0));

      return;
    }
    if (battle.attackerAction == bytes32("escape") && battle.defenderAction == bytes32("attack")) {
      Buff attackerBuff = Buff(battle.defenderArg);
      Buff defenderBuff = Buff(battle.defenderArg);
      // 任意攻击buff都强于None
      if (attackerBuff == defenderBuff || BattleUtils.compareBuff(attackerBuff, defenderBuff) == 2) {
        // 逃跑成功
        Player.setState(battle.attacker, PlayerState.Exploring);
        Player.setState(battle.defender, PlayerState.Exploring);
        // PlayerLocationLock[battle.defender] = block.timestamp; //将被逃跑方禁锢一段时间
        PlayerLocationLock.set(battle.defender, block.timestamp);
      } else {
        // 逃跑失败,被动挨打
        uint256 defenderAttackPower = BattleUtils.getAttackPower(defenderBuff, attackerBuff, defenderFirepower);
        // battle.attackerHP = BattleUtils.getAttackResult(
        //     battle.attackerHP,
        //     defenderAttackPower
        // );
        // if (battle.attackerHP == 0) {
        //     battle.winer = battle.defender;
        //     battle.isEnd = true;
        // }
        BattleList.setAttackerHP(_battleId, BattleUtils.getAttackResult(battle.attackerHP, defenderAttackPower));
        if (BattleList.getAttackerHP(_battleId) == 0) {
          // battle.winer = battle.defender;
          // battle.isEnd = true;
          BattleList.setWinner(_battleId, battle.defender);
          BattleList.setIsEnd(_battleId, true);
        }
      }
    }
    if (battle.attackerAction == bytes32("attack") && battle.defenderAction == bytes32("escape")) {
      Buff attackerBuff = Buff(battle.attackerArg);
      Buff defenderBuff = Buff(battle.defenderArg);
      // 任意攻击buff都强于None
      if (attackerBuff == defenderBuff || BattleUtils.compareBuff(defenderBuff, attackerBuff) == 2) {
        // 逃跑成功
        // Player[battle.defender].state = PlayerState.Exploring;
        // Player[battle.attacker].state = PlayerState.Exploring;
        // PlayerLocationLock[battle.attacker] = block.timestamp; //将被逃跑方禁锢一段时间
        Player.setState(battle.defender, PlayerState.Exploring);
        Player.setState(battle.attacker, PlayerState.Exploring);
        PlayerLocationLock.set(battle.attacker, block.timestamp);
      } else {
        // 逃跑失败,被动挨打
        uint256 attackerAttackPower = BattleUtils.getAttackPower(attackerBuff, defenderBuff, attackerFirepower);

        // BattleList.setDefenderHP(_battleId, BattleUtils.getAttackResult(
        //     battle.defenderHP,
        //     attackerAttackPower
        // ));
        battle.defenderHP = BattleUtils.getAttackResult(battle.defenderHP, attackerAttackPower);

        if (battle.defenderHP == 0) {
          battle.winner = battle.attacker;
          battle.isEnd = true;

          // BattleList.setWinner(_battleId, battle.attacker);
          // BattleList.setIsEnd(_battleId, true);
        }
      }
    }
  }

  function getAttackResult(uint256 _hp, uint256 _attackPower) internal pure returns (uint256) {
    // TODO 后期添加防御力抵消对方的攻击力
    if (_attackPower > _hp) {
      return 0;
    }
    return _hp - _attackPower;
  }

  function initPlayerHp(address _player) public returns (uint256) {
      uint256 time = Player.getLastBattleTime(_player);
      uint256 hp = Player.getHp(_player);

      uint256 elapsedTime = block.timestamp - time;
      uint256 maxHp = 10000; // Todo: max hp slot 
      uint256 increase = (elapsedTime / 10) / 100 * maxHp ; 
      hp = hp + increase;

    return (hp > maxHp) ? maxHp : hp;
  
  }

  function raisePlayerHp(uint256 _targetHP, uint256 _percent, address _player) public {
    Player.setHp(_player, (_targetHP * _percent) / 100);
  }

  function loseGame(address _looser, address _winner) internal {
    // 游戏失败,将用户脱离战区,血量回满
    // TODO 背包系统,宝物系统

    outBattlefield(_looser);
    PlayerData memory losser = Player.get(_looser);
    uint256 boxId = GameConfig.getBoxId(GAME_CONFIG_KEY);
    BoxListData memory box;
    box.x = losser.x;
    box.y = losser.y;
    box.opened = true;
    box.openTime = block.timestamp;
    box.owner = _winner;
    box.oreBalance = losser.oreBalance;
    box.treasureBalance = losser.treasureBalance;
    box.dropTime = block.timestamp;
    BoxList.set(GameConfig.getRoomId(GAME_CONFIG_KEY), boxId, box);

    Player.setOreBalance(_looser, 0);
    Player.setTreasureBalance(_looser, 0);
    GameConfig.setRoomId(GAME_CONFIG_KEY, boxId + 1);
  }

  function goHome() external {
    // 回家,将用户脱离战区,血量回满

    PlayerData memory player = Player.get(_msgSender());
    require(player.state == PlayerState.Exploring, "You should in exploring state");
    require(
      player.x == GameConfig.getOriginX(GAME_CONFIG_KEY) && player.y == GameConfig.getOriginY(GAME_CONFIG_KEY),
      "You are not in the origin point"
    );
    outBattlefield(_msgSender());
  }

  function getAttackPower(Buff _myBuff, Buff _targetBuff, uint256 _attackPower) internal pure returns (uint256) {
    // TODO 后期添加防御力抵消对方的攻击力
    if (compareBuff(_myBuff, _targetBuff) == 0) {
      return (_attackPower * 7) / 10;
    }
    if (compareBuff(_myBuff, _targetBuff) == 2) {
      return (_attackPower * 13) / 10;
    }

    return _attackPower;
  }

  function compareBuff(Buff _myBuff, Buff _targetBuff) internal pure returns (uint256) {
    // 0表示失败,1表示相当,2表示胜利
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

  function outBattlefield(address _player) internal {
    // 脱离战区,则将用户血量回满,坐标不变,状态改为准备中
    require(Player.getState(_player) == PlayerState.Exploring, "You should in exploring state");

    // Player.setHp(_player, initPlayerHp(_player)); Todo: setting to atacker or defender hp 
    for (uint256 i; i < BattleConfig.lengthBattlefieldPlayers(BATTLE_CONFIG_KEY); i++) {
      if (BattleConfig.getItemBattlefieldPlayers(BATTLE_CONFIG_KEY, i) == _player) {
        BattleConfig.updateBattlefieldPlayers(
          BATTLE_CONFIG_KEY,
          i,
          BattleConfig.getItemBattlefieldPlayers(
            BATTLE_CONFIG_KEY,
            BattleConfig.lengthBattlefieldPlayers(BATTLE_CONFIG_KEY) - 1
          )
        );
        BattleConfig.popBattlefieldPlayers(BATTLE_CONFIG_KEY);
        break;
      }
    }
    Player.setState(_player, PlayerState.Preparing);
    Player.setLastBattleTime(_player, block.timestamp);
  }
}