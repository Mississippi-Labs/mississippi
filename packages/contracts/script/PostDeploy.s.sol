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



    address muser = 0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35;
    address mloot = 0xA15BB66138824a1c7167f5E85b957d04Dd34E468;
    address mplugin = 0xb19b36b1456E65E3A6D514D3F715f204BD59f431;

    bytes32 merkleRoot = 0x5df91eca63323dbb115087ef262075c5bcea99b8eaf95f520efb8d48ff447499;

    IWorld(worldAddress).Init(muser, mloot, mplugin,merkleRoot);

    vm.stopBroadcast();
    // ------------------ INIT ------------------
  }
}
