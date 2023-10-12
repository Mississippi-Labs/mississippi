// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/store/src/MudTest.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { Move } from "../src/systems/Common.sol";
import { GAME_CONFIG_KEY } from "../src/Constants.sol";
import { Player, GameConfig } from "../src/codegen/Tables.sol";

contract MoveTest is MudTest {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function testMove() public {
    Move[] memory moveList = new Move[](5); 
    bytes32[] memory firstStepProof = new bytes32[](12);    
    firstStepProof[0] = 0x3c553fde73077fda8f45fda2de51b8686c9a1fb3f28dd09b33a5b09e3a07bb1a;
    firstStepProof[1] = 0x738d9a75efec0d2ae8a1c1b95f790abedbb9b2ae7cfcda3cb2fd7a439a983fff;
    firstStepProof[2] = 0x67baa5a2ed53ea681ca3c6c4279d091023e5cc51cd0ddc18bae1b6ebdaf619d9;
    firstStepProof[3] = 0xa7ce92f2e46cb574d31368d9ac41b2ad885da3acee3f41220e23ee09c163f267;
    firstStepProof[4] = 0xb70f38c7c325ca2562d4d682c0e669dc73fb18f252c4b7b342d30a7bb3faeb03;
    firstStepProof[5] = 0x85484a751a7139731e1aeed8485077bdcb14489e201320f707ace7f2bae00fac;
    firstStepProof[6] = 0x4c69a9f677be88821a5e1ddbb885a8e34f8a9397549c49ad469a9bfceded2973;
    firstStepProof[7] = 0xe497c69d081436eca071073000e2da478d3de28f39d567a62eb82e9bd46236c7;
    firstStepProof[8] = 0xe81295af9358cdb786aae5a18d41cc7849576b756144a9c240cb5fbe1e6d624b;
    firstStepProof[9] = 0x6f7a0a4df3b5476bc5e5165ea9ac5f476650cfc77164c0f5fa7ee262fb97bf4a;
    firstStepProof[10] = 0x831e9655b156ff25576973080888425e8358cbeb7c195a78e6fe7466e4517e26;
    firstStepProof[11] = 0x320198d7c3c91650c38ed06892226e026e1f2141520371bdf190d4876287a043;
    
    bytes32[] memory secondStepProof = new bytes32[](12);
    secondStepProof[0] = 0x884cafc5d3561f92efc3c309f37eeda7f4307015287109d401f92c9b19ac1ff8;
    secondStepProof[1] = 0x3e4bff41f64d9fb63a360f57d724bc34db8db844d717b05c55a2ba78171230e3;
    secondStepProof[2] =    0x67baa5a2ed53ea681ca3c6c4279d091023e5cc51cd0ddc18bae1b6ebdaf619d9;
    secondStepProof[3] =    0xa7ce92f2e46cb574d31368d9ac41b2ad885da3acee3f41220e23ee09c163f267;
    secondStepProof[4] =    0xb70f38c7c325ca2562d4d682c0e669dc73fb18f252c4b7b342d30a7bb3faeb03;
    secondStepProof[5] =    0x85484a751a7139731e1aeed8485077bdcb14489e201320f707ace7f2bae00fac;
    secondStepProof[6] =    0x4c69a9f677be88821a5e1ddbb885a8e34f8a9397549c49ad469a9bfceded2973;
    secondStepProof[7] =    0xe497c69d081436eca071073000e2da478d3de28f39d567a62eb82e9bd46236c7;
    secondStepProof[8] =    0xe81295af9358cdb786aae5a18d41cc7849576b756144a9c240cb5fbe1e6d624b;
    secondStepProof[9] =    0x6f7a0a4df3b5476bc5e5165ea9ac5f476650cfc77164c0f5fa7ee262fb97bf4a;
    secondStepProof[10] =    0x831e9655b156ff25576973080888425e8358cbeb7c195a78e6fe7466e4517e26;
    secondStepProof[11] =    0x320198d7c3c91650c38ed06892226e026e1f2141520371bdf190d4876287a043;

    bytes32[] memory thirdStepProof =  new bytes32[](12);
    thirdStepProof[0] = 0x6f82de3fd5b27340fe920e0696f715eee718b48e7ebce574c9d48c6257dbdd34;
    thirdStepProof[1] = 0x3e4bff41f64d9fb63a360f57d724bc34db8db844d717b05c55a2ba78171230e3;
    thirdStepProof[2] = 0x67baa5a2ed53ea681ca3c6c4279d091023e5cc51cd0ddc18bae1b6ebdaf619d9;
    thirdStepProof[3] = 0xa7ce92f2e46cb574d31368d9ac41b2ad885da3acee3f41220e23ee09c163f267;
    thirdStepProof[4] = 0xb70f38c7c325ca2562d4d682c0e669dc73fb18f252c4b7b342d30a7bb3faeb03;
    thirdStepProof[5] = 0x85484a751a7139731e1aeed8485077bdcb14489e201320f707ace7f2bae00fac;
    thirdStepProof[6] = 0x4c69a9f677be88821a5e1ddbb885a8e34f8a9397549c49ad469a9bfceded2973;
    thirdStepProof[7] = 0xe497c69d081436eca071073000e2da478d3de28f39d567a62eb82e9bd46236c7;
    thirdStepProof[8] = 0xe81295af9358cdb786aae5a18d41cc7849576b756144a9c240cb5fbe1e6d624b;
    thirdStepProof[9] = 0x6f7a0a4df3b5476bc5e5165ea9ac5f476650cfc77164c0f5fa7ee262fb97bf4a;
    thirdStepProof[10] = 0x831e9655b156ff25576973080888425e8358cbeb7c195a78e6fe7466e4517e26;
    thirdStepProof[11] = 0x320198d7c3c91650c38ed06892226e026e1f2141520371bdf190d4876287a043;
        
    bytes32[] memory fourthStepProof = new bytes32[](12);
    fourthStepProof[0] = 0x05666321b37b8ba0b6a73f1f753cff18dd7cae0017d1289a78c96247ad6170b9;
    fourthStepProof[1] = 0x39e180577f6043bf791a00250a516f9eb95e97f14b1c09273f50a8df764ad0dd;
    fourthStepProof[2] = 0x2eb23cd480600e0402815765829471bf6b3d1bce4f71244c4f136adb8bdf928b;
    fourthStepProof[3] = 0x275440f4d8bad008cebb4cc1490c178784579acaf42d90b44f1f1c16bed7381b;
    fourthStepProof[4] = 0xcdfebeab2204a94696eb3556fd0fc6d198f834d102510816ee1ef663aa97c954;
    fourthStepProof[5] = 0xb88c434ed19cc9f1e7dc990b7639fb1fe4f7a6ed54e0999553d054ff6a6c8ee1;
    fourthStepProof[6] = 0x0e45564c884d27cea7376367e556d92615912c98645b997e9fc197ef1ba066f6;
    fourthStepProof[7] = 0xe497c69d081436eca071073000e2da478d3de28f39d567a62eb82e9bd46236c7;
    fourthStepProof[8] = 0xe81295af9358cdb786aae5a18d41cc7849576b756144a9c240cb5fbe1e6d624b;
    fourthStepProof[9] = 0x6f7a0a4df3b5476bc5e5165ea9ac5f476650cfc77164c0f5fa7ee262fb97bf4a;
    fourthStepProof[10] = 0x831e9655b156ff25576973080888425e8358cbeb7c195a78e6fe7466e4517e26;
    fourthStepProof[11] = 0x320198d7c3c91650c38ed06892226e026e1f2141520371bdf190d4876287a043;


    bytes32[] memory fifthStepProof = new bytes32[](12);
    fifthStepProof[0] = 0xbd2f9cdc0ae6b5ec81fbb4a2e7b1503ca21e0dbeb97357d03f77c704b451ec72;
    fifthStepProof[1] = 0xecd36c04f91c7161aaaf2637d2684c017c9540c776c7dc7375bc149b041ef111;
    fifthStepProof[2] = 0x5e7fdaf247a41dfbb6f837b839fde933ae08489d513dfa6768c4361884378a31;
    fifthStepProof[3] = 0xf1210557ca6b6120672478350c09791e460b1873f5811dba306650a5ec599bd8;
    fifthStepProof[4] = 0x1b6bd9213f54c0364694f82ecc30f055ce8bf7664898d9f08d5f198013291df0;
    fifthStepProof[5] = 0xb47c8ec141b752217c76f882ea92282045668a0d0a02d9e56e0dee79140dc00f;
    fifthStepProof[6] = 0xc565e177b26d05bcae02b9e1767dff5c27dd724c8932b3c42a9a5a699f205825;
    fifthStepProof[7] = 0xcb1450a34269600496f4a9d0ebd1a7d6aa55e9d44660354cc6d73aebb95dc26d;
    fifthStepProof[8] = 0xe81295af9358cdb786aae5a18d41cc7849576b756144a9c240cb5fbe1e6d624b;
    fifthStepProof[9] = 0x6f7a0a4df3b5476bc5e5165ea9ac5f476650cfc77164c0f5fa7ee262fb97bf4a;
    fifthStepProof[10] = 0x831e9655b156ff25576973080888425e8358cbeb7c195a78e6fe7466e4517e26;
    fifthStepProof[11] = 0x320198d7c3c91650c38ed06892226e026e1f2141520371bdf190d4876287a043;
    

    moveList[0] = Move(5, 4, firstStepProof);
    moveList[1] = Move(6, 4, secondStepProof);
    moveList[2] = Move(7, 4, thirdStepProof);
    moveList[3] = Move(7, 5, fourthStepProof);
    moveList[4] = Move(7, 6, fifthStepProof);

    address tom = msg.sender;
    console.log(" msg.Sender ", tom);
    vm.startPrank(vm.addr(vm.envUint("PRIVATE_KEY")));
    Player.setX(world, tom, 4);
    Player.setY(world, tom, 4);
    bytes32 merkleRoot = 0x5df91eca63323dbb115087ef262075c5bcea99b8eaf95f520efb8d48ff447499;
    GameConfig.setMerkleRoot(world, GAME_CONFIG_KEY, merkleRoot);
    vm.stopPrank();

    console.log(" player x : ", Player.getX(world, tom));
    console.log(" player y : ", Player.getY(world, tom));
    console.log(" msg.Sender ", tom);
    
    vm.startPrank(vm.addr(vm.envUint("PRIVATE_KEY")));
    world.move(moveList);
    vm.stopPrank();

   
  }

}
