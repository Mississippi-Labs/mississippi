const { ethers } = require("ethers");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

const wallet = new ethers.Wallet(privateKey, provider);

console.log("测试钱包地址:", wallet.address);
const contractInfo = require("../worlds.json");
const contractAddress = contractInfo["31337"].address;
const contractABI = require("../out/IWorld.sol/IWorld.abi.json");
console.log("测试合约地址:",contractAddress)
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function main() {
    const r = await contract.ping();
    console.log("测试合约交互,ping():",r);
}


main();
