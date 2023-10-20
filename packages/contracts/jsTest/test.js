const { buildABI, getContract,wallet } = require('./tools.js');

async function main() {
    await buildABI();
    let contract = await getContract();
    console.log(contract.functions)
    await contract.joinBattlefield();
    const r = await contract.getPosition(wallet.address);
    console.log("测试合约交互,ping():",r);
}


main();
