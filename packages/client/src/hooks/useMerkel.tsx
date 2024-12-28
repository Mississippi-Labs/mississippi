import React, { useEffect, useRef } from 'react';
import { MerkleTree } from 'merkletreejs';
import { solidityKeccak256, keccak256 } from 'ethers/lib/utils';
import { Buffer } from 'buffer';


const useMerkel = (mapData) => {

  const convertToLeafs = (mapData) => {
    const result = [];
    for (let y = 0; y < mapData.length; y++) {
      for (let x = 0; x < mapData[y].length; x++) {
        result.push({ x, y, value: mapData[y][x] });
      }
    }
    return result;
  }

  const leafs = useRef([]);

  const merkel = useRef<MerkleTree | null>(null);

  const getProof = (x, y) => {
    const leaf = generateLeaf(x, y, 1);
    return merkel.current!.getHexProof(leaf);
  }

  // 通过本函数将地图初始化为默克尔树节点的字符串数组,每个字符串的格式为"x,y-value"
// 其中value为0或1,表示该位置是否可以走,默认0不可走,1以及以后数字可以约定分别代表不同的可行性
  const generateLeaf = (x, y, value) => {

    return Buffer.from(
      solidityKeccak256(
        ["uint16", "string", "uint16", "string", "uint8"],
        [x, ",", y, ",", value]
      ).slice(2),
      "hex"
    );
  }

  const formatMovePath = (paths) => {
    const steps = paths.map(({ x, y }) => [x, y]);
    const result = [];
    for (let i = 0; i < steps.length; i++) {
      const proof = getProof(steps[i][0], steps[i][1]);
      result.push([steps[i][0], steps[i][1], proof]);
    }
    return result;
  }

  useEffect(() => {
    if (mapData.length === 0) {
      return;
    }
    leafs.current = convertToLeafs(mapData);
    merkel.current = new MerkleTree(
      leafs.current.map((info) => generateLeaf(info.x, info.y, info.value)),
      keccak256,
      { sortPairs: true }
    );
  }, [mapData]);

  return formatMovePath;
}

export default useMerkel;