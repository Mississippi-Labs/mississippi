import React, { useEffect, useState } from 'react';

import Appearance from '@/components/Appearance';
import "./styles.scss";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue, NotValue, HasValue } from '@latticexyz/recs';
import { useMUD } from '@/mud/MUDContext';
import { decodeEntity } from "@latticexyz/store-sync/recs";
import { getRandomStr } from '@/utils/utils';
import { ethers } from 'ethers';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { message } from 'antd';

let timeout:any = null
let nonceHex = ''
let battle = {}

export default function Battle(props) {
  const [tacticsStep, setTacticsStep] = useState(1);
  const [confirmBattleData, setConfirmBattleData] = useState([]);
  const [battleData, setBattleData] = useState({});
  const [battleState, setBattleState] = useState(0);
  const [player2LossData, setPlayer2LossData] = useState(0);
  const [player1LossData, setPlayer1LossData] = useState(0);
  const [showPlayer1Loss, setShowPlayer1Loss] = useState(false);
  const [showPlayer2Loss, setShowPlayer2Loss] = useState(false);

  const {
    components: { BattleList },
    systemCalls: { confirmBattle, revealBattle, forceEnd },
    network
  } = useMUD();

  let nonce = localStorage.getItem('nonce') || '';
  if (!nonce) {
    nonce = getRandomStr(18);
    localStorage.setItem('nonce', nonce);
  }
  if (!nonceHex) {
    nonceHex = (ethers.utils.formatBytes32String(nonce))
  }

  const initBattle = async () => {
    if (battle && ((battle.attackerState == 1 && battle.defenderState == 0) || (battle.attackerState == 0 && battle.defenderState == 1))) {
      if (!timeout) {
        timeout = setTimeout(async () => {
          let resultBattle:any = await forceEnd(battle.id)
          console.log(resultBattle)
          if (resultBattle.isEnd && resultBattle.winner) {
            props.finishBattle(resultBattle.winner, resultBattle.attacker, resultBattle.defender)
            return
          }
        }, 23000)
      } 
    } else if (battle && ((battle.attackerState == 1 && battle.defenderState == 1) || (battle.attackerState == 2 && battle.defenderState == 1) || (battle.attackerState == 1 && battle.defenderState == 2)) && battleState <= 1) {
      if (battleState == 3) return
      clearTimeout(timeout)
      timeout = null
      let localConfirmBattleData = JSON.parse(localStorage.getItem('confirmBattleData') || '[]')
      let action = confirmBattleData[0] || localConfirmBattleData[0] || 'attack'
      let arg = confirmBattleData[1] || localConfirmBattleData[1] || 0
      let actionHex = ethers.utils.formatBytes32String(action);
      console.log(arg, action)
      let src = await revealBattle(battle.id, actionHex, arg, nonceHex)
      console.log(src)
      if (src?.type == 'success') {
        battle = src.data
        setBattleState(3)
      }
    } 
  }

  const battles = useEntityQuery([Has(BattleList), HasValue(BattleList, {isEnd: false})]).map((entity) => {
    let id = decodeEntity({ battleId: "uint256" }, entity);
    let battle:any = getComponentValue(BattleList, entity)
    battle.id = id.battleId.toString()
    return battle;
  });
  let battleTemp:any = battles?.filter((item:any) => (item.attacker.toLocaleLowerCase() == props?.curPlayer?.addr.toLocaleLowerCase() || item.defender.toLocaleLowerCase() == props?.curPlayer?.addr.toLocaleLowerCase()))[0]
  if (battleTemp) {
    battle = battleTemp
    initBattle()
  } else {
    props.finishBattle()
  }

  useEffect(() => {
    if (battle) {
      if (!battleData.curHp || !battleData.targetHp) {
        let data = {
          attackerHP: battle.attackerHP.toString(),
          defenderHP: battle.defenderHP.toString(),
          attacker: battle.attacker.toLocaleLowerCase(),
          defender: battle.defender.toLocaleLowerCase(),
        }
        setBattleData(data)
      }
      if (battleState == 3) {
        let data = JSON.parse(JSON.stringify(battleData))
        let battle1 = document.querySelector('.battle-1');
        let battle2 = document.querySelector('.battle-2');
        if (battle1 && battle2) {
          console.log(battle.attackerHP, battle.defenderHP, data.attackerHP, data.defenderHP)
          setPlayer1LossData(Number(data.attackerHP) - Number(battle.attackerHP))
          setPlayer2LossData(Number(data.defenderHP) - Number(battle.defenderHP))
          battle1.classList.add('attack');
          setTimeout(() => {
            battle1.classList.remove('attack');
            battle2.classList.add('back');
            let defenderHP = battle.defenderHP
            setPlayer2LossData(Number(data.defenderHP) - Number(defenderHP))
            setShowPlayer2Loss(true)
            data.defenderHP = defenderHP
            setBattleData(data)
            setTimeout(() => {
              battle2.classList.remove('back');
              setShowPlayer2Loss(false)
              if (defenderHP <= 0 || battle.isEnd) {
                setTimeout(() => {props.finishBattle(battle.winner, battle.attacker, battle.defender);}, 600)
                return
              }
              setTimeout(() => {
                battle2.classList.add('attack');
                setTimeout(() => {
                  battle2.classList.remove('attack');
                  battle1.classList.add('back');
                  let attackerHP = battle.attackerHP
                  setShowPlayer1Loss(true)
                  data.attackerHP = attackerHP
                  setBattleData(data)
                  if (attackerHP <= 0 || battle.isEnd) {
                    setTimeout(() => {props.finishBattle(battle.winner, battle.attacker, battle.defender);}, 600)
                    return
                  }
                  setTimeout(() => {
                    battle1.classList.remove('back');
                    setPlayer1LossData(0);
                    setPlayer2LossData(0);
                    setShowPlayer1Loss(false)
                    setBattleState(0)
                    setTacticsStep(1)
                  }, 400);
                }, 400);
              }, 500)
            }, 400);
          }, 400);
        }
      }
    }
  }, [battleState])

  const setTacticsStepFun = (step, action) => {
    console.log(step)
    if (battleState != 0) return
    if (action) {
      setConfirmBattleData([action])
    }
    setTacticsStep(step)
  }

  const setSelectTactic = (tactic: number) => {
    console.log(tactic)
    if (battleState != 0) return
    if (tactic) {
      confirmBattleFun(tactic)
    }
  }

  const getProofHash = (action, arg, nonce) => {
    return solidityKeccak256(
      ["bytes32", "uint256", "bytes32"],
      [action, arg, nonce]
    )
  }

  const getDom = () => {
    let attackerUsername = ''
    let username = ''
    let arg = battle.defenderArg.toString() == '1' ? 'Sprint' : battle.defenderArg.toString() == '2' ? 'Sneak' : 'Magic'
    let attackerArg = battle.attackerArg.toString() == '1' ? 'Sprint' : battle.attackerArg.toString() == '2' ? 'Sneak' : 'Magic'

    if (battle.attacker.toLocaleLowerCase() == props.curPlayer.addr.toLocaleLowerCase()) {
      attackerUsername = props.curPlayer.name
      username = props.targetPlayer.name
    } else {
      username = props.curPlayer.name
      attackerUsername = props.targetPlayer.name
    }
    return (
      <div>
        <p>{attackerUsername} used a {attackerArg}: {player1LossData.toFixed(0)}</p>
        <p>{username} used a {arg}: {player2LossData.toFixed(0)}</p>
      </div>
    )
  }

  const confirmBattleFun = async (arg:Number) => {
    if (battleState != 0) return
    let action = confirmBattleData[0] || 'attack'
    let actionHex = ethers.utils.formatBytes32String(action);
    let hash = getProofHash(actionHex, arg, nonceHex);
    setConfirmBattleData([action, arg])
    localStorage.setItem('confirmBattleData', JSON.stringify([action, arg]))
    setBattleState(1)
    let res = await confirmBattle(hash, battle.id);
    if (res.type == 'success') {
      battle = res.data
    }
    // if (res.type == 'error' && res.msg.indexOf('Battle is timeout') > -1) {
    //   forceEnd(battle.id)
    //   return
    // }
  }
  return (
    <div className="mi-battle-wrap">
      <div className="mi-battle-content">
        <div className="mi-battle">
          <div className="mi-battle-main">
            <div className="mi-battle-character">
              <div className="mi-battle-character-card battle-1" >
                <div className="mi-battle-character-card-hp">
                  <div className='user-info'>
                    <div>{props?.curPlayer?.addr == battleData.attacker ? props?.curPlayer?.name : props?.targetPlayer?.name}</div>
                    <div>ATK:{props?.curPlayer?.addr == battleData.attacker ? props?.curPlayer?.attack?.toString() : props?.targetPlayer?.attack.toString()}</div>
                  </div>
                  <div className='hp-wrap'>
                    <div
                      className="hp"
                      style={{
                        position: "absolute",
                        borderRadius: "2px",
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        background: "#FF6161",
                        width: Math.floor(272 * (Number(battleData?.attackerHP) / Number(props?.curPlayer?.addr == battleData?.attacker ? props?.curPlayer?.maxHp : props?.targetPlayer?.maxHp))) + 'px',
                        height: "22px",
                      }}
                    ></div>
                    <div className='hp-text'>{Number(battleData?.attackerHP)}/{Number(props?.curPlayer?.addr == battleData?.attacker ? props?.curPlayer?.maxHp : props?.targetPlayer?.maxHp)}</div>
                  </div>
                  {
                    showPlayer1Loss ? <div className="hp-loss">-{player1LossData.toFixed(0)}</div> : null
                  }
                </div>
                <div className='dark-attacker'>
                  {
                    props?.curPlayer?.addr == battleData.attacker ? <Appearance {...props?.curPlayer?.equip} /> : <Appearance {...props?.targetPlayer?.equip} />
                  }
                </div>
              </div>
              <div className="mi-battle-character-card battle-2" >
                <div className="mi-battle-character-card-hp">
                  <div className='user-info'>
                    <div style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis'}}>{props?.curPlayer?.addr == battleData.defender ? props?.curPlayer?.name : props?.targetPlayer?.name}</div>
                    <div>ATK:{props?.curPlayer?.addr == battleData.defender ? props?.curPlayer?.attack?.toString() : props?.targetPlayer?.attack.toString()}</div>
                  </div>
                  <div className='hp-wrap'>
                    <div
                      className="hp"
                      style={{
                        position: "absolute",
                        borderRadius: "2px",
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        background: "#FF6161",
                        width: Math.floor(272 * (Number(battleData?.defenderHP) / Number(props?.curPlayer?.addr == battleData?.defender ? props?.curPlayer?.maxHp : props?.targetPlayer?.maxHp))) + 'px',
                        height: "22px",
                      }}
                    ></div>
                    <div className='hp-text'>{Number(battleData?.defenderHP)}/{Number(props?.curPlayer?.addr == battleData?.defender ? props?.curPlayer?.maxHp : props?.targetPlayer?.maxHp)}</div>
                  </div>
                  {
                    showPlayer2Loss ? <div className="hp-loss">-{player2LossData.toFixed(0)}</div> : null
                  }
                </div>
                <div className='dark-defender'>
                  {
                    props?.curPlayer?.addr == battleData.defender ? <Appearance {...props?.curPlayer?.equip} /> : <Appearance {...props?.targetPlayer?.equip} />
                  }
                </div>
              </div>
            </div>
            <div className='battle-action'>
              <div className='action-step'>
                {
                  battleState == 0 ? <p>what will you do ?</p> : battleState == 1 ? <div >
                    <p>{props?.curPlayer?.name} used a {confirmBattleData[1] == 1 ? 'Sprint' : confirmBattleData[1] == 2 ? 'Sneak' : 'Magic'}!</p>
                    <p>{props?.targetPlayer?.name} is thinking...</p>
                  </div> : battleState == 3 ? getDom() : null
                }
                
              </div>
              <div className='battle-tactics'>
                {
                  tacticsStep == 1 ? (<div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                    <div className='tactics-item' onClick={() => setTacticsStepFun(2, 'attack')}>Attack</div>
                    <div className='tactics-item bag'>Bag</div>
                    <div className='tactics-item' onClick={() => setTacticsStepFun(2, 'escape')}>Escape</div>
                  </div>) : tacticsStep == 2 ? (
                    <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                      <div className='tactics-item' onClick={() => setSelectTactic(1)}>Sprint</div>
                      <div className='tactics-item' onClick={() => setSelectTactic(2)}>Sneak</div>
                      <div className='tactics-item' onClick={() => setSelectTactic(3)}>Magic</div>
                      <div className='tactics-item' onClick={() => setTacticsStepFun(1)}><span style={{transform: 'rotate(180deg)', marginBottom: '2px', marginRight: '4px'}}>→</span>Back</div>
                    </div>
                  ) : null
                }
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
