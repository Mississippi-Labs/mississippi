// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Player, GlobalConfig } from "@codegen/Tables.sol";
import {PlayerState } from "@codegen/Types.sol";

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
        address sender = _msgSender();
        // Player.selectNft(_msgSender(), tokenId);
        address userAddress  = GlobalConfig.getUserContract(GLOBAL_CONFIG_KEY);
        User user = User(userAddress);
        require(user.ownerOf(tokenId) == sender, "You are not the owner of this NFT");
        (uint256 hp, uint256 attack ,uint256 attackRange, uint256 speed, uint256 strength,uint256 space) = user.getStructInfo(tokenId);
        Player.setMaxHp(sender, hp);
        Player.setHp(sender, hp);
        Player.setAttack(sender, attack);
        Player.setAttackRange(sender, attackRange);
        Player.setSpeed(sender, speed);
        Player.setStrength(sender, strength);
        Player.setSpace(sender, space);
    }

    function getUserInfo(uint256 tokenId) public view returns (uint256,uint256,uint256,uint256,uint256,uint256) {
        address userAddress  = GlobalConfig.getUserContract(GLOBAL_CONFIG_KEY);
        User user = User(userAddress);
        return user.getStructInfo(tokenId);
    }  
   function initUserInfo() external {
    // !!仅用于测试
        address _player = msg.sender;
        Player.setX(_player, 0);
        Player.setY(_player, 0);
        Player.setState(_player, PlayerState.Idle);
        Player.setHp(_player, 0);
   }
}