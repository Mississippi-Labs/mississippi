// // SPDX-License-Identifier: MIT
// pragma solidity >=0.8.0;

// import {console} from "forge-std/console.sol";
// import "forge-std/Test.sol";
// import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
// import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";

// import { IWorld } from "../src/codegen/world/IWorld.sol";
// import { Position } from "../src/systems/Common.sol";
// import { GAME_CONFIG_KEY } from "../src/Constants.sol";
// import { Player, GameConfig, BattleList, RandomList, BoxList, BoxListData } from "../src/codegen/index.sol";
// import { Buff, BattleState } from "../src/codegen/common.sol";

// contract BoxTest is MudTest {
//     IWorld public world;
//     address bob = address(1);

//     function setUp() public override {
//         super.setUp();
//         world = IWorld(worldAddress);
//     }

//     function testOpenBox() public {
//         vm.startPrank(vm.addr(vm.envUint("PRIVATE_KEY")));
//         world.CreateBox(5,4);
//         Player.setX(bob, 4);
//         Player.setY(bob, 4);
//         Player.setStrength(bob, 5);
//         BoxListData memory _box = BoxList.get(1);
//         console.log(" box oreBalance , treasureBalance ", _box.oreBalance, _box.treasureBalance);
//         vm.stopPrank();

//         vm.startPrank(bob);
//         world.openBox(1);
//         vm.stopPrank();

//         vm.startPrank(vm.addr(vm.envUint("PRIVATE_KEY")));
//         console.log("author === ", RandomList.getAuthor(1));
//         vm.stopPrank();

//         // vm.rool();
//         console.log(" block height: ", block.number);
//         vm.roll(block.number + 2);
//         console.log(" after roll block height: ", block.number);

//         vm.startPrank(bob);
//         world.revealBox(1);
//         world.getCollections(1, 2, 0);
//         vm.stopPrank();
//     }
// }