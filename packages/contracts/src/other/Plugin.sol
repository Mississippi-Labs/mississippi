// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { User, Loot } from  "@systems/library/Interface.sol";


contract MPlugin {
    address public lootAddress;
    address public userAddress;

    constructor(address _lootAddress,address _userAddress) {
        lootAddress = _lootAddress;
        userAddress = _userAddress;
    }


    function multMint() external {
        User user = User(userAddress);
        Loot loot = Loot(lootAddress);
        address _user = msg.sender;
        user.mint(_user);
        loot.mint(_user);
    }

    function multRevealNFT(uint256 _lootTokenId,uint256 _userTokenId) external {
        User user = User(userAddress);
        Loot loot = Loot(lootAddress);
        loot.revealNFT(_lootTokenId);
        user.revealNFT(_userTokenId);
    }

}