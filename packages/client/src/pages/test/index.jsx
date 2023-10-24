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

const Test = () => {
  const [stepData, setStepData] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [battleData, setBattleData] = useState([]);
  const [confirmBattleData, setConfirmBattleData] = useState(['Attack', 1]);
  const [battlesData, setBattlesData] = useState([]);

  const {
    components: { Player, GameConfig, BattleList, BoxList },
    systemCalls: { move, joinBattlefield, transfer, battleInvitation, confirmBattle, selectUserNft, revealBattle, openBox, revealBox, getCollections },
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

  const battles = useEntityQuery([Has(BattleList)]).map((entity) => {
    let id = decodeEntity({ battleId: "uint256" }, entity);
    let battle = getComponentValue(BattleList, entity)
    console.log(battle, 'battle', id, entity)
    battle.id = id.battleId.toString()
    return battle;
  });
  console.log(battles, 'battles')

  const boxs = useEntityQuery([Has(BoxList)]).map((entity) => {
    let id = decodeEntity({ boxId: "uint256" }, entity);
    let box = getComponentValue(BoxList, entity)
    console.log(box, 'box', id)
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

  const stepChange = (e, i) => {
    console.log(e)
    let value = e.target.value
    let step = [...stepData];
    step[i] = +value;
    setStepData(step);
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
    selectUserNft(1);
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
      console.log(from, to, 'from, to')
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
      let argHex = ethers.utils.formatBytes32String(arg.toString());
      let nonceHex = ethers.utils.formatBytes32String(nonce);
      let hash = getProofHash(actionHex, argHex, nonceHex);
      console.log(hash, 'hash')
      console.log(actionHex, argHex, nonceHex, 'actionHex, argHex, nonceHex')
      confirmBattle(hash, battle.id);
      battlesDataTemp.push({
        id: battle.id,
        action: actionHex,
        arg: argHex,
        nonce: nonceHex
      })
      setBattlesData(battlesDataTemp)
    } else {
      alert('已经确认过了')
    }
    // console.log(hash, 'hash')
  }

  const joinBattlefieldFun = () => {
    console.log(account, 'account')
    joinBattlefield();
  }

  const revealBattleFun = () => {
    let battle = battles.filter(item => item.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() || item.defender.toLocaleLowerCase() == account.toLocaleLowerCase())[0]
    let bettleItem = battlesData.filter(item => item.id == battle.id)[0]
    console.log(bettleItem, 'bettleItem')
    revealBattle(battle.id, bettleItem.action, bettleItem.arg, bettleItem.nonce);
  }

  const getProofHash = (action, arg, nonce) => {
    return solidityKeccak256(
      ["bytes32", "bytes32", "bytes32"],
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
      </div>
    </div>
  )
};

export default Test;