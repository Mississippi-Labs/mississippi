// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "./LootSuit.sol";
import "./Base64.sol";
import './MRandom.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MLoot is Suit, ERC721,MRandom {
    using Strings for uint256;

    constructor(
        string memory _desc,
        string memory symbol,
        string memory name,
        string memory _notRevealedInfo,
        uint256 _waitBlockCount
    ) ERC721(symbol, name) {
        desc = _desc;
        owner = msg.sender;
        waitBlockCount = _waitBlockCount;
        notRevealedInfo = _notRevealedInfo;
    }

   

   

    struct Loot {
        uint256 randomId;
        address owner;
        string Weapon;
        string Chest;
        string Head;
        string Waist;
        string Foot;
        string Hand;
        string Neck;
        string Ring;
        RandomState state;
    }

    uint256 public tokenId;
    uint256 public waitBlockCount;


    address owner;
    string desc;
    string notRevealedInfo;

    mapping(uint256 => Loot) public lootList;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }


    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        string[17] memory parts;
        Loot memory loot = lootList[_tokenId];
        if(loot.state == RandomState.Pending){
            string memory r = string(
            abi.encodePacked(
                "data:application/json;base64,",
                notRevealedInfo
            )
        );
            return r;
        }
        require(loot.state != RandomState.Inited, "Box not existed");

        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        parts[1] = loot.Weapon;

        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = loot.Chest;

        parts[4] = '</text><text x="10" y="60" class="base">';

        parts[5] = loot.Head;

        parts[6] = '</text><text x="10" y="80" class="base">';

        parts[7] = loot.Waist;

        parts[8] = '</text><text x="10" y="100" class="base">';

        parts[9] = loot.Foot;

        parts[10] = '</text><text x="10" y="120" class="base">';

        parts[11] = loot.Hand;

        parts[12] = '</text><text x="10" y="140" class="base">';

        parts[13] = loot.Neck;

        parts[14] = '</text><text x="10" y="160" class="base">';

        parts[15] = loot.Ring;

        parts[16] = "</text></svg>";

        string memory output = string(
            abi.encodePacked(
                parts[0],
                parts[1],
                parts[2],
                parts[3],
                parts[4],
                parts[5],
                parts[6],
                parts[7],
                parts[8]
            )
        );
        output = string(
            abi.encodePacked(
                output,
                parts[9],
                parts[10],
                parts[11],
                parts[12],
                parts[13],
                parts[14],
                parts[15],
                parts[16]
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "MLoot #',
                        _tokenId.toString(),
                        '", "description":"',
                        desc,
                        '","image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        '"}'
                    )
                )
            )
        );
        output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function luck(
        uint8 rand,
        string[] memory sourceArray
    ) internal view returns (string memory) {
        string memory output = sourceArray[rand % sourceArray.length];

        uint256 greatness = rand % 21;
        if (greatness > 14) {
            output = string(
                abi.encodePacked(output, " ", suffixes[rand % suffixes.length])
            );
        }
        if (greatness >= 19) {
            string[2] memory name;
            name[0] = namePrefixes[rand % namePrefixes.length];
            name[1] = nameSuffixes[rand % nameSuffixes.length];
            if (greatness == 19) {
                output = string(
                    abi.encodePacked('"', name[0], " ", name[1], '" ', output)
                );
            } else {
                output = string(
                    abi.encodePacked(
                        '"',
                        name[0],
                        " ",
                        name[1],
                        '" ',
                        output,
                        " +1"
                    )
                );
            }
        }
        return output;
    }

    function revealNFT(uint256 _tokenId) external {
        Loot storage loot = lootList[_tokenId];
        require(loot.owner == msg.sender, "only owner can reveal the  box");
        uint8[] memory random_numbers = getRandom(loot.randomId, 8,waitBlockCount);
        loot.Weapon = luck(random_numbers[0], weapons);
        loot.Chest = luck(random_numbers[1], chestArmor);
        loot.Head = luck(random_numbers[2], headArmor);
        loot.Waist = luck(random_numbers[3], waistArmor);
        loot.Foot = luck(random_numbers[4], footArmor);
        loot.Hand = luck(random_numbers[5], handArmor);
        loot.Neck = luck(random_numbers[6], necklaces);
        loot.Ring = luck(random_numbers[7], rings);
        loot.state = RandomState.Confirmed;
    }

    function mint() external {
        // init loot box
        Loot storage loot = lootList[tokenId];
        loot.owner = msg.sender;
        loot.state = RandomState.Pending;
        loot.randomId = randomId;
        requestRandom(randomId);
        _mint(msg.sender, tokenId);
        tokenId++;
        randomId++;
    }

   


    function withdraw(address to) public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "sufficient funds");
        payable(to).transfer(balance);
    }

    function withdrawErc20(
        address _targetAddress,
        address _contractAddress,
        uint256 _amount
    ) external onlyOwner {
        IERC20(_contractAddress).transfer(_targetAddress, _amount);
    }
    function getStructInfo(uint256 _tokenId) external view returns(string memory,string memory,string memory,string memory,string memory,string memory,string memory,string memory){
        Loot memory loot = lootList[_tokenId];
        require(loot.state == RandomState.Confirmed,"User not exists");
        return(
            loot.Weapon,
            loot.Chest,
            loot.Head,
            loot.Waist,
            loot.Foot,
            loot.Hand,
            loot.Neck,
            loot.Ring
        );
    }
    function getStructIndexInfo(uint256 _tokenId) external view returns(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256){
        Loot memory loot = lootList[_tokenId];
        require(loot.state == RandomState.Confirmed,"User not exists");
        return(
            indexOf(weapons,loot.Weapon),
            indexOf(chestArmor,loot.Chest),
            indexOf(headArmor,loot.Head),
            indexOf(waistArmor,loot.Waist),
            indexOf(footArmor,loot.Foot),
            indexOf(handArmor,loot.Hand),
            indexOf(necklaces,loot.Neck),
            indexOf(rings,loot.Ring)
        );
    }

    function getUserTokenIdList() view external returns(uint256[] memory){
        uint256 balance = balanceOf(msg.sender);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 index;
        for(uint256 i;i<tokenId;i++){
            if(ownerOf(i) == msg.sender){
                tokenIds[index] = i;
                index++;
                if(index == balance){
                    break;
                }
            }
        }
        return tokenIds;
    }

    function indexOf(string[] memory _list,string memory _name) internal pure returns(uint256){
        uint256 r;
        require(_list.length > 0,"list is empty");
        for(uint256 i;i<_list.length;i++){
            if(keccak256(abi.encodePacked(_list[i])) == keccak256(abi.encodePacked(_name))){
                r = i;
                break;
            }
        }
        return r;
    }
}
