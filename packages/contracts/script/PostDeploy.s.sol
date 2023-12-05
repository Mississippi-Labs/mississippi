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
    address muser = 0x09EC9819B6c3777c5C28C9Eebf5fb62cd0DbA479;
   address mloot = 0x1e2d1f94c944490D9151724D1809Ba5BF95D4dae;
   address mplugin = 0x89bEceA0d28b8b12314CC0b676cb2252639eC88f;

    // ------------------ INIT ------------------
    GameConfigInit.initGameConfig(IWorld(worldAddress));
    BattleConfigInit.initBattleConfig(IWorld(worldAddress));
    GlobalConfigInit.initGlobalConfig(IWorld(worldAddress), muser,mloot,mplugin);

    vm.stopBroadcast();

  }
}
