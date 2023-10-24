const { ethers } = require("ethers");
require("dotenv").config();
const { exec } = require("child_process");
const abiDecoder = require('abi-decoder');

const privateKey = process.env.PRIVATE_KEY;

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

const wallet = new ethers.Wallet(privateKey, provider);
console.log("测试钱包地址:", wallet.address);
  const contractInfo = require("../worlds.json");
  const contractAddress = contractInfo["31337"].address;
  const contractABI = require("../out/IWorld.sol/IWorld.abi.json");

  console.log("测试合约地址:", contractAddress);
async function buildABI() {
  console.log("正在编译合约...");
  return new Promise((resolve, reject) => {
    exec("pnpm run build:abi", (error, stdout, stderr) => {
      if (error) {
        console.error(`执行命令时出错: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`命令输出错误: ${stderr}`);
        reject(stderr);
      }
      // console.log(`命令输出: ${stdout}`);
      resolve(stdout);
    });
  });
}
async function deploy() {
  console.log("正在编译合约...");
  return new Promise((resolve, reject) => {
    exec("pnpm run deploy:local", (error, stdout, stderr) => {
      if (error) {
        console.error(`执行命令时出错: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`命令输出错误: ${stderr}`);
        reject(stderr);
      }
      // console.log(`命令输出: ${stdout}`);
      resolve(stdout);
    });
  });
}
async function getContract() {
  
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);
  return contract;
}

function getStr(bytes32Value) {
  let stringValue = ethers.utils.parseBytes32String(bytes32Value);
  return stringValue;
}

function getMudEvent(args){
    console.log(args)
    let name = getStr(args[0]);
    console.log(name)
    abiDecoder.addABI(contractABI);
    const decodedData = abiDecoder.decodeMethod(args.data);
    let a = args[1].forEach((e) => {
        console.log(e)
        return getStr(e);
    })
    console.log(a)
console.log(decodedData); 
    // let i = bytesToString(args[3]);
    
    // console.log(a)
    console.log(args[2])
    console.log(i)
    
}
async function run(name, func) {
  let a = await func;
  let b = await a.wait();
  console.log(name);
  b.events.forEach((e) => {
  
    if ( e.event =="StoreSetField") {
    console.log("\x1b[32m%s\x1b[0m", e.eventSignature);
    // console.log(e.args, e.args.length);
    getMudEvent(e.args)
    }
  });

}

async function call(name,func) {
  let a = await func;
  console.log(name,":",a);
  return a;
}

module.exports = {
  getContract,
  buildABI,
  deploy,
  run,
  call,
  wallet,
};
