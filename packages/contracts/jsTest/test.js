const { buildABI, getContract,deploy,run,call,wallet,getStr } = require('./tools.js');
const { root,move } = require('./merkle_tree.js');
const { ethers } = require("ethers");

async function main() {
    // await buildABI();
    let a = "0x155015ae9c496f0f6fd931019b5913c67e630cdcf50b1101aeda4bb69f21060e"
    console.log(a)
    console.log('0x0000000000000000000000000000000047616d65436f6e666967000000000000')
    
    a = ethers.utils.hexZeroPad(a, 32)
    console.log(a)
    console.log(getStr(a))
    // let contract = await getContract();
    // // console.log(contract.functions)
    // await contract.initUserInfo()
    // await run("成功设置默克尔根",contract.SetMapMerkleRoot(root))
    // await run("玩家加入战场",contract.joinBattlefield())
    // let r = call("查看当前坐标:",contract.getPosition(wallet.address))
    // let r = await contract.getPosition(wallet.address)
    // let steps = move([[r[0],r[1]+1]]);
    // await run("移动",contract.move(steps));

    // let a = ethers.utils
    //   .solidityKeccak256(
    //     ["string"],
    //     ["Player-Key"]
    //   )
    //   .slice(2)
    //   console.log(a)
    

}


main();
