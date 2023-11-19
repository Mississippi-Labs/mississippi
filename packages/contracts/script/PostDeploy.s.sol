// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { GameConfigInit } from "./GameConfigInit.sol";
import { BattleConfigInit } from "./BattleConfigInit.sol";
import { GlobalConfigInit } from "./GlobalConfigInit.sol";
import { console } from "forge-std/console.sol";
import "../src/other/User.sol";
import "../src/other/Loot.sol";
import '../src/other/Plugin.sol';

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    console.log(" ========== PostDeploy  ========== ");
    // MUser muser = new MUser(2, "MUser", "MUser", "", "");
    // MLoot mloot = new MLoot("", "MLOOT", "MLOOT", "", 2);
    // MPlugin mplugin = new MPlugin(address(mloot),address(muser));

    // ------------------ INIT ------------------
    GameConfigInit.initGameConfig(IWorld(worldAddress));
    BattleConfigInit.initBattleConfig(IWorld(worldAddress));
    GlobalConfigInit.initGlobalConfig(IWorld(worldAddress), address(0x394265F0592865D6aBecA8d98DcBC7B67D272944),address(0x394265F0592865D6aBecA8d98DcBC7B67D272944),address(0x394265F0592865D6aBecA8d98DcBC7B67D272944));

    vm.stopBroadcast();

  }
}
