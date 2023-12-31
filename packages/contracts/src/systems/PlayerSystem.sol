// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Player, PlayerAddon,PlayerParams, GlobalConfig, LootList1, LootList2 } from "../codegen/index.sol";
import { PlayerState } from "../codegen/common.sol";

import { GLOBAL_CONFIG_KEY, PLAYER_KEY } from "../Constants.sol";
import { User, Loot } from "./library/Interface.sol";
import { console } from "forge-std/console.sol";

contract PlayerSystem is System {
  function getInfo(address addr) public view returns (string memory) {
    return (PlayerParams.getName(addr));
  }

  function setInfo(string memory name) public {
    address addr = _msgSender();
    PlayerParams.setName(addr, name);
    // Player.setUrl(addr, url);
  }

  function transfer(address addr, uint16 x, uint16 y) public {
    Player.setX(addr, x);
    Player.setY(addr, y);
  }

  function getPosition(address addr) public view returns (uint16, uint16) {
    uint16 x = Player.getX(addr);
    uint16 y = Player.getY(addr);
    return (x, y);
  }

  function getSenderPosition() public view returns (uint16, uint16) {
    uint16 x = Player.getX(_msgSender());
    uint16 y = Player.getY(_msgSender());
    return (x, y);
  }

  function selectUserNft(uint256 _tokenId) public {
    address sender = _msgSender();
    // Player.selectNft(_msgSender(), tokenId);
    address userAddress = GlobalConfig.getUserContract(GLOBAL_CONFIG_KEY);
    User user = User(userAddress);
    require(user.ownerOf(_tokenId) == sender, "You are not the owner of this NFT");
    (uint256 hp, uint256 attack, uint256 attackRange, uint256 speed, uint256 strength, uint256 space) = user
      .getStructInfo(_tokenId);
    PlayerParams.setMaxHp(sender, hp);
    PlayerParams.setHp(sender, hp);
    PlayerParams.setAttack(sender, attack);
    PlayerParams.setAttackRange(sender, attackRange);
    PlayerParams.setSpeed(sender, speed);
    PlayerParams.setStrength(sender, strength);
    PlayerParams.setSpace(sender, space);

    PlayerAddon.setUserId(sender,_tokenId);
  }

  function selectLootNFT(uint256 _tokenId) public {
    address lootAddress = GlobalConfig.getLootContract(GLOBAL_CONFIG_KEY);
    Loot loot = Loot(lootAddress);
    address _sender = _msgSender();
    require(loot.ownerOf(_tokenId) == _msgSender(), "You are not the owner of this NFT");
    (
      string memory Weapon,
      string memory Chest,
      string memory Head,
      string memory Waist,
      string memory Foot,
      string memory Hand,
      string memory Neck,
      string memory Ring
    ) = loot.getStructInfo(_tokenId);
    LootList1.setWeapon(_sender, Weapon);
    LootList1.setChest(_sender, Chest);
    LootList1.setHead(_sender, Head);
    LootList1.setWaist(_sender, Waist);
    LootList1.setFoot(_sender, Foot);
    LootList2.setHand(_sender, Hand);
    LootList2.setNeck(_sender, Neck);
    LootList2.setRing(_sender, Ring);
    PlayerAddon.setLootId(_sender,_tokenId);
  }

  function selectBothNFT(uint256 _userTokenId, uint256 _lootTokenId) external {
    selectUserNft(_userTokenId);
    selectLootNFT(_lootTokenId);
  }

  function getUserInfo(uint256 tokenId) public view returns (uint256, uint256, uint256, uint256, uint256, uint256) {
    address userAddress = GlobalConfig.getUserContract(GLOBAL_CONFIG_KEY);
    User user = User(userAddress);
    return user.getStructInfo(tokenId);
  }

  function initUserInfo(address _player) external {
    // !!仅用于测试
    Player.setX(_player, 0);
    Player.setY(_player, 0);
    Player.setState(_player, PlayerState.Idle);
    PlayerParams.setHp(_player, 0);
  }
}
