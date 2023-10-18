// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import { GameConfig } from "@codegen/Tables.sol";
import { BattleState, Buff, PlayerState } from "../codegen/Types.sol";
import { BattleListData, BattleList, Player, PlayerData, PlayerLocationLock, BoxListData, BoxList, RandomList, RandomListData } from "../codegen/Tables.sol";
import { Move } from "./Common.sol";

contract GameSystem is System {
  bytes32 constant GAME_KEY = keccak256("Game-Key");
  event NewRandom(uint256 randomId, address author);
  event MoveEvent(address indexed player, uint16 x, uint16 y);

  function settleBattle() external {}

  function createLootBox() external {}

  function takeLoot() external {}

  function dropLoot() external {}

}
