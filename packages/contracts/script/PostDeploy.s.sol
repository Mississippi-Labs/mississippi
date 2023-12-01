// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { GameConfigInit } from "./GameConfigInit.sol";
import { BattleConfigInit } from "./BattleConfigInit.sol";
import { GlobalConfigInit } from "./GlobalConfigInit.sol";
import { console } from "forge-std/console.sol";
// import "../src/other/User.sol";
// import "../src/other/Loot.sol";
// import '../src/other/Plugin.sol';

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // console.log(" ========== PostDeploy  ========== ");
    // MUser muser = new MUser(2, "MUser", "MUser", "", "");
    // MLoot mloot = new MLoot("", "MLOOT", "MLOOT", "", 2);
    // MPlugin mplugin = new MPlugin(address(mloot),address(muser));
    address muser = 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9;
   address mloot = 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9;
   address mplugin = 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707;

    // ------------------ INIT ------------------
    GameConfigInit.initGameConfig(IWorld(worldAddress));
    BattleConfigInit.initBattleConfig(IWorld(worldAddress));
    GlobalConfigInit.initGlobalConfig(IWorld(worldAddress), muser,mloot,mplugin);

    vm.stopBroadcast();

  }
}
