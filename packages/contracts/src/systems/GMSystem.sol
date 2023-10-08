// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Season, GameConfig } from "../codegen/Tables.sol";
import { GAME_CONFIG_KEY } from "../Constants.sol";

contract GMSystem  {
    bytes32 constant MAP_KEY = keccak256("Season-Key");

    function GetSeasonInfo() public view returns (uint256, uint256, uint256) {
        uint256 start = Season.getStart(MAP_KEY);
        uint256 end = Season.getEnd(MAP_KEY);
        uint256 no = Season.getNo(MAP_KEY);

        return (start, end, no);
    }

    function SetSeasonInfo(uint256 start, uint256 end) public {
        require (start < end, "start must be less than end");
        
        uint256 now_end = Season.getEnd(MAP_KEY);
        require (start > now_end, "start must be more than prev end");

        Season.setStart(MAP_KEY, start);
        Season.setEnd(MAP_KEY, end);
        uint256 no = Season.getNo(MAP_KEY);
        Season.setNo(MAP_KEY, no+1);
    }

    function SetMapMerkleRoot(bytes32 root) public {
        GameConfig.setMerkleRoot(GAME_CONFIG_KEY, root);
    }

    
}