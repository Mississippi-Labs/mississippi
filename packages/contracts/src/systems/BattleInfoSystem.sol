// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { BattleState, Buff, PlayerState, BattleEndType } from "../codegen/common.sol";
import { GameConfig, BattleConfig, BoxListData, BattleList, BattleListData, Player, PlayerData, PlayerLocationLock, BoxList } from "../codegen/index.sol";
import { BattleUtils } from "./library/BattleUtils.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../Constants.sol";

contract BattleInfoSystem is System {
    function getBattlePlayerHp(uint _battleId, address addr) public view returns (uint) {
        BattleListData memory battle = BattleList.get(_battleId);
        require(battle.attacker == addr || battle.defender == addr, "not the battle player");
        return battle.attacker == addr ? battle.attackerHP : battle.defenderHP;
    }


}