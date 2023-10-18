import { MerkleTree } from "merkletreejs";
import { solidityKeccak256, keccak256 } from 'ethers/lib/utils';
import { Buffer } from "buffer";
import { bfs } from './map'

let map_info = [];
let line = Array.from({ length: 100 }, () => 1);
for (let i = 0; i < 10; i++) {
  map_info.push(line);
}
//在这里替换map_info,格式为[[0,0,0],[1,1,1]]这样的二维数组,需要和前端完全一致


function convertToLeafs(map_info) {
  let result = [];
  for (let x = 0; x < map_info.length; x++) {
    for (let y = 0; y < map_info[x].length; y++) {
      result.push({ x, y, value: map_info[x][y] });
    }
  }
  return result;
}

function move(steps) {
  console.log(steps, 11)
  let steps_list = [];
  for (let i = 0; i < steps.length; i++) {
    let proof = get_proof(steps[i][0], steps[i][1]);
    steps_list.push([steps[i][0], steps[i][1], proof]);
  }
  console.log("steps_list", steps_list);
  return steps_list;
}
let leafs = convertToLeafs(map_info);
console.log("leafs.length", leafs.length);

// 通过本函数将地图初始化为默克尔树节点的字符串数组,每个字符串的格式为"x,y-value"
// 其中value为0或1,表示该位置是否可以走,默认0不可走,1以及以后数字可以约定分别代表不同的可行性
function generateLeaf(x, y, value) {
  return Buffer.from(
    solidityKeccak256(
        ["uint16", "string", "uint16", "string", "uint8"],
        [x, ",", y, ",", value]
      )
      .slice(2),
    "hex"
  );
}

function get_proof(x, y) {
  let leaf = generateLeaf(x, y, 1);
  const proof = merkleTree.getHexProof(leaf);
  return proof;
}
const merkleTree = new MerkleTree(
  leafs.map((info) => generateLeaf(info.x, info.y, info.value)),
  keccak256,
  { sortPairs: true }
);
export const main = (from, to) => {
  let root = merkleTree.getHexRoot();
  console.log("Map Merkle Tree Root:", root);
  // 这里可以直接手写走的节点,注意不能包含开始点,且每一步走的地方都必须是可以移动端
  let steps = bfs(map_info, from, to);
  // 删除第一个
  steps.shift();
  let steps_arr = steps.map((item) => {
    return [item.x, item.y];
  })
  console.log("总移动步数", steps_arr.length);
  let steps_list = move(steps_arr);
  console.log("生成的传入文件", steps_list);
  return steps_list
}


