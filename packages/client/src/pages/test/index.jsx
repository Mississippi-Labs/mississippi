import React, { useEffect, useMemo, useState, useRef } from 'react';
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
import { bfs, simplifyMapData } from '@/utils/map';
import useMerkel from '@/hooks/useMerkel';
import { loadMapData } from "@/utils";
import { Switch } from 'antd';
import { message } from 'antd';
import MAP_CFG from '@/config/map';

import lootAbi from '../../../../contracts/out/Loot.sol/MLoot.abi.json'
import userAbi from '../../../../contracts/out/User.sol/MUser.abi.json'

let userContract
let lootContract
let transfering = false

let interval = null

const Test = () => {
  const [stepData, setStepData] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [battleData, setBattleData] = useState([]);
  const [confirmBattleData, setConfirmBattleData] = useState(['attack', 1]);
  const [battlesData, setBattlesData] = useState([]);
  const [boxData, setBoxData] = useState([]);
  const [boxId, setBoxId] = useState([]);
  const [revealNFTData, setRevealNFTData] = useState('');
  const [nftListData, setNftListData] = useState([]);
  const [walletBalance, setWalletBalance] = useState('');
  const [renderMapData, setRenderMapData] = useState([]);
  const [createAmount, setCreateAmount] = useState(5);

  const [defaultChecked, setDefaultChecked] = useState(false);

  const boxRef = useRef([]);

  const {
    components: { Player, GameConfig, BattleList, BoxList, GlobalConfig, SyncProgress },
    systemCalls: { move, joinBattlefield, transfer, battleInvitation, confirmBattle, selectUserNft, revealBattle, openBox, revealBox, getCollections, CreateBox, getBattlePlayerHp, setGmaeOpen },
    network
  } = useMUD();

  const { account } = network;

  const simpleMapData = useMemo(() => {
    return simplifyMapData(renderMapData);
  }, [renderMapData]);

  const formatMovePath = useMerkel(simpleMapData);

  useEffect(() => {
    loadMapData().then((csv) => {
      setRenderMapData(csv);
    });
  }, []);


  // 转账函数
  const transferFun = async (to) => {
    if (transfering) return
    transfering = true
    let PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    let rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    wallet.sendTransaction({
      to,
      value: ethers.utils.parseEther('1')
    }).then(res => {
      transfering = false
      getBalance()
    }).catch(err => {
      console.log(err)
    })
  }

  const getBalance = () => {
    network.publicClient.getBalance({
      address: network.walletClient.account.address
    }).then(balance => {
      if (balance.toString() == 0) {
        // transferFun(network.walletClient.account.address)
        setWalletBalance(0);
      } else {
        let walletBalance = (+ethers.utils.formatEther(balance.toString())).toFixed(2)
        setWalletBalance(walletBalance);
      }
    })
  }

  getBalance()

  const GameData = useEntityQuery([Has(GameConfig)]).map((entity) => getComponentValue(GameConfig, entity));

  const GlobalConfigData = useEntityQuery([Has(GlobalConfig)]).map((entity) => getComponentValue(GlobalConfig, entity));

  if (GlobalConfigData.length && GlobalConfigData[0].userContract && !userContract) {
    let privateKey = network.privateKey
    let rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(privateKey, provider)
    let userContractAddress = GlobalConfigData[0].userContract
    userContract = new ethers.Contract(userContractAddress, userAbi, wallet)
  }

  if (GlobalConfigData.length && GlobalConfigData[0].lootContract && !lootContract) {
    let privateKey = network.privateKey
    let rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(privateKey, provider)
    let lootContractAddress = GlobalConfigData[0].lootContract
    lootContract = new ethers.Contract(lootContractAddress, lootAbi, wallet)
  }

  const battles = useEntityQuery([Has(BattleList)]).map((entity) => {
    let id = decodeEntity({ battleId: "uint256" }, entity);
    let battle = getComponentValue(BattleList, entity)
    battle.id = id.battleId.toString()
    return battle;
  }).filter(e => !e.isEnd)

  const boxs = useEntityQuery([Has(BoxList)]).map((entity) => {
    let id = decodeEntity({ boxId: "uint256" }, entity);
    let box = getComponentValue(BoxList, entity)
    box.id = id.boxId.toString()
    return box;
  }).filter(e => !e.opened);

  boxRef.current = boxs;

  const syncprogressData = useEntityQuery([Has(SyncProgress)]).map((entity) => getComponentValue(SyncProgress, entity));
  const syncprogress = syncprogressData[0]
  console.log(syncprogress, 'syncprogress')

  useEffect(() => {
    if (!interval && syncprogress?.percentage == 100) {
      interval = setInterval(() => {
        console.log(boxRef.current.length, 'boxs.length')
        if (boxRef.current.length < 20) {
          CreateBoxMoreFun()
        }
      }, 600000)
    }
  }, [syncprogress?.percentage]);

  
  // const GameConfig = useComponentValue(GameConfig, singletonEntity);
  // console.log(GameConfig, 'GameConfig')
  const players = useEntityQuery([Has(Player)]).map((entity) => {
    let addr = account
    let entityData = decodeEntity({ addr: "address" }, entity);
    let address = entityData?.addr?.toLocaleLowerCase() || ''
    let player = getComponentValue(Player, entity);
    if (address.toLocaleLowerCase() == addr.toLocaleLowerCase()) {
      player.isMe = true
    } else {
      player.isMe = false
    }
    player.addr = address
    return player;
  })


  const getNftList = async () => {
    let nftList = await userContract.getUserTokenIdList()
    nftList = nftList.map(e => e.toString())
    setNftListData(nftList)
  }

  const mintFun = () => {
    userContract.mint().then(async res => {
      await res.wait()
      getNftList()
      // userContract.tokenId().then(res => {
      //   console.log(res, 'tokenId')
      // })
    })
  }
  
  const revealNFTFun = () => {
    userContract.revealNFT(revealNFTData).then(async res => {
      await res.wait()
    })
  }

  const stepChange = (e, i) => {
    let value = e.target.value
    let step = [...stepData];
    step[i] = +value;
    setStepData(step);
  }

  const boxIdChange = (e) => {
    let value = e.target.value
    setBoxId(value);
  }

  const tokenIdChange = (e) => {
    let value = +e.target.value
    setRevealNFTData(value);
  }

  const boxChange = (e, i) => {
    let value = e.target.value
    let box = [...boxData];
    box[i] = +value;
    setBoxData(box);
  }

  const transferChange = (e, i) => {
    let value = e.target.value
    let transfer = [...transferData];
    transfer[i] = +value;
    setTransferData(transfer);
  }

  const battleChange = (e, i) => {
    let value = e.target.value
    let battle = [...battleData];
    battle[i] = +value;
    setBattleData(battle);
  }

  const confirmBattleChange = (e, i) => {
    let value = i == 1 ? +e.target.value : e.target.value
    let confirmBattle = [...confirmBattleData];
    confirmBattle[i] = value;
    setConfirmBattleData(confirmBattle);
  }

  const selectUserNftFun = () => {
    selectUserNft(revealNFTData);
  }

  const movePlayer = () => {
    let player = players.find(item => item.isMe);
    let from = {x: player.x, y: player.y}
    let to = {x: stepData[0], y: stepData[1]}
    const paths = bfs(simpleMapData, from, to).slice(1);
    move(formatMovePath(paths));
  }

  const transferPlayer = () => {
    transfer(account, transferData);
  }

  const battleInvitationFun = () => {
    let tragePlayer = players.find(item => item.x == battleData[0] && item.y == battleData[1]);
    if (!tragePlayer) alert('该位置没有玩家')
    else {
      let player = players.find(item => item.isMe);
      let from = {x: player.x, y: player.y}
      let to = {x: battleData[0], y: battleData[1]}
      const paths = bfs(simpleMapData, from, to).slice(1);
      let merkelData = formatMovePath(paths)
      battleInvitation(tragePlayer.addr, merkelData);
    }
  }

  const confirmBattleFun = () => {
    let battle = battles.filter(item => item.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() || item.defender.toLocaleLowerCase() == account.toLocaleLowerCase())[0]
    let battlesDataTemp = [...battlesData];
    let battleItem = battlesDataTemp.find(item => item.id == battle.id);
    if (battle && !battleItem) {
      let action = confirmBattleData[0]
      let arg = confirmBattleData[1]
      let nonce = getRandomStr(18)
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
    revealBattle(battle.id, bettleItem.action, bettleItem.arg, bettleItem.nonce);
    // 删除bettleItem
    let battlesDataTemp = [...battlesData];
    let index = battlesDataTemp.findIndex(item => item.id == battle.id);
    battlesDataTemp.splice(index, 1);
    setBattlesData(battlesDataTemp)
  }

  const airdrop = (amount, map) => {
    // 获取地图尺寸和有效位置
    const rows = map.length;
    const cols = rows > 0 ? map[0].length : 0;
    const validPositions = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (map[r][c] === 100) validPositions.push([r, c]);
      }
    }
  
    // 调整空投数量
    amount = Math.min(amount, validPositions.length);
  
    // 随机选择空投位置，确保坐标不连续
    const airdropPositions = [];
    while (airdropPositions.length < amount) {
      const index = Math.floor(Math.random() * validPositions.length);
      const position = validPositions[index];
  
      // 检查新位置是否与已选位置足够远
      let isFarEnough = true;
      for (const existingPosition of airdropPositions) {
        if (Math.abs(position[0] - existingPosition[0]) <= 1 && Math.abs(position[1] - existingPosition[1]) <= 1) {
          isFarEnough = false;
          break;
        }
      }
  
      if (isFarEnough) {
        airdropPositions.push({x: position[1], y: position[0]});
        validPositions.splice(index, 1); // 移除已选位置，防止重复选择
      }
    }
  
    return airdropPositions;
  }

  const ApplyCreateBoxMoreFun = async (boxi, boxData1) => {
    let box = boxData1[boxi]
    if (!box) return
    // 判断当前位置是否有宝箱
    let boxsTemp = [...boxs]
    let boxItem = boxsTemp.find(item => item.x == box.x && item.y == box.y)
    if (!boxItem) {
      await CreateBox(box.x, box.y);
      message.success(`创建宝箱成功，坐标：${box.x}，${box.y}`);
    }
    if (boxi < boxData1.length) {
      setTimeout(() => {
        ApplyCreateBoxMoreFun(boxi + 1, boxData1)
      }, 100)
    }
  }

  const CreateBoxMoreFun = async () => {
    let boxData1 = airdrop(createAmount, MAP_CFG)
    console.log(boxData1)
    ApplyCreateBoxMoreFun(0, boxData1)
  }

  const CreateBoxFun = async () => {
    message.loading('创建中...');
    await CreateBox(boxData[0], boxData[1]);
    message.success(`创建宝箱成功，坐标：${boxData[0]}，${boxData[1]}`);

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

  const onSwitchChange = (checked) => {
    setDefaultChecked(checked)
  }

  const setGmaeOpenFun = async () => {
    message.loading('设置中...');
    await setGmaeOpen(defaultChecked)
    message.success('设置成功');
  }

  return (
    <div className="content">
      <div className="nav">
        <h3>测试面板</h3>
        <div className="addr">当前用户地址：{account} | {walletBalance} ETH</div>
      </div>
      <div className="hd">
        {
          players.map((item, index) => (<div key={index}>
            <h6>用户信息 {item.isMe ? '(自己)' : ''}</h6>
            <div style={{ marginTop: '8px' }}>addr: {item.addr}</div>
            <div style={{ marginTop: '8px' }}>hp: {item.hp.toString()}</div>
            <div style={{ marginTop: '8px' }}>attack: {item.attack.toString()}</div>
            <div style={{ marginTop: '8px' }}>oreBalance: {item.oreBalance.toString()}</div>
            <div style={{ marginTop: '8px' }}>treasureBalance: {item.treasureBalance.toString()}</div>
            <div style={{ marginTop: '8px' }}>state：{item?.state}</div>
            <div style={{ marginTop: '8px' }}>坐标：{item?.x || 0}，{item?.y || 0}</div>
          </div>))
        }

      </div>
      <div className="hd">
        {
          boxs.map((item, index) => (<div key={index} style={{marginBottom: '20px'}}>
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
          <div className="title">setGmaeOpen</div>
          <div className="input">
            <Switch checked={defaultChecked} onChange={onSwitchChange} />
          </div>
          <div className="btn" onClick={setGmaeOpenFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">mintNFT</div>
          <div className="input"></div>
          <div className="btn" onClick={mintFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">revealNFT</div>
          
          <div className="input">
          <select value={revealNFTData} onChange={tokenIdChange}>
            {
              nftListData.map((item, index) => (<option key={index} value={item}>{item}</option>))
            }
          </select>
          </div>
          <div className="btn" onClick={revealNFTFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">初始化玩家</div>
          <div className="input">
            <select value={revealNFTData} onChange={tokenIdChange}>
              {
                nftListData.map((item, index) => (<option key={index} value={item}>{item}</option>))
              }
            </select>
          </div>
          <div className="btn" onClick={selectUserNftFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">加入游戏</div>
          <div className="input"></div>
          <div className="btn" onClick={joinBattlefieldFun}>确认</div>
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
          <div className="title">批量创建宝箱</div>
          <div className="input">
            <input type="text" onChange={(e) => setCreateAmount(e.target.value)} placeholder='数量' />
          </div>
          <div className="btn" onClick={CreateBoxMoreFun}>确认</div>
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