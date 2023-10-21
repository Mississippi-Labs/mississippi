const { ethers } = require("ethers");
require("dotenv").config();
const { exec } = require("child_process");

const privateKey = process.env.PRIVATE_KEY;

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    
    const wallet = new ethers.Wallet(privateKey, provider);
async function buildABI() {
    console.log("正在编译合约...")
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
async function getContract(){
    
    
    console.log("测试钱包地址:", wallet.address);
    const contractInfo = require("../worlds.json");
    const contractAddress = contractInfo["31337"].address;
    const contractABI = require("../out/IWorld.sol/IWorld.abi.json");
    
    console.log("测试合约地址:",contractAddress)
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    return contract;
}


module.exports = {
    getContract,
    buildABI,
    wallet
};
