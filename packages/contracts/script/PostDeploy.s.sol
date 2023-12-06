// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { GameConfigInit } from "./GameConfigInit.sol";
import { BattleConfigInit } from "./BattleConfigInit.sol";
import { GlobalConfigInit } from "./GlobalConfigInit.sol";
import { console } from "forge-std/console.sol";

import { GameConfig, GameConfigData } from "../src/codegen/index.sol";



// import "../src/other/User.sol";
// import "../src/other/Loot.sol";
// import '../src/other/Plugin.sol';

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
    address muser = 0x870526b7973b56163a6997bB7C886F5E4EA53638;
   address mloot = 0xD49a0e9A4CD5979aE36840f542D2d7f02C4817Be;
   address mplugin = 0xe1Fd27F4390DcBE165f4D60DBF821e4B9Bb02dEd;
  IWorld(worldAddress).Init(muser,mloot,mplugin);
  // 



// GameConfigInit.initGameConfig(IWorld(worldAddress));
    // BattleConfigInit.initBattleConfig(IWorld(worldAddress));
    // GlobalConfigInit.initGlobalConfig(IWorld(worldAddress), muser,mloot,mplugin);
   

    vm.stopBroadcast();
     // ------------------ INIT ------------------
    

  }
}
