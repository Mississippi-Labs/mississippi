// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "@codegen/world/IWorld.sol";
import { GameConfigInit } from "./GameConfigInit.sol";
import { console } from "forge-std/console.sol";

import { GameConfig, GameConfigData } from "../src/codegen/index.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    console.log(" ========== PostDeploy  ========== ");

    address muser = 0xc5a5C42992dECbae36851359345FE25997F5C42d;
    address mloot = 0x67d269191c92Caf3cD7723F116c85e6E9bf55933;
    address mplugin = 0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E;
    bytes32 merkleRoot = 0x5df91eca63323dbb115087ef262075c5bcea99b8eaf95f520efb8d48ff447499;

    IWorld(worldAddress).Init(muser, mloot, mplugin,merkleRoot);

    vm.stopBroadcast();
    // ------------------ INIT ------------------
  }
}
