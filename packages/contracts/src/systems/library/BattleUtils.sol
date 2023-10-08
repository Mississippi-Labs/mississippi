// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { BattleState, Buff, PlayerState } from "../../codegen/Types.sol";

library BattleUtils {
    function compareBuff(
        Buff _myBuff,
        Buff _targetBuff
    ) internal pure returns (uint256) {
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
            return (_attackPower * 7) / 10;
        }
        if (compareBuff(_myBuff, _targetBuff) == 2) {
            return (_attackPower * 13) / 10;
        }

        return _attackPower;
    }
}