// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { MapData } from "../codegen/Tables.sol";

contract MapSystem is System {
  bytes32 constant MAP_KEY = keccak256("map-key");

  function initMap(int[] calldata array, uint xLen, uint yLen) public {
    require(array.length * 256 == xLen * yLen, "map array not equal size");
    MapData.set(MAP_KEY, xLen, yLen, array);
  }

  function getPos(uint x, uint y) public view returns (bool) {
    require(x < MapData.getXLen(MAP_KEY), " invalid x");
    require(y < MapData.getXLen(MAP_KEY), " invalid y");
    uint sum = y*64 + x;
    int val = MapData.getItemMapArray(MAP_KEY, sum/256);
  
    uint index = sum%256;
    int256 shifted = val >> index;
    
    if (val < 0) {
      shifted |= int256(-1) << (256 - index);
    }

    int256 mask = shifted & 1;
    
    return mask == 1 ? true : false;
  }
}
