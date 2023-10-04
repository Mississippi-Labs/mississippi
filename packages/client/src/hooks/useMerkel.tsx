import React, { useEffect, useRef } from 'react';
import { MerkleTree } from 'merkletreejs';
import { solidityKeccak256, keccak256 } from 'ethers/lib/utils';
import { Buffer } from 'buffer';


const useMerkel = (mapData) => {

  const convertToLeafs = (mapData) => {
    const result = [];
    for (let x = 0; x < mapData.length; x++) {
      for (let y = 0; y < mapData[x].length; y++) {
        result.push({ x, y, value: mapData[x][y] });
      }
    }
    return result;
  }

  const merkel = useRef({
    leafs: convertToLeafs(mapData),
    merkleTree: null
  });

  const getProof = (x, y) => {
    const leaf = generateLeaf(x, y, 1);
    return merkel.current.merkleTree.getHexProof(leaf);
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
    merkel.current.leafs = convertToLeafs(mapData);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    merkel.current.merkleTree = new MerkleTree(
      merkel.current.leafs.map((info) => generateLeaf(info.x, info.y, info.value)),
      keccak256,
      { sortPairs: true }
    );
  }, [mapData]);

  return formatMovePath;
}

export default useMerkel;