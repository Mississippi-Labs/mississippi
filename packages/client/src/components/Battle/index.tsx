import React, { useEffect, useState, useRef } from 'react';
import DuelField, { AttackType, IDuelFieldMethod } from '@/components/DuelField';
import "./styles.scss";
import { useMUD } from '@/mud/MUDContext';
import { getRandomStr } from '@/utils/utils';
import { ethers } from 'ethers';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { message } from 'antd';
import CountDown from '@/hooks/useCountDown';

let interval:any = null
let nonceHex = ''

let curType = ''

let isFirst = false

export default function Battle(props) {
  const duel = useRef<IDuelFieldMethod>();

  let {battleId, curPlayer, targetPlayer} = props
  const [tacticsStep, setTacticsStep] = useState(1);
  const [confirmBattleData, setConfirmBattleData] = useState([]);
  const [battleData, setBattleData] = useState({});
  const [battleState, setBattleState] = useState(0);
  const [player2LossData, setPlayer2LossData] = useState(0);
  const [player1LossData, setPlayer1LossData] = useState(0);
  const [showPlayer1Loss, setShowPlayer1Loss] = useState(false);
  const [showPlayer2Loss, setShowPlayer2Loss] = useState(false);

  curPlayer.toward = 'Right'
  targetPlayer.toward = 'Left'

  const {
    systemCalls: { confirmBattle, revealBattle, forceEnd },
    network
  } = useMUD();

  const { tables, useStore } = network

  let nonce = localStorage.getItem('nonce') || '';
  if (!nonce) {
    nonce = getRandomStr(18);
    localStorage.setItem('nonce', nonce);
  }
  if (!nonceHex) {
    nonceHex = (ethers.utils.formatBytes32String(nonce))
  }

  const battleList = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.BattleList1));
    return records.map((e:any) => Object.assign(e.value, {id: e.key.battleId}));
  });

  const battles = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.BattleList));
    return records.map((e:any) => {
      let battleItem = Object.assign(e.value, {id: e.key.battleId})
      // battleList
      let battle = battleList.find((e: any) => e.id == battleItem.id) || {}
      if (battle) {
        battleItem = Object.assign(battleItem, battle)
      }
      return battleItem
    });
  });

  const setTimer = (s) => {
    console.log(s)
    const seconds = Number(s)
    if (seconds == 0) {
      forceEndFun()
    } else {
      return (<p style={{height: '20px', background: '#fff', width: (seconds / 30 * 100) + '%'}}>{seconds}</p>)
    }
  }

  const forceEndFun = async () => {
    try {
      let resultBattle:any = await forceEnd(battleId)
      if (resultBattle?.type && resultBattle?.type == 'error') {
      } else if (resultBattle?.isEnd && resultBattle?.winner) {
        isFirst = true
        props.finishBattle(resultBattle?.winner, resultBattle?.attacker, resultBattle?.defender)
        return
      }
    } catch (err) {
      console.log(err)
    }
  }

  const initBattle = async () => {
    if (battleState == 1 || battleState == 5) {
      if (curType == 'attacker' && battle?.attackerState == 1) {
        if (battle?.defenderState >= 1) {
          let localConfirmBattleData = JSON.parse(localStorage.getItem('confirmBattleData') || '[]')
          let action = confirmBattleData[0] || localConfirmBattleData[0] || 'attack'
          let arg = confirmBattleData[1] || localConfirmBattleData[1] || 0
          let actionHex = ethers.utils.formatBytes32String(action);
          console.log(arg, action)
          let res = await revealBattle(battleId, actionHex, arg, nonceHex)
          if (res && res?.type == 'success') {
            battle.attackerState = res.data.attackerState
            battle.defenderState = res.data.defenderState
            setTimeout(() => {
              setBattleState(2)
            }, 200)
          } else {
            // initBattle()
          }
        } else {
        }
      } else if (curType == 'defender' && battle?.defenderState == 1) {
        if (battle?.attackerState >= 1) {
          let localConfirmBattleData = JSON.parse(localStorage.getItem('confirmBattleData') || '[]')
          let action = confirmBattleData[0] || localConfirmBattleData[0] || 'attack'
          let arg = confirmBattleData[1] || localConfirmBattleData[1] || 0
          let actionHex = ethers.utils.formatBytes32String(action);
          console.log(arg, action)
          let res = await revealBattle(battleId, actionHex, arg, nonceHex)
          if (res && res?.type == 'success') {
            battle.attackerState = res.data.attackerState
            battle.defenderState = res.data.defenderState
            setTimeout(() => {
              setBattleState(2)
            }, 200)
          } else {
            // initBattle()
          }
        }
      }
    } else if (battleState == 2) {
      console.log(battleState, battle)
      if (curType == 'attacker' && (battle?.attackerState == 2 || battle?.attackerState == 0)) {
        if (battle?.defenderState == 2 || battle?.defenderState == 0) {
          setBattleState(3)
          console.log(3)
        }
      } else if (curType == 'defender' && (battle?.defenderState == 2 || battle?.defenderState == 0)) {
        if (battle?.attackerState == 2 || battle?.attackerState == 0) {
          setBattleState(3)
        }
      }
    } else if (battleState != 3 && battleState != 4 && battle?.isEnd) {
      props.finishBattle(battle?.winner, battle?.attacker, battle?.defender)
      return
    }
  }

  const battle = battles.find((battle) => battle.id == battleId);
  useEffect(() => {
    if (battle) {
      isFirst = false
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
      if (battle?.isEnd) {
        isFirst = true
        props.finishBattle(battle?.winner, battle?.attacker, battle?.defender)
        return
      } else if ((curType == 'attacker' && battle?.attackerState == 1) || (curType == 'defender' && battle?.defenderState == 1)) {
        state = 1
      } else if ((curType == 'attacker' && battle?.attackerState == 2) || (curType == 'defender' && battle?.defenderState == 2)) {
        state = 2
      }
      duel.current.reset()
      setBattleState(state)
      initBattle()
    }
  }, [battleId])

  if (battle) {
    isFirst = false
    initBattle()
  }

  const finishBattleFun = () => {
    if (battleState == 4) {
      props.finishBattle(battle?.winner, battle?.attacker, battle?.defender);
    }
  }

  const hiddenPlayerLoss = () => {
    setTimeout(() => {
      setShowPlayer1Loss(false)
      setShowPlayer2Loss(false)
    }, 1000)
  }

  const afterAttack = (role: string) => {
    console.log(role)
    let attackType = battle.defenderArg.toString() == '1' ? 'sprint' : battle.defenderArg.toString() == '2' ? 'sneak' : 'magic'
    let data = JSON.parse(JSON.stringify(battleData))
    if (role == 'left') {
      if (curType == 'attacker') {
        let defenderHP = battle?.defenderHP?.toString()
        setPlayer2LossData(Number(data.defenderHP) - Number(defenderHP))
        setShowPlayer2Loss(true)
        hiddenPlayerLoss()
        data.defenderHP = defenderHP
        setBattleData(data)
        if (battle?.defenderHP == 0) {
          duel.current.kill('right')
          setBattleState(4)
        } else {
          setTimeout(() => {
            duel.current.rightAttack(attackType);
          }, 1000)
        }
      } else {
        let attackerHP = battle?.attackerHP?.toString()
        setPlayer2LossData(Number(data.attackerHP) - Number(attackerHP))
        setShowPlayer2Loss(true)
        hiddenPlayerLoss()
        data.attackerHP = attackerHP
        setBattleData(data)
        if (battle?.attackerHP == 0) {
          duel.current.kill('right')
          setBattleState(4)
        } else {
          if (!battle?.isEnd) {
            setBattleState(0)
          }
          setTacticsStep(1)
        }
      }
    } else if (role == 'right') {
      if (curType == 'attacker') {
        let attackerHP = battle?.attackerHP?.toString()
        setPlayer1LossData(Number(data.attackerHP) - Number(attackerHP))
        setShowPlayer1Loss(true)
        hiddenPlayerLoss()
        data.attackerHP = attackerHP
        setBattleData(data)
        if (battle?.attackerHP == 0) {
          duel.current.kill('left')
          setBattleState(4)
        } else {
          if (!battle?.isEnd) {
            setBattleState(0)
          }
          setTacticsStep(1)
        }
      } else {
        let defenderHP = battle?.defenderHP?.toString()
        setPlayer1LossData(Number(data.defenderHP) - Number(defenderHP))
        setShowPlayer1Loss(true)
        hiddenPlayerLoss()
        data.defenderHP = defenderHP
        setBattleData(data)
        if (battle?.defenderHP == 0) {
          duel.current.kill('left')
          setBattleState(4)
        } else {
          setTimeout(() => {
            duel.current.leftAttack(attackType);
          }, 1000)
        }
      }
    }
  }

  useEffect(() => {
    if (battleState == 3) {
      let data = JSON.parse(JSON.stringify(battleData))
      if (battle.isEnd && battle?.attackerHP && battle?.defenderHP) {
        props.finishBattle(battle?.winner, battle?.attacker, battle?.defender)
        return
      }
      setPlayer1LossData(Number(data.attackerHP) - Number(battle?.attackerHP))
      setPlayer2LossData(Number(data.defenderHP) - Number(battle?.defenderHP))
      let attackType = battle.attackerArg.toString() == '1' ? 'sprint' : battle.attackerArg.toString() == '2' ? 'sneak' : 'magic'
      if (curType == 'attacker') {
        duel.current.leftAttack(attackType);
      } else {
        duel.current.rightAttack(attackType);
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
    let res = await confirmBattle(hash, battleId);
    if (res?.type && res?.type == 'error') {
      message.error(res?.msg)
      setBattleState(0)
      localStorage.removeItem('confirmBattleData')
      return
    } else {
      console.log(res)
      setTimeout(() => {
        setBattleState(5)
      }, 100)
    }
  }
  return (
    <div className="mi-battle-wrap" onClick={finishBattleFun}>
      <div className="mi-battle-content">
        <div className="mi-battle">
          <div className="mi-battle-main">
            <div className="mi-battle-character">
              <div className="mi-battle-character-card" >
                <div className="mi-battle-character-card-hp">
                  <div className='user-info'>
                    <div>{curPlayer?.name}</div>
                    <div>ATK:{curPlayer?.attack?.toString()}</div>
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
                        width: Math.floor(272 * (Number(curType == 'attacker' ? battleData?.attackerHP : battleData?.defenderHP) / Number(curPlayer?.maxHp))) + 'px',
                        height: "22px",
                      }}
                    />
                    <div className='hp-text'>{Number(curType == 'attacker' ? battleData?.attackerHP : battleData?.defenderHP)}/{curPlayer?.maxHp}</div>
                  </div>
                  {
                    showPlayer1Loss ? <div className="hp-loss">-{player1LossData.toFixed(0)}</div> : null
                  }
                </div>
              </div>
              <div className="mi-battle-character-card" >
                <div className="mi-battle-character-card-hp">
                  <div className='user-info'>
                    <div style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis'}}>{targetPlayer?.name}</div>
                    <div>ATK:{targetPlayer?.attack.toString()}</div>
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
                        width: Math.floor(272 * (Number(curType == 'attacker' ? battleData?.defenderHP : battleData?.attackerHP) / Number(targetPlayer?.maxHp))) + 'px',
                        height: "22px",
                      }}
                    />
                    <div className='hp-text'>{Number(curType == 'attacker' ? battleData?.defenderHP : battleData?.attackerHP)}/{Number(targetPlayer?.maxHp)}</div>
                  </div>
                  {
                    showPlayer2Loss ? <div className="hp-loss">-{player2LossData.toFixed(0)}</div> : null
                  }
                </div>
              </div>
            </div>
            <div style={{position: 'absolute', top: '50px', height: '380px'}}>
              <DuelField
                ref={duel}
                leftPlayer={curPlayer}
                rightPlayer={targetPlayer}
                afterAttack={afterAttack}
              />
            </div>
            <div className='battle-action'>
              <div className='action-step'>
                {
                  battleState == 0 ? <p>what will you do ?</p> : (battleState == 1 || battleState == 5 || battleState == 2) ? <div >
                    <p>{curPlayer?.name} used a {confirmBattleData[1] == 1 ? 'Sprint' : confirmBattleData[1] == 2 ? 'Sneak' : 'Magic'}!</p>
                    <p>{targetPlayer?.name} is thinking...</p>
                    {
                      <CountDown
                        // 要倒计时20s
                        duration={30}
                        formatString="s"
                      >
                        {(str) => setTimer(str)}
                      </CountDown>
                    }
                  </div> : battleState == 3 ? getDom() : battleState == 4 ? <p>{battle?.winner.toLocaleLowerCase() == curPlayer.addr.toLocaleLowerCase() ? `You win the battle! Click anywhere on the screen to continue you adventure` : `You loss the battle! Don't worry. Click anywhere on the screen to return to the Base`}</p> : null
                }
                
              </div>
              <div className='battle-tactics'>
                {
                  tacticsStep == 1 ? (<div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', color: battleState != 0 ? 'rgba(217, 217, 217, 0.58)' : '#FFF'}}>
                    <div className='tactics-item' onClick={() => setTacticsStepFun(2, 'attack')}>Attack</div>
                    <div className='tactics-item bag'>Bag</div>
                    <div className='tactics-item' onClick={() => setTacticsStepFun(2, 'escape')}>Escape</div>
                  </div>) : tacticsStep == 2 ? (
                    <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', color: battleState != 0 ? 'rgba(217, 217, 217, 0.58)' : '#FFF'}} >
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
