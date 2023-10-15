import React, { useEffect, useRef, useState } from 'react';
import { useComponentValue } from "@latticexyz/react";
import { useLocation } from 'react-router-dom';
import { useMUD } from '@/mud/MUDContext';
import { main } from '../../utils/createMerkelTree';
import './index.scss';

const Test = () => {
  const [stepData, setStepData] = useState([]);

  const {
    components: {Player},
    systemCalls: { move, joinBattlefield },
    network: {playerEntity, account}
  } = useMUD();

  const playerData = useComponentValue(Player, playerEntity);
  console.log(playerData, 'playerData')
  console.log(account, 'account')

  const stepXChange = (e) => {
    let x = e.target.value
    console.log(x)
    let y = stepData[1] || 0;
    setStepData([x, y]);
  }

  const stepYChange = (e) => {
    let y = e.target.value
    let x = stepData[0] || 0;
    setStepData([+x, +y]);
  }
  
  const movePlayer = () => {
    // move(merkelData);
    console.log(stepData, 'move')
    let merkelData = main([stepData]);
    console.log(merkelData)
    move(merkelData);
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
        <h6>用户信息</h6>
        <div style={{marginTop: '8px'}}>坐标：{playerData?.x || 0}，{playerData?.y || 0}</div>
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
            <input type="text" onChange={stepXChange} placeholder='x' />
            <input type="text" onChange={stepYChange} placeholder='y' />
          </div>
          <div className="btn" onClick={movePlayer}>确认</div>
        </div>
      </div>
    </div>
  )
};

export default Test;