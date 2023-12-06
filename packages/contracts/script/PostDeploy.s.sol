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

    address muser = 0x09EC9819B6c3777c5C28C9Eebf5fb62cd0DbA479;
    address mloot = 0x1e2d1f94c944490D9151724D1809Ba5BF95D4dae;
    address mplugin = 0x89bEceA0d28b8b12314CC0b676cb2252639eC88f;
    bytes32 merkleRoot = 0x5df91eca63323dbb115087ef262075c5bcea99b8eaf95f520efb8d48ff447499;

    IWorld(worldAddress).Init(muser, mloot, mplugin,merkleRoot);

    vm.stopBroadcast();
    // ------------------ INIT ------------------
  }
}
