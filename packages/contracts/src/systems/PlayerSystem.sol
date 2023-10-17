// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Player, GlobalConfig } from "../codegen/Tables.sol";
import { GLOBAL_CONFIG_KEY, PLAYER_KEY } from "../Constants.sol";
import { User, Loot } from "./library/Interface.sol";
import { console } from "forge-std/console.sol";

contract PlayerSystem is System {
    function getInfo(address addr) public view returns (string memory, string memory) {
        return (Player.getName(addr), Player.getUrl(addr));
    }

    function setInfo(string memory name, string memory url) public {
        address addr = _msgSender();
        Player.setName(addr, name);
        Player.setUrl(addr, url);
    }

    function transfer(address addr, uint16 x, uint16 y) public {
       Player.setX(addr, x);
       Player.setY(addr, y);
    }

    function getPosition(address addr) public  view returns (uint16, uint16) {
       uint16 x = Player.getX(addr);
       uint16 y = Player.getY(addr);
       return(x, y);
    }

    function getSenderPosition() public  view returns (uint16, uint16) {
       uint16 x = Player.getX(_msgSender());
       uint16 y = Player.getY(_msgSender());
       return(x, y);
    }

    function selectUserNft(uint256 tokenId) public {
        // Player.selectNft(_msgSender(), tokenId);
        address userAddress  = GlobalConfig.getUserContract(GLOBAL_CONFIG_KEY);
        User user = User(userAddress);
        require(user.ownerOf(tokenId) == _msgSender(), "You are not the owner of this NFT");
        // uint256 hp = user.getStructInfo(tokenId);
        // console.log("hp: ", hp);
        // Player.setHp(_msgSender(), hp);
    }

    function getUserInfo(uint256 tokenId) public view returns (uint256) {
        address userAddress  = GlobalConfig.getUserContract(GLOBAL_CONFIG_KEY);
        User user = User(userAddress);
        user.getStructInfo(tokenId);
        return 0;
    }

    function getLootInfo(uint256 tokenId) public pure returns (uint256) {
        return 0;
    }
}