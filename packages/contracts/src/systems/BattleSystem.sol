// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState, BattleEndType } from "@codegen/Types.sol";
import { GameConfig, BattleConfig, BoxListData, BattleList, BattleListData, Player, PlayerData, PlayerLocationLock, BoxList } from "@codegen/Tables.sol";
import { BattleUtils } from "./library/BattleUtils.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";

contract BattleSystem is System {
  event BattleReveal(uint256 battleId, address sender);
  event BattleEnd(uint256 battleId, BattleEndType endType, address winner);

  function revealBattle(uint256 _battleId, bytes32 _action, uint256 _arg, bytes32 _nonce) external {
    // check battle
    // TODO  揭示后全局event提示已经揭示(battle_id,address)
    BattleListData memory battle = BattleList.get(_battleId);
    BattleUtils.checkBattlePlayer(battle, _msgSender(), BattleState.Confirmed);

    // TODO 揭示阶段也应该添加时间限制 //Todo ???

    bytes32 buffHash = battle.attacker == _msgSender()
      ? BattleList.getAttackerBuffHash(_battleId)
      : BattleList.getDefenderBuffHash(_battleId);

    bytes32 proofHash = keccak256(abi.encodePacked(_action, _arg, _nonce));
    require(buffHash == proofHash, "Invalid buff hash proof");
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
    emit BattleReveal(_battleId, _msgSender());
  }

  function revealWinner(uint256 _battleId) public {
    // 结算战斗TODO revealWinner之后event
    // TODO 战斗全局结束后有event
    // TODO 战斗结束后如果没有人战败,也发一个event,表示当前局战斗结束了,但是整场战斗没有结束
    BattleListData memory battle = BattleList.get(_battleId);
    BattleUtils.checkBattlePlayer(battle, _msgSender(), BattleState.Revealed);

    //set attack 
    uint256 attackerFirepower = Player.getAttack(battle.attacker);
    uint256 defenderFirepower = Player.getAttack(battle.defender);

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

        // Todo:  setHP  // 胜利者解除战斗形态,血量恢复20%
        // Player.setHp(winner, initPlayerHp(winner));

        // TODO这里应该跟一个清算函数
        // 失败者传送到非战区,血量回满

        emit BattleEnd(_battleId, BattleEndType.NormalEnd, winner);
      }
    }

    if (battle.attackerAction == bytes32("escape") && battle.defenderAction == bytes32("escape")) {
      // 双方都逃走,则战斗结束(这里应该都传送到更远地方)
      // battle.isEnd = true;
      // battle.winer = address(0);

      BattleList.setIsEnd(_battleId, true);
      BattleList.setWinner(_battleId, address(0));

      emit BattleEnd(_battleId, BattleEndType.AllEscape, address(0));
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

          emit BattleEnd(_battleId, BattleEndType.NormalEnd, battle.defender);
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

          emit BattleEnd(_battleId, BattleEndType.NormalEnd, battle.attacker);
          // BattleList.setWinner(_battleId, battle.attacker);
          // BattleList.setIsEnd(_battleId, true);
        }
      }
    }

    if (!battle.isEnd) {
      emit BattleEnd(_battleId, BattleEndType.RoundEnd, address(0));
    }
  }

  function getAttackResult(uint256 _hp, uint256 _attackPower) internal pure returns (uint256) {
    // TODO 后期添加防御力抵消对方的攻击力
    if (_attackPower > _hp) {
      return 0;
    }
    return _hp - _attackPower;
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

  function outBattlefield(address _player) internal {
    // 脱离战区,则将用户血量回满,坐标不变,状态改为准备中
    require(Player.getState(_player) == PlayerState.Exploring, "You should in exploring state");

    // Player.setHp(_player, initPlayerHp(_player)); //Todo: setting to atacker or defender hp 
    Player.setHp(_player, Player.getMaxHp(_player));

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