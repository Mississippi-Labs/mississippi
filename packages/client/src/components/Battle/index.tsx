import React, { useEffect, useState } from 'react';

import Appearance from '@/components/Appearance';
import "./styles.scss";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue, NotValue, HasValue } from '@latticexyz/recs';
import { useMUD } from '@/mud/MUDContext';
import { decodeEntity, encodeEntity } from "@latticexyz/store-sync/recs";
import { getRandomStr } from '@/utils/utils';
import { ethers } from 'ethers';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { message } from 'antd';

let timeout:any = null
let nonceHex = ''

let curType = ''

export default function Battle(props) {
  let {battleId, curPlayer, targetPlayer} = props
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

  const battles = useEntityQuery([Has(BattleList)]).map((entity) => {
    const id = decodeEntity({ battleId: "uint256" }, entity);
    const battle:any = getComponentValue(BattleList, entity)
    battle.id = id.battleId.toString()
    return battle;
  });

  const initBattle = async () => {
    if (battleState == 1) {
      if (curType == 'attacker' && battle?.attackerState == 1) {
        if (battle?.defenderState >= 1) {
          timeout && clearTimeout(timeout)
          timeout = null
          let localConfirmBattleData = JSON.parse(localStorage.getItem('confirmBattleData') || '[]')
          let action = confirmBattleData[0] || localConfirmBattleData[0] || 'attack'
          let arg = confirmBattleData[1] || localConfirmBattleData[1] || 0
          let actionHex = ethers.utils.formatBytes32String(action);
          console.log(arg, action)
          let src = await revealBattle(battleId, actionHex, arg, nonceHex)
          if (src && src?.type == 'success') {
            setBattleState(2)
          }
        } else {
          if (!timeout) {
            timeout = setTimeout(async () => {
              let resultBattle:any = await forceEnd(battleId)
              console.log(resultBattle)
              if (resultBattle?.isEnd && resultBattle?.winner) {
                props.finishBattle(resultBattle?.winner, resultBattle?.attacker, resultBattle?.defender)
                return
              }
            }, 23000)
          }
        }
      } else if (curType == 'defender' && battle?.defenderState == 1) {
        if (battle?.attackerState >= 1) {
          timeout && clearTimeout(timeout)
          timeout = null
          let localConfirmBattleData = JSON.parse(localStorage.getItem('confirmBattleData') || '[]')
          let action = confirmBattleData[0] || localConfirmBattleData[0] || 'attack'
          let arg = confirmBattleData[1] || localConfirmBattleData[1] || 0
          let actionHex = ethers.utils.formatBytes32String(action);
          console.log(arg, action)
          let src = await revealBattle(battleId, actionHex, arg, nonceHex)
          if (src && src?.type == 'success') {
            setBattleState(2)
          }
        } else {
          if (!timeout) {
            timeout = setTimeout(async () => {
              let resultBattle:any = await forceEnd(battleId)
              console.log(resultBattle)
              if (resultbattle?.isEnd && resultbattle?.winner) {
                props.finishBattle(resultbattle?.winner, resultbattle?.attacker, resultbattle?.defender)
                return
              }
            }, 23000)
          }
        }
      }
    } else if (battleState == 2) {
      if (curType == 'attacker' && (battle?.attackerState == 2 || battle?.attackerState == 0)) {
        if (battle?.defenderState == 2 || battle?.defenderState == 0) {
          timeout && clearTimeout(timeout)
          timeout = null
          setBattleState(3)
        } else {
          if (!timeout) {
            timeout = setTimeout(async () => {
              let resultBattle:any = await forceEnd(battleId)
              console.log(resultBattle)
              if (resultbattle?.isEnd && resultbattle?.winner) {
                props.finishBattle(resultbattle?.winner, resultbattle?.attacker, resultbattle?.defender)
                return
              }
            }, 23000)
          }
        }
      } else if (curType == 'defender' && (battle?.defenderState == 2 || battle?.defenderState == 0)) {
        if (battle?.attackerState == 2 || battle?.attackerState == 0) {
          timeout && clearTimeout(timeout)
          timeout = null
          setBattleState(3)
        } else {
          if (!timeout) {
            timeout = setTimeout(async () => {
              let resultBattle:any = await forceEnd(battleId)
              console.log(resultBattle)
              if (resultbattle?.isEnd && resultbattle?.winner) {
                props.finishBattle(resultbattle?.winner, resultbattle?.attacker, resultbattle?.defender)
                return
              }
            }, 23000)
          }
        }
      }
    }
  }

  const battle = battles.find((battle) => battle.id == battleId);
  console.log(battle, 'battles')
  useEffect(() => {
    if (battle) {
      curType = battle?.attacker.toLocaleLowerCase() == curPlayer.addr.toLocaleLowerCase() ? 'attacker' : 'defender'
      if (battle && (!battleData.curHp || !battleData.targetHp)) {
        let data = {
          attackerHP: battle?.attackerHP.toString(),
          defenderHP: battle?.defenderHP.toString(),
          attacker: battle?.attacker.toLocaleLowerCase(),
          defender: battle?.defender.toLocaleLowerCase(),
        }
        setBattleData(data)
      }
      let state = 0
      if ((curType == 'attacker' && battle?.attackerState == 1) || (curType == 'defender' && battle?.defenderState == 1)) {
        state = 1
      } else if ((curType == 'attacker' && battle?.attackerState == 2) || (curType == 'defender' && battle?.defenderState == 2)) {
        state = 2
      } else if (battle?.isEnd) {
        props.finishBattle(battle?.winner, battle?.attacker, battle?.defender)
        return
      }
      setBattleState(state)
    }
  }, [])

  if (battle) {
    initBattle()
  }

  // if (battle) {
  //   if (!battleData.curHp || !battleData.targetHp) {
  //     let data = {
  //       attackerHP: battle?.attackerHP.toString(),
  //       defenderHP: battle?.defenderHP.toString(),
  //       attacker: battle?.attacker.toLocaleLowerCase(),
  //       defender: battle?.defender.toLocaleLowerCase(),
  //     }
  //     setBattleData(data)
  //   }
  //   let state = 0
  //   if ((battle?.attacker.toLocaleLowerCase() == curPlayer.addr.toLocaleLowerCase() && battle?.attackerState == 1) || (battle?.defender.toLocaleLowerCase() == curPlayer.addr.toLocaleLowerCase() && battle?.defenderState == 1)) {
  //     state = 1
  //   } else if ((battle?.attacker.toLocaleLowerCase() == curPlayer.addr.toLocaleLowerCase() && battle?.attackerState == 2) || (battle?.defender.toLocaleLowerCase() == curPlayer.addr.toLocaleLowerCase() && battle?.defenderState == 2)) {
  //     state = 2
  //   } else if (battle?.isEnd) {
  //     props.finishBattle(battle?.winner, battle?.attacker, battle?.defender)
  //     return
  //   }
  //   setBattleState(state)
  //   initBattle()
  // }

  useEffect(() => {
    if (battleState == 3) {
      console.log(battleData)
      let data = JSON.parse(JSON.stringify(battleData))
      let battle1 = document.querySelector('.battle-1');
      let battle2 = document.querySelector('.battle-2');
      if (battle1 && battle2) {
        console.log(battle?.attackerHP, battle?.defenderHP, data.attackerHP, data.defenderHP)
        setPlayer1LossData(Number(data.attackerHP) - Number(battle?.attackerHP))
        setPlayer2LossData(Number(data.defenderHP) - Number(battle?.defenderHP))
        battle1.classList.add('attack');
        setTimeout(() => {
          battle1.classList.remove('attack');
          battle2.classList.add('back');
          let defenderHP = battle?.defenderHP?.toString()
          setPlayer2LossData(Number(data.defenderHP) - Number(defenderHP))
          setShowPlayer2Loss(true)
          data.defenderHP = defenderHP
          setBattleData(data)
          setTimeout(() => {
            battle2.classList.remove('back');
            setShowPlayer2Loss(false)
            if (defenderHP <= 0 || battle?.isEnd) {
              setTimeout(() => {props.finishBattle(battle?.winner, battle?.attacker, battle?.defender);}, 600)
              return
            }
            setTimeout(() => {
              battle2.classList.add('attack');
              setTimeout(() => {
                battle2.classList.remove('attack');
                battle1.classList.add('back');
                let attackerHP = battle?.attackerHP?.toString()
                setShowPlayer1Loss(true)
                data.attackerHP = attackerHP
                setBattleData(data)
                if (attackerHP <= 0 || battle?.isEnd) {
                  setTimeout(() => {props.finishBattle(battle?.winner, battle?.attacker, battle?.defender);}, 600)
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
    } else {
      initBattle()
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
    let arg = battle?.defenderArg.toString() == '1' ? 'Sprint' : battle?.defenderArg.toString() == '2' ? 'Sneak' : 'Magic'
    let attackerArg = battle?.attackerArg.toString() == '1' ? 'Sprint' : battle?.attackerArg.toString() == '2' ? 'Sneak' : 'Magic'

    if (battle?.attacker.toLocaleLowerCase() == curPlayer.addr.toLocaleLowerCase()) {
      attackerUsername = curPlayer.name
      username = targetPlayer.name
    } else {
      username = curPlayer.name
      attackerUsername = targetPlayer.name
    }
    return (
      <div>
        <p>{attackerUsername} used a {attackerArg}: {player2LossData.toFixed(0)}</p>
        <p>{username} used a {arg}: {player1LossData.toFixed(0)}</p>
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
    console.log(hash, battleId)
    let res = await confirmBattle(hash, battleId);
    // if (res.type == 'error' && res.msg.indexOf('Battle is timeout') > -1) {
    //   forceEnd(battleId)
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
                    <div>{curPlayer?.addr == battleData.attacker ? curPlayer?.name : targetPlayer?.name}</div>
                    <div>ATK:{curPlayer?.addr == battleData.attacker ? curPlayer?.attack?.toString() : targetPlayer?.attack.toString()}</div>
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
                        width: Math.floor(272 * (Number(battleData?.attackerHP) / Number(curPlayer?.addr == battleData?.attacker ? curPlayer?.maxHp : targetPlayer?.maxHp))) + 'px',
                        height: "22px",
                      }}
                    ></div>
                    <div className='hp-text'>{Number(battleData?.attackerHP)}/{Number(curPlayer?.addr == battleData?.attacker ? curPlayer?.maxHp : targetPlayer?.maxHp)}</div>
                  </div>
                  {
                    showPlayer1Loss ? <div className="hp-loss">-{player1LossData.toFixed(0)}</div> : null
                  }
                </div>
                <div className='dark-attacker'>
                  {
                    curPlayer?.addr == battleData.attacker ? <Appearance {...curPlayer?.equip} /> : <Appearance {...targetPlayer?.equip} />
                  }
                </div>
              </div>
              <div className="mi-battle-character-card battle-2" >
                <div className="mi-battle-character-card-hp">
                  <div className='user-info'>
                    <div style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis'}}>{curPlayer?.addr == battleData.defender ? curPlayer?.name : targetPlayer?.name}</div>
                    <div>ATK:{curPlayer?.addr == battleData.defender ? curPlayer?.attack?.toString() : targetPlayer?.attack.toString()}</div>
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
                        width: Math.floor(272 * (Number(battleData?.defenderHP) / Number(curPlayer?.addr == battleData?.defender ? curPlayer?.maxHp : targetPlayer?.maxHp))) + 'px',
                        height: "22px",
                      }}
                    ></div>
                    <div className='hp-text'>{Number(battleData?.defenderHP)}/{Number(curPlayer?.addr == battleData?.defender ? curPlayer?.maxHp : targetPlayer?.maxHp)}</div>
                  </div>
                  {
                    showPlayer2Loss ? <div className="hp-loss">-{player2LossData.toFixed(0)}</div> : null
                  }
                </div>
                <div className='dark-defender'>
                  {
                    curPlayer?.addr == battleData.defender ? <Appearance {...curPlayer?.equip} /> : <Appearance {...targetPlayer?.equip} />
                  }
                </div>
              </div>
            </div>
            <div className='battle-action'>
              <div className='action-step'>
                {
                  battleState == 0 ? <p>what will you do ?</p> : (battleState == 1 || battleState == 2) ? <div >
                    <p>{curPlayer?.name} used a {confirmBattleData[1] == 1 ? 'Sprint' : confirmBattleData[1] == 2 ? 'Sneak' : 'Magic'}!</p>
                    <p>{targetPlayer?.name} is thinking...</p>
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
