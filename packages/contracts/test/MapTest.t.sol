// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";


contract MapTest is MudTest {
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

  // 测试流程
  // init 玩家1,2,3
  // 玩家1移动
  // 超过攻击范围玩家2无法攻击玩家1
  // 使用GMsystem生成一个宝箱在入口附近
  // 玩家2移动,触发boxSystem打开宝箱,并且在两个块后打开宝箱
  // 玩家2取出宝物
  // 玩家2可以向玩家1发起攻击
  // 玩家1选择强攻击策略并确认,玩家2选择弱攻击策略并确认
  // 玩家1揭示攻击策略,玩家2揭示攻击策略并自动结算
  // 揭示数值为玩家1对玩家2造成1.5倍攻击强度,玩家2对玩家1造成1倍攻击强度
  // 再次攻击一轮,期望:玩家2被击败,传送回初始点,玩家2原来的点生成宝箱
  // 期望玩家1血量不满
  // 玩家3在锁定期不可取走玩家2宝箱物品
  // 玩家1可以取走玩家2宝箱物品
  
}
