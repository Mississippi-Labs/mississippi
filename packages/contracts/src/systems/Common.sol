// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

struct Position {
    uint16 x;
    uint16 y;
    bytes32[] proof;
}

struct Coordinate {
       uint16 x;
       uint16 y;
    }

// struct BattleParam {
//     uint256 attackerPower;
//     uint256 defenderPower;
//     Buff attackerBuff;
//     Buff defenderBuff;
// }