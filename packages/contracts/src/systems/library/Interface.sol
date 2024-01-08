// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

// User
interface User {
    function getStructInfo(uint256 tokenId) external view returns (uint256,uint256,uint256,uint256,uint256,uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function getUserTokenIdList() external view returns (uint256[] memory);
    function mint(address _addr) external;
    function revealNFT(uint256 _tokenId) external;
}

// Loot
interface Loot {
    function ownerOf(uint256 tokenId) external view returns (address);
    function getStructInfo(uint256 tokenId) external view returns (string memory,string memory,string memory,string memory,string memory,string memory,string memory,string memory);
    function mint(address _addr) external;
    function revealNFT(uint256 _tokenId) external;
}



