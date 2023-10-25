import React, { useEffect, useRef, useState } from 'react';
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { decodeEntity } from "@latticexyz/store-sync/recs";
import { Has, getComponentValue } from '@latticexyz/recs';
import { useLocation } from 'react-router-dom';
import { useMUD } from '@/mud/MUDContext';
import { main } from '../../utils/createMerkelTree';
import { ethers } from 'ethers';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { getRandomStr } from '../../utils/utils';
import './index.scss';

const abi = [{"inputs":[{"internalType":"uint256","name":"_waitBlockCount","type":"uint256"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_notRevealedInfo","type":"string"},{"internalType":"string","name":"_revealedDesc","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"randomId","type":"uint256"},{"indexed":false,"internalType":"address","name":"author","type":"address"}],"name":"NewRandom","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"randomId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"randomList","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"address","name":"author","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"revealNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"userList","outputs":[{"internalType":"uint256","name":"randomId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"HP","type":"uint256"},{"internalType":"uint256","name":"Attack","type":"uint256"},{"internalType":"uint256","name":"AttackRange","type":"uint256"},{"internalType":"uint256","name":"Speed","type":"uint256"},{"internalType":"uint256","name":"Strength","type":"uint256"},{"internalType":"uint256","name":"Space","type":"uint256"},{"internalType":"enum MRandom.RandomState","name":"state","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"waitBlockCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const rpc = 'http://127.0.0.1:8545'

const Test = () => {
  const [stepData, setStepData] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [battleData, setBattleData] = useState([]);
  const [confirmBattleData, setConfirmBattleData] = useState(['Attack', 1]);
  const [battlesData, setBattlesData] = useState([]);
  const [boxData, setBoxData] = useState([]);
  const [boxId, setBoxId] = useState([]);
  const [revealNFTData, setRevealNFTData] = useState([]);

  const {
    components: { Player, GameConfig, BattleList, BoxList, GlobalConfig },
    systemCalls: { move, joinBattlefield, transfer, battleInvitation, confirmBattle, selectUserNft, revealBattle, openBox, revealBox, getCollections, CreateBox, getBattlePlayerHp },
    network
  } = useMUD();

  const { account } = network;
  console.log(network, 'account')

  // PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 转账
  // let PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  // let provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545')
  // let wallet = new ethers.Wallet(PRIVATE_KEY, provider)
  // console.log(wallet, 'wallet')
  // // 转账到0x6B5A3EF0cEdDE6f8266eCcb7971a6dbdE9D93D44
  // wallet.sendTransaction({
  //   to: '0x6B5A3EF0cEdDE6f8266eCcb7971a6dbdE9D93D44',
  //   value: ethers.utils.parseEther('1')
  // }).then(res => {
  //   console.log(res, 'res')
  // })

  const GameData = useEntityQuery([Has(GameConfig)]).map((entity) => getComponentValue(GameConfig, entity));
  console.log(GameData, 'GameData')

  const GlobalConfigData = useEntityQuery([Has(GlobalConfig)]).map((entity) => getComponentValue(GlobalConfig, entity));
  console.log(GlobalConfigData, 'GlobalConfigData')

  const battles = useEntityQuery([Has(BattleList)]).map((entity) => {
    let id = decodeEntity({ battleId: "uint256" }, entity);
    let battle = getComponentValue(BattleList, entity)
    console.log(battle, 'battle', id, entity)
    battle.id = id.battleId.toString()
    return battle;
  });
  console.log(battles, 'battles')
  battles.forEach(async item => {
    if (item.attackerState == 2 && item.defenderState == 2) {
      let hp = await getBattlePlayerHp(item.id, account)
      console.log(hp, 'hp')
    }
  })

  const boxs = useEntityQuery([Has(BoxList)]).map((entity) => {
    let id = decodeEntity({ boxId: "uint256" }, entity);
    let box = getComponentValue(BoxList, entity)
    box.id = id.boxId.toString()
    return box;
  });
  console.log(boxs, 'boxs')

  // const GameConfig = useComponentValue(GameConfig, singletonEntity);
  // console.log(GameConfig, 'GameConfig')
  const players = useEntityQuery([Has(Player)]).map((entity) => {
    console.log('entity', entity)
    let addr = account
    let entityData = decodeEntity({ addr: "address" }, entity);
    let address = entityData?.addr?.toLocaleLowerCase() || ''
    let player = getComponentValue(Player, entity);
    if (address.toLocaleLowerCase() == addr.toLocaleLowerCase()) {
      console.log('当前用户')
      console.log(player, 'player')
      player.isMe = true
    } else {
      player.isMe = false
    }
    player.addr = address
    return player;
  });
  console.log('players', players)
  // console.log(playerData, 'playerData')
  console.log(account, 'account')

  const mintFun = () => {
    let privateKey = network.privateKey
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(privateKey, provider)
    console.log(wallet)
    let userContractAddress = contractAddress
    let userContract = new ethers.Contract(userContractAddress, abi, wallet)
    console.log(userContract)
    userContract.mint().then(async res => {
      console.log(res, 'res')
      await res.wait()
      userContract.tokenId().then(res => {
        console.log(res, 'tokenId')
      })
    })
  }
  
  const revealNFTFun = () => {
    let privateKey = network.privateKey
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(privateKey, provider)
    console.log(wallet)
    let userContractAddress = contractAddress
    let userContract = new ethers.Contract(userContractAddress, abi, wallet)
    userContract.revealNFT(revealNFTData).then(async res => {
      console.log(res)
      await res.wait()
    })
  }

  const stepChange = (e, i) => {
    console.log(e)
    let value = e.target.value
    let step = [...stepData];
    step[i] = +value;
    setStepData(step);
  }

  const boxIdChange = (e) => {
    console.log(e)
    let value = e.target.value
    setBoxId(value);
  }

  const tokenIdChange = (e) => {
    console.log(e)
    let value = e.target.value
    setRevealNFTData(value);
  }

  const boxChange = (e, i) => {
    console.log(e)
    let value = e.target.value
    let box = [...boxData];
    box[i] = +value;
    setBoxData(box);
  }

  const transferChange = (e, i) => {
    console.log(e)
    let value = e.target.value
    let transfer = [...transferData];
    transfer[i] = +value;
    setTransferData(transfer);
  }

  const battleChange = (e, i) => {
    console.log(e.target.value)
    let value = e.target.value
    let battle = [...battleData];
    battle[i] = +value;
    setBattleData(battle);
  }

  const confirmBattleChange = (e, i) => {
    let value = i == 1 ? +e.target.value : e.target.value
    let confirmBattle = [...confirmBattleData];
    confirmBattle[i] = value;
    console.log(confirmBattle)
    setConfirmBattleData(confirmBattle);
  }

  const selectUserNftFun = () => {
    selectUserNft(revealNFTData);
  }

  const movePlayer = () => {
    console.log(stepData, 'move')
    let player = players.find(item => item.isMe);
    let from = {x: player.x, y: player.y}
    let to = {x: stepData[0], y: stepData[1]}
    let merkelData = main(from, to);
    move(merkelData);
  }

  const transferPlayer = () => {
    console.log(transferData, 'transfer')
    transfer(transferData);
  }

  const battleInvitationFun = () => {
    console.log(battleData, 'battle')
    let tragePlayer = players.find(item => item.x == battleData[0] && item.y == battleData[1]);
    if (!tragePlayer) alert('该位置没有玩家')
    else {
      let player = players.find(item => item.isMe);
      let from = {x: player.x, y: player.y}
      let to = {x: battleData[0], y: battleData[1]}
      let merkelData = main(from, to);
      battleInvitation(tragePlayer.addr, merkelData);
    }
  }

  const confirmBattleFun = () => {
    console.log(confirmBattleData, 'confirmBattle')
    let battle = battles.filter(item => item.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() || item.defender.toLocaleLowerCase() == account.toLocaleLowerCase())[0]
    let battlesDataTemp = [...battlesData];
    let battleItem = battlesDataTemp.find(item => item.id == battle.id);
    if (battle && !battleItem) {
      let action = confirmBattleData[0]
      let arg = confirmBattleData[1]
      let nonce = getRandomStr(18)
      console.log(nonce, arg)
      let actionHex = ethers.utils.formatBytes32String(action);
      let nonceHex = ethers.utils.formatBytes32String(nonce);
      let hash = getProofHash(actionHex, arg, nonceHex);
      confirmBattle(hash, battle.id);
      battlesDataTemp.push({
        id: battle.id,
        action: actionHex,
        arg: arg,
        nonce: nonceHex
      })
      setBattlesData(battlesDataTemp)
    } else {
      alert('已经确认过了')
    }
    // console.log(hash, 'hash')
  }

  const joinBattlefieldFun = () => {
    joinBattlefield();
  }

  const revealBattleFun = () => {
    let battle = battles.filter(item => item.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() || item.defender.toLocaleLowerCase() == account.toLocaleLowerCase())[0]
    let bettleItem = battlesData.filter(item => item.id == battle.id)[0]
    console.log(bettleItem, 'bettleItem')
    revealBattle(battle.id, bettleItem.action, bettleItem.arg, bettleItem.nonce);
    // 删除bettleItem
    let battlesDataTemp = [...battlesData];
    let index = battlesDataTemp.findIndex(item => item.id == battle.id);
    battlesDataTemp.splice(index, 1);
    setBattlesData(battlesDataTemp)
  }

  const CreateBoxFun = () => {
    CreateBox(boxData[0], boxData[1]);
  }

  const openBoxFun = () => {
    openBox(boxId);
  }

  const revealBoxFun = () => {
    revealBox(boxId);
  }

  const getCollectionsFun = () => {
    let box = boxs.find(item => item.id == boxId);
    getCollections(boxId, box.oreBalance, box.treasureBalance);
  }

  const getProofHash = (action, arg, nonce) => {
    return solidityKeccak256(
      ["bytes32", "uint256", "bytes32"],
      [action, arg, nonce]
    )
  }

  return (
    <div className="content">
      <div className="nav">
        <h3>测试面板</h3>
        <div className="addr">当前用户地址：{account}</div>
      </div>
      <div className="hd">
        {
          players.map((item, index) => (<div key={index}>
            <h6>用户信息 {item.isMe ? '(自己)' : ''}</h6>
            <div style={{ marginTop: '8px' }}>addr: {item.addr}</div>
            <div style={{ marginTop: '8px' }}>hp: {item.hp.toString()}</div>
            <div style={{ marginTop: '8px' }}>oreBalance: {item.oreBalance.toString()}</div>
            <div style={{ marginTop: '8px' }}>treasureBalance: {item.treasureBalance.toString()}</div>
            <div style={{ marginTop: '8px' }}>坐标：{item?.x || 0}，{item?.y || 0}</div>
          </div>))
        }

      </div>
      <div className="hd">
        {
          boxs.map((item, index) => (<div key={index}>
            <h6>宝箱信息</h6>
            <div style={{ marginTop: '8px' }}>id: {item.id}</div>
            <div style={{ marginTop: '8px' }}>opened: {item.opened.toString()}</div>
            <div style={{ marginTop: '8px' }}>owner: {item.owner}</div>
            <div style={{ marginTop: '8px' }}>oreBalance: {item.opened ? item.oreBalance : '--'}</div>
            <div style={{ marginTop: '8px' }}>treasureBalance:  {item.opened ? item.treasureBalance : '--'}</div>
            <div style={{ marginTop: '8px' }}>坐标：{item?.x || 0}，{item?.y || 0}</div>
          </div>))
        }

      </div>
      {
        battles.map((item, index) => (<div key={index} className='battle-item'>
          <h6>战场信息(id: {item.id})</h6>
          <div style={{marginTop: '12px', fontSize: '12px'}}>胜利者：{item.winner}</div>
          <div className='info-w'>
            <div className='battle-section'>
              <p>攻击者信息</p>
              <div>地址： {item?.attacker}</div>
              <div>Action： {item?.attackerAction}</div>
              <div>Arg： {item?.attackerArg.toString()}</div>
              <div>BuffHash： {item?.attackerBuffHash}</div>
              <div>HP： {item?.attackerHP.toString()}</div>
              <div>State： {item?.attackerState}</div>
            </div>
            <div className='battle-section'>
              <p>被攻击者信息</p>
              <div>地址： {item?.defender}</div>
              <div>Action： {item?.defenderAction}</div>
              <div>Arg： {item?.defenderArg.toString()}</div>
              <div>BuffHash： {item?.defenderBuffHash}</div>
              <div>HP： {item?.defenderHP.toString()}</div>
              <div>State： {item?.defenderState}</div>
            </div>
          </div>
          
        </div>))
      }
      <div className="main">
        <div className="section">
          <div className="title">mintNFT</div>
          <div className="input"></div>
          <div className="btn" onClick={mintFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">revealNFT</div>
          <div className="input">
          <input type="text" onChange={tokenIdChange} placeholder='tokenId' />
          </div>
          <div className="btn" onClick={revealNFTFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">初始化玩家</div>
          <div className="input"></div>
          <div className="btn" onClick={selectUserNftFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">加入游戏</div>
          <div className="input"></div>
          <div className="btn" onClick={joinBattlefieldFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">移动</div>
          <div className="input">
            <input type="text" onChange={(e) => stepChange(e, 0)} placeholder='x' />
            <input type="text" onChange={(e) => stepChange(e, 1)} placeholder='y' />
          </div>
          <div className="btn" onClick={movePlayer}>确认</div>
        </div>
        <div className="section">
          <div className="title">传送</div>
          <div className="input">
            <input type="text" onChange={(e) => transferChange(e, 0)} placeholder='x' />
            <input type="text" onChange={(e) => transferChange(e, 1)} placeholder='y' />
          </div>
          <div className="btn" onClick={transferPlayer}>确认</div>
        </div>
        <div className="section">
          <div className="title">攻击</div>
          <div className="input">
            <input type="text" onChange={(e) => battleChange(e, 0)} placeholder='x' />
            <input type="text" onChange={(e) => battleChange(e, 1)} placeholder='y' />
          </div>
          <div className="btn" onClick={battleInvitationFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">攻击策略</div>
          <div className="input">
            <select onChange={(e) => confirmBattleChange(e, 0)}>
              <option value="Attack">Attack</option>
              <option value="Escape">Escape</option>
              <option value="Props">Props</option>
            </select>
            <select onChange={(e) => confirmBattleChange(e, 1)}>
              <option value="1">Fire</option>
              <option value="2">Water</option>
              <option value="3">Wind</option>
            </select>
          </div>
          <div className="btn" onClick={confirmBattleFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">揭示结果</div>
          <div className="input"></div>
          <div className="btn" onClick={revealBattleFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">创建宝箱</div>
          <div className="input">
            <input type="text" onChange={(e) => boxChange(e, 0)} placeholder='x' />
            <input type="text" onChange={(e) => boxChange(e, 1)} placeholder='y' />
          </div>
          <div className="btn" onClick={CreateBoxFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">打开宝箱</div>
          <div className="input">
            <input type="text" onChange={boxIdChange} placeholder='boxId' />
          </div>
          <div className="btn" onClick={openBoxFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">揭示宝箱</div>
          <div className="input">
            <input type="text" value={boxId} disabled placeholder='boxId' />
          </div>
          <div className="btn" onClick={revealBoxFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">获取宝物</div>
          <div className="input">
            <input type="text" value={boxId} disabled placeholder='boxId' />
          </div>
          <div className="btn" onClick={getCollectionsFun}>确认</div>
        </div>
      </div>
    </div>
  )
};

export default Test;