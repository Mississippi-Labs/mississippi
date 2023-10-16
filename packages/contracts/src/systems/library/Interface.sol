// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

// User
interface User {
    function getStructInfo(uint256 tokenId) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
}

// Loot
interface Loot {
    function balanceOf(address account) external view returns (uint256);
}



