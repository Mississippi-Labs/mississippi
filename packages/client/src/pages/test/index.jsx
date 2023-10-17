import React, { useEffect, useRef, useState } from 'react';
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { decodeEntity } from "@latticexyz/store-sync/recs";
import { Has, getComponentValue } from '@latticexyz/recs';
import { useLocation } from 'react-router-dom';
import { useMUD } from '@/mud/MUDContext';
import { main } from '../../utils/createMerkelTree';
import './index.scss';

const Test = () => {
  const [stepData, setStepData] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [battleData, setBattleData] = useState([]);

  const {
    components: { Player, GameConfig },
    systemCalls: { move, joinBattlefield, transfer, battleInvitation },
    network
  } = useMUD();

  const { account } = network;
  console.log(network, 'account')

  const GameData = useEntityQuery([Has(GameConfig)]).map((entity) => getComponentValue(GameConfig, entity));
  console.log(GameData, 'GameData')
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

  const joinBattlefieldFun = () => {
    console.log(account, 'account')
    joinBattlefield(account);
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
            <input type="text" onChange={(e) => battleChange(e, 0)} placeholder='x' />
            <input type="text" onChange={(e) => battleChange(e, 1)} placeholder='y' />
          </div>
          <div className="btn" onClick={battleInvitationFun}>确认</div>
        </div>
      </div>
    </div>
  )
};

export default Test;