// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract MRandom {
     
    struct Random {
        uint256 blockNumber;
        address author;
    }
    uint256 public randomId;
    mapping(uint256 => Random) public randomList;


    event NewRandom(uint256 randomId, address author);

    function requestRandom(uint256 _randomId) internal {
        Random storage r = randomList[_randomId];
        r.author = msg.sender;
        r.blockNumber = block.number;
        emit NewRandom(randomId, msg.sender);
    }

    function getRandom(
        uint256 _randomId,
        uint256 _count,
        uint256 _waitBlockCount
    ) internal view returns (uint8[] memory) {
        require(_randomId < randomId, "random does not exists");
        Random memory r = randomList[_randomId];

        require(msg.sender == r.author, "only random creator can get random");
        uint8[] memory randomNumberList = new uint8[](_count);
        require(
            block.number >= r.blockNumber + _waitBlockCount,
            "too early to get random seed"
        );
        uint256 seed = uint256(blockhash(r.blockNumber + 2));
        // 一次处理一个uint256随机数
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(seed)));

        // 截断后存入属性数组
        for (uint8 i = 0; i < _count; i++) {
            uint8 digit = uint8(randomNumber % 100);
            randomNumberList[i] = digit;
            randomNumber = randomNumber / 100;
        }
        return randomNumberList;
    }

    function choice(
        uint8 rand,
        string[] memory sourceArray
    ) internal pure returns (string memory) {
        string memory output = sourceArray[rand % sourceArray.length];
        
        return output;
    }
}