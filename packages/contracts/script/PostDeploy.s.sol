// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script ,console2} from "forge-std/Script.sol";
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



    address muser = 0x4C50c9Ff5466cC782c52a3c42694E68179DC7773;
    address mloot = 0xA4581E34903524F5Bf61787cF9C77611aB545459;

    address mplugin = 0xEDa2E64e337D85058A952427f26b24cbB8089F4C;



    bytes32 merkleRoot = 0x5df91eca63323dbb115087ef262075c5bcea99b8eaf95f520efb8d48ff447499;

    IWorld(worldAddress).Init(muser, mloot, mplugin,merkleRoot);

    vm.stopBroadcast();
    // ------------------ INIT ------------------
  }
}
