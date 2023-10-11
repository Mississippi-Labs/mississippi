// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { GameConfigInit } from "./GameConfigInit.sol";

contract TempRun is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // address w = address(0x2Bc1034975c3df48D6f3026802f372677844b85d);

    // ------------------ INIT ------------------
    // GameConfigInit.setInitPosition(IWorld(0x2Bc1034975c3df48D6f3026802f372677844b85d));
    (uint256 x, uint256 y) = GameConfigInit.getPosition(IWorld(worldAddress));
    console.log("======= result =======");
    console.log(x);
    console.log(y);

    vm.stopBroadcast();

  }
}
