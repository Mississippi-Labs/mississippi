<<<<<<< HEAD
const { buildABI, getContract,wallet } = require('./tools.js');
=======
const { ethers } = require("ethers");
require("dotenv").config();
const { exec } = require("child_process");

async function buildABI() {
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
            console.log(`命令输出: ${stdout}`);
            resolve(stdout);
        });
    });
}
const privateKey = process.env.PRIVATE_KEY;

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

const wallet = new ethers.Wallet(privateKey, provider);

// console.log("测试钱包地址:", wallet.address);
const contractInfo = require("../worlds.json");
const contractAddress = contractInfo["31337"].address;
const contractABI = require("../out/IWorld.sol/IWorld.abi.json");
<<<<<<< HEAD
console.log("contract address :",contractAddress)
=======

console.log("测试合约地址:",contractAddress)
>>>>>>> 69db2f9f2cc9a0b7a1a8ec213b3dd6e89a6e58ad
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

>>>>>>> 9bee347a72c44e75ef1c155245215d8f2a8d7859

async function main() {
<<<<<<< HEAD
    // const r = await contract.ping();
    console.log("wallet address: ", wallet.address)
    const r = await contract.joinBattlefield(wallet.address);
    console.log(" return val: ", r);

    


    // const r2 = await contract.getBattlefieldInfo();
    // console.log("测试合约交互,ping():",r);
    // const r = await contract
=======
    await buildABI();
    let contract = await getContract();
    console.log(contract.functions)
    await contract.joinBattlefield();
    const r = await contract.getPosition(wallet.address);
    console.log("测试合约交互,ping():",r);
>>>>>>> 69db2f9f2cc9a0b7a1a8ec213b3dd6e89a6e58ad
}


main();
