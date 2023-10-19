// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

struct Position {
    uint16 x;
    uint16 y;
    bytes32[] proof;
}