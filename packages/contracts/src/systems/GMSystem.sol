// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Season, GameConfig, BoxList, GlobalConfig} from "../codegen/index.sol";
import { GAME_CONFIG_KEY, GLOBAL_CONFIG_KEY } from "../Constants.sol";
import { Coordinate } from "./Common.sol";

contract GMSystem  is System {
    bytes32 constant MAP_KEY = keccak256("Season-Key");

    // season 
    function GetSeasonInfo() public view returns (uint256, uint256, uint256) {
        uint256 start = Season.getStart();
        uint256 end = Season.getEnd();
        uint256 no = Season.getNo();
        return (start, end, no);
    }

    // set season info 
    function SetSeasonInfo(uint256 _start, uint256 _end) public {
        require (_start < _end, "start must be less than end");
        
        uint256 now_end = Season.getEnd();
        require (_start > now_end, "start must be more than prev end");

        Season.setStart( _start);
        Season.setEnd( _end);
        uint256 no = Season.getNo();
        Season.setNo( no+1);
    }

    // merkle root
    function SetMapMerkleRoot(bytes32 _root) public {
        GameConfig.setMerkleRoot( _root);
    }

    // create box 
    function CreateBox(uint16 _x, uint16 _y) public {
        uint256 boxId = GameConfig.getBoxId();
        BoxList.setX(boxId, _x);
        BoxList.setY(boxId, _y);
        // BoxList.setDropTime(boxId, block.timestamp);
        GameConfig.setBoxId(boxId + 1);
    }

    function multCreateBox(Coordinate[] memory cList) public {
        for (uint i = 0; i < cList.length; i++) {
            CreateBox(cList[i].x, cList[i].y);
        }
    }

    // set user contract address 
    function SetUserContract(address _user) public {
        GlobalConfig.setUserContract( _user);
    }

    function setGmaeOpen(bool _b) external{
        GameConfig.setIsOpen( _b);
    }

    
    
}