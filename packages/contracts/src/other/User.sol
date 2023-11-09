// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./MRandom.sol";
import "./Base64.sol";

contract MUser is ERC721, MRandom {
    using Strings for uint256;

    struct User {
        uint256 randomId;
        address owner;
        uint256 HP;
        uint256 Attack;
        uint256 AttackRange;
        uint256 Speed;
        uint256 Strength;
        uint256 Space;
        RandomState state;
    }

    uint256 public tokenId;
    uint256 public waitBlockCount;
    address public owner;
    string notRevealedInfo;
    string revealedDesc;

    constructor(
        uint256 _waitBlockCount,
        string memory _symbol,
        string memory _name,
        string memory _notRevealedInfo,
        string memory _revealedDesc
    ) ERC721(_symbol, _name) {
        owner = msg.sender;
        waitBlockCount = _waitBlockCount;
        notRevealedInfo = _notRevealedInfo;
        revealedDesc = _revealedDesc;
    }

    mapping(uint256 => User) public userList;

    function mint(address _addr) external {
        // init loot box
        User storage user = userList[tokenId];
        user.owner = _addr;
        user.state = RandomState.Pending;
        user.randomId = randomId;
        requestRandom(randomId);
        _mint(_addr, tokenId);
        tokenId++;
        randomId++;
    }

    function revealNFT(uint256 _tokenId) external {
        User storage user = userList[_tokenId];
        uint8[] memory random_numbers = getRandom(
            user.randomId,
            8,
            waitBlockCount
        );

        user.HP = getRange(random_numbers[0], 100, 10, 5);
        user.Attack = getRange(random_numbers[1], 30, 10, 2);
        user.AttackRange = getRange(random_numbers[2], 3, 50, 1); //攻击范围3-5 
        user.Speed = getRange(random_numbers[3], 4, 30, 1); //速度4-6
        user.Strength = getRange(random_numbers[4], 20, 10, 3);
        user.Space = getRange(random_numbers[5], 2, 50, 1);
        user.state = RandomState.Confirmed;

    }

    function getRange(
        uint8 _rand,
        uint256 _start,
        uint256 _step,
        uint256 _stepLength
    ) internal pure returns (uint256) {
        uint256 times = uint256((_rand + 1) / _step);
        return _start + times * _stepLength;
    }

    function concat(
        string memory _key,
        string memory _value
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(_key, " : ", _value));
    }

    function createSVG(User memory user) internal pure returns (string memory) {
        string[13] memory parts;

        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        parts[1] = concat("HP", user.HP.toString());

        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = concat("Attack", user.Attack.toString());

        parts[4] = '</text><text x="10" y="60" class="base">';

        parts[5] = concat("AttackRange", user.AttackRange.toString());

        parts[6] = '</text><text x="10" y="80" class="base">';

        parts[7] = concat("Speed",user.Speed.toString());

        parts[8] = '</text><text x="10" y="100" class="base">';

        parts[9] = concat("Strength", user.Strength.toString());

        parts[10] = '</text><text x="10" y="120" class="base">';

        parts[11] = concat("Space", user.Space.toString());

        parts[12] = "</text></svg>";

        string memory output ;
        for(uint256 i;i<parts.length;i++){
            output = string(
            abi.encodePacked(output, parts[i])
            );
        }
        return output;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        User memory user = userList[_tokenId];
        if (user.state == RandomState.Pending) {
            string memory r = string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    notRevealedInfo
                )
            );
            return r;
        } else {
            require(user.state != RandomState.Inited, "Box not existed");
            string memory output = createSVG(user);
            string memory json = Base64.encode(
                bytes(
                    string(
                        abi.encodePacked(
                            '{"name": "MUser #',
                            _tokenId.toString(),
                            '", "description":"',
                            revealedDesc,
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
    }
    
    function getStructInfo(uint256 _tokenId) external view returns(uint256,uint256,uint256,uint256,uint256,uint256){
        User memory user = userList[_tokenId];
        require(user.state == RandomState.Confirmed,"User not exists");
        return(user.HP,
        user.Attack,
        user.AttackRange,
        user.Speed,
        user.Strength,
        user.Space);
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

    
}
