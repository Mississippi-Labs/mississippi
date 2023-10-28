// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

// User
interface User {
    function getStructInfo(uint256 tokenId) external view returns (uint256,uint256,uint256,uint256,uint256,uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function getUserTokenIdList() external view returns (uint256[] memory);
}

// Loot
interface Loot {
    function ownerOf(uint256 tokenId) external view returns (address);
    function getStructInfo(uint256 tokenId) external view returns (string memory,string memory,string memory,string memory,string memory,string memory,string memory,string memory);
}



