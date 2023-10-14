// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Player } from "../codegen/Tables.sol";

contract PlayerSystem is System {
    bytes32 constant PLAYER_KEY = keccak256("Player-Key");



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




}