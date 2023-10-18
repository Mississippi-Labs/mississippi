import React, { useEffect, useRef, useState } from 'react';
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { decodeEntity } from "@latticexyz/store-sync/recs";
import { Has, getComponentValue } from '@latticexyz/recs';
import { useLocation } from 'react-router-dom';
import { useMUD } from '@/mud/MUDContext';
import { main } from '../../utils/createMerkelTree';
import { ethers } from 'ethers';
import { solidityKeccak256, keccak256 } from 'ethers/lib/utils';
import { Buffer } from "buffer";
import './index.scss';

const Test = () => {
  const [stepData, setStepData] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [battleData, setBattleData] = useState([]);
  const [confirmBattleData, setConfirmBattleData] = useState(['Attack', 'None']);

  const {
    components: { Player, GameConfig, BattleList },
    systemCalls: { move, joinBattlefield, transfer, battleInvitation, confirmBattle },
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

  const Battles = useEntityQuery([Has(BattleList)]).map((entity) => getComponentValue(BattleList, entity));
  console.log(Battles, 'Battles')
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
    console.log(e)
    let value = e.target.value
    let battle = [...battleData];
    battle[i] = +value;
    setBattleData(battle);
  }

  const confirmBattleChange = (e, i) => {
    console.log(e.target.value, i)
    let value = e.target.value
    let confirmBattle = [...confirmBattleData];
    confirmBattle[i] = value;
    setConfirmBattleData(confirmBattle);
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
    // console.log(confirmBattleData, 'confirmBattle')
    let hash = getProofHash(confirmBattleData[0], confirmBattleData[1], '0');
    console.log(hash, 'hash')
  }

  const joinBattlefieldFun = () => {
    console.log(account, 'account')
    joinBattlefield(account);
  }

  const revealBattleFun = () => {
  }

  const getProofHash = (action, arg, nonce) => {
    return Buffer.from(
      solidityKeccak256(
          ["string", "string", "string"],
          [action, arg, nonce]
        )
        .slice(2),
      "hex"
    );
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
        Battles.map((item, index) => (<div key={index} className='battle-item'>
          <h6>战场信息</h6>
          <div style={{marginTop: '12px', fontSize: '12px'}}>胜利者：{item.winner}</div>
          <div className='info-w'>
            <div className='battle-section'>
              <p>攻击者信息</p>
              <div>地址： {item?.attacker}</div>
              <div>Action： {item?.attackerAction}</div>
              <div>Arg： {item?.attackerArg}</div>
              <div>BuffHash： {item?.attackerBuffHash}</div>
              <div>HP： {item?.attackerHP}</div>
              <div>State： {item?.attackerState}</div>
            </div>
            <div className='battle-section'>
              <p>被攻击者信息</p>
              <div>地址： {item?.defender}</div>
              <div>Action： {item?.defenderAction}</div>
              <div>Arg： {item?.defenderArg}</div>
              <div>BuffHash： {item?.defenderBuffHash}</div>
              <div>HP： {item?.defenderHP}</div>
              <div>State： {item?.defenderState}</div>
            </div>
          </div>
          
        </div>))
      }
      <div className="main">
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
            <input type="text" onChange={() => battleChange(e, 0)} placeholder='x' />
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
            <select>
              <option value="None">None</option>
              <option value="Fire">Fire</option>
              <option value="Water">Water</option>
              <option value="Wind">Wind</option>
            </select>
          </div>
          <div className="btn" onClick={confirmBattleFun}>确认</div>
        </div>
        <div className="section">
          <div className="title">攻击结果</div>
          <div className="input"></div>
          <div className="btn" onClick={revealBattleFun}>确认</div>
        </div>
      </div>
    </div>
  )
};

export default Test;