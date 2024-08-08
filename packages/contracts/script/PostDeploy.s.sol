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

    address muser = 0xEc30f284Ca8fD19967Ec2BbD07c2dc3B24A8D445;
    address mloot = 0x621C0403Fc19272043119389F63dE68F493184D1;
    address mplugin = 0x0B4aD32Cc29823FE7ff3A8E83BCe1B8689d13EB8;

    bytes32 merkleRoot = 0x5df91eca63323dbb115087ef262075c5bcea99b8eaf95f520efb8d48ff447499;

    IWorld(worldAddress).Init(muser, mloot, mplugin,merkleRoot);

    vm.stopBroadcast();
    // ------------------ INIT ------------------
  }
}
