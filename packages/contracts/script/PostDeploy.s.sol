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
    address muser = 0xA183bc858540FFf7bbB69A4053e22f1B055B5451;
   address mloot = 0xA311087e7B8916608e4323E9A692ab4d8e8FCd56;
   address mplugin = 0x75C289BDBbEA706748B4147F373AEA997617A1B5;

    // ------------------ INIT ------------------
    GameConfigInit.initGameConfig(IWorld(worldAddress));
    BattleConfigInit.initBattleConfig(IWorld(worldAddress));
    GlobalConfigInit.initGlobalConfig(IWorld(worldAddress), muser,mloot,mplugin);

    vm.stopBroadcast();

  }
}
