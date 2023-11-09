// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { BattleState, Buff, PlayerState } from "../../codegen/Types.sol";
import { BattleListData, Player, BattleConfig, GameConfig, PlayerData, BoxListData, BoxList } from "../../codegen/Tables.sol";
import { BATTLE_CONFIG_KEY, GAME_CONFIG_KEY } from "../../Constants.sol";
import "forge-std/console.sol";

library BattleUtils {
    function compareBuff(
        Buff _myBuff,
        Buff _targetBuff
    ) internal pure returns (uint256) {
        // 0: fail , 1: equal , 2: success
        
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

    function getAttackResult(
        uint256 _hp,
        uint256 _attackPower
    ) internal pure returns (uint256) {
        // TODO 后期添加防御力抵消对方的攻击力
        if (_attackPower > _hp) {
            return 0;
        }
        return _hp - _attackPower;
    }

    function getAttackPower(
        Buff _myBuff,
        Buff _targetBuff,
        uint256 _attackPower
    ) internal pure returns (uint256) {
        // TODO 后期添加防御力抵消对方的攻击力
        if (compareBuff(_myBuff, _targetBuff) == 0) {
            return (_attackPower * 5) / 10;
        }
        if (compareBuff(_myBuff, _targetBuff) == 2) {
            return (_attackPower * 15) / 10;
        }

        return _attackPower;
    }

    function checkBattlePlayer(BattleListData memory _battle, address _msgSender,  
        BattleState _battleState) internal pure {
            
        BattleState battleState = _battle.attacker == _msgSender ? _battle.attackerState : _battle.defenderState;

        require(_battle.attacker == _msgSender || _battle.defender == _msgSender, "You are not in this _battle");
        require(battleState == _battleState, "You are in the wrong state");

        require(!_battle.isEnd, "Battle is end");
    }

    function outBattlefield(address _player) internal {
        // 脱离战区,则将用户血量回满,坐标不变,状态改为准备中
        require(Player.getState(_player) == PlayerState.Exploring, "You should in exploring state");

        // Player.setHp(_player, initPlayerHp(_player)); //Todo: setting to atacker or defender hp 
        // Player.setHp(_player, Player.getMaxHp(_player));

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

    function loseGame(address _looser, address _winner) internal {
        // lose game; will go home and hp will full.
        Player.setState(_looser, PlayerState.Exploring);
        outBattlefield(_looser);
    
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
        box.dropTime = block.timestamp;
        BoxList.set(boxId, box);
        Player.setOreBalance(_looser, 0);
        Player.setTreasureBalance(_looser, 0);

        GameConfig.setBoxId(GAME_CONFIG_KEY, boxId + 1);
    }
}