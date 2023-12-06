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
    address muser = 0xBC9129Dc0487fc2E169941C75aABC539f208fb01;
   address mloot = 0x6e989C01a3e3A94C973A62280a72EC335598490e;
   address mplugin = 0xF6168876932289D073567f347121A267095f3DD6;

    // ------------------ INIT ------------------
    GameConfigInit.initGameConfig(IWorld(worldAddress));
    BattleConfigInit.initBattleConfig(IWorld(worldAddress));
    GlobalConfigInit.initGlobalConfig(IWorld(worldAddress), muser,mloot,mplugin);

    vm.stopBroadcast();

  }
}
