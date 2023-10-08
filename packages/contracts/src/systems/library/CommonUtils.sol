// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { BattleState, Buff, PlayerState } from "../../codegen/Types.sol";

library CommonUtils {
    function abs_substruction(
        uint16 a,
        uint16 b
    ) internal pure returns (uint16) {
        if (a > b) {
            return a - b;
        } else {
            return b - a;
        }
    }

    function isNear(
        uint16 _x1,
        uint16 _x2,
        uint16 _y1,
        uint16 _y2
    ) internal pure returns (bool) {
        uint16 x_diff = abs_substruction(_x1, _x2);
        uint16 y_diff = abs_substruction(_y1, _y2);
        return x_diff <= 1 && y_diff <= 1 && x_diff != y_diff;
    }

    function zeroSub(uint8 a, uint8 b) internal pure returns (uint8) {
        uint8 result = a > b ? a - b : 0;
        return result;
    }

    function dice(
        uint8 number,
        uint8 threshold,
        uint8 increaseX,
        uint8 increaseY
    ) internal pure returns (uint8) {
        //掷骰子,产生根据规则的随机数
        require(threshold > 0&&increaseY>0&&increaseX>0, "invalid params");
        uint8 result;
        number = zeroSub(number, threshold);
        if (number>0) {
            uint8 multiplier = number / increaseX;
            result = multiplier * increaseY;
            return result;
        } else {
            return 0;
        }
    }
}