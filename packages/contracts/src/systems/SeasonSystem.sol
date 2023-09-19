// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
// import { WorldContext } from "@latticexyz/world/src/WorldContext.sol";
// import { System } from "@latticexyz/world/src/System.sol";
import { Season } from "../codegen/Tables.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";

contract SeasonSystem is System {
    bytes32 constant MAP_KEY = keccak256("season-key");

    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    constructor() {
        _transferOwnership(_msgSender());
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    // bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // function _msgSender() internal view override(Context, WorldContext) returns (address sender) {
    //     assembly {
    //     // 96 = 256 - 20 * 8
    //     sender := shr(96, calldataload(sub(calldatasize(), 20)))
    //     }
    //     if (sender == address(0)) sender = msg.sender;
    // }

    // constructor() {
    //     // Grant the minter role to a specified account
    //     _grantRole(ADMIN_ROLE, _msgSender());
    // }

    function getInfo() public view returns (uint256, uint256, uint256) {
        uint256 start = Season.getStart(MAP_KEY);
        uint256 end = Season.getEnd(MAP_KEY);
        uint256 no = Season.getNo(MAP_KEY);

        return (start, end, no);
    }

    //Todo: add admin control 
    function setInfo(uint256 start, uint256 end) public onlyOwner{
        // require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not a admin");
        require (start < end, "start must be less than end");
        
        uint256 now_end = Season.getEnd(MAP_KEY);
        require (start > now_end, "start must be more than prev end");

        Season.setStart(MAP_KEY, start);
        Season.setEnd(MAP_KEY, end);
        uint256 no = Season.getNo(MAP_KEY);
        Season.setNo(MAP_KEY, no+1);
    }
}