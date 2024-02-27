// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import { GameConfig,Player,PlayerSeason } from "../codegen/index.sol";
import { BattleState, Buff, PlayerState } from "../codegen/common.sol";
import { BattleListData, BattleList, Player, PlayerData, PlayerLocationLock, BoxListData, BoxList, RandomList, RandomListData } from "../codegen/index.sol";
import { Position } from "./Common.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";

contract GameSystem is System {
  bytes32 constant GAME_KEY = keccak256("Game-Key");

  function submitGem() external{
    address sender = _msgSender();
    require(Player.getState(sender) == PlayerState.Preparing, "You should in Preparing state");
    uint16 gemBalance = Player.getOreBalance(sender);
    uint16 seasonBalance = PlayerSeason.getOreBalance(sender);
    PlayerSeason.setOreBalance(sender,seasonBalance+gemBalance);
    Player.setOreBalance(sender,0);
    
  }
  

}
