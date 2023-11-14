// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Season, GameConfig, BoxList, GlobalConfig} from "@codegen/Tables.sol";
import { GAME_CONFIG_KEY, GLOBAL_CONFIG_KEY } from "../Constants.sol";

contract GMSystem  is System {
    bytes32 constant MAP_KEY = keccak256("Season-Key");

    // season 
    function GetSeasonInfo() public view returns (uint256, uint256, uint256) {
        uint256 start = Season.getStart(MAP_KEY);
        uint256 end = Season.getEnd(MAP_KEY);
        uint256 no = Season.getNo(MAP_KEY);
        return (start, end, no);
    }

    // set season info 
    function SetSeasonInfo(uint256 _start, uint256 _end) public {
        require (_start < _end, "start must be less than end");
        
        uint256 now_end = Season.getEnd(MAP_KEY);
        require (_start > now_end, "start must be more than prev end");

        Season.setStart(MAP_KEY, _start);
        Season.setEnd(MAP_KEY, _end);
        uint256 no = Season.getNo(MAP_KEY);
        Season.setNo(MAP_KEY, no+1);
    }

    // merkle root
    function SetMapMerkleRoot(bytes32 _root) public {
        GameConfig.setMerkleRoot(GAME_CONFIG_KEY, _root);
    }

    // create box 
    function CreateBox(uint16 _x, uint16 _y) public {
        uint256 boxId = GameConfig.getBoxId(GAME_CONFIG_KEY);
        BoxList.setX(boxId, _x);
        BoxList.setY(boxId, _y);
        BoxList.setDropTime(boxId, block.timestamp);
        // BoxList.setOreBalance(boxId, _oreBalance);
        // BoxList.setTreasureBalance(boxId, _treasureBalance);
        GameConfig.setBoxId(GAME_CONFIG_KEY, boxId + 1);
    }

    // set user contract address 
    function SetUserContract(address _user) public {
        GlobalConfig.setUserContract(GLOBAL_CONFIG_KEY, _user);
    }

    function setGmaeOpen(bool _b) external{
        GameConfig.setIsOpen(GAME_CONFIG_KEY, _b);
    }

    
    
}