import React, { useEffect, useState } from 'react';
import duck from "@/assets/img/DarkDuck.svg";
import info from "@/assets/img/battle/info.png";
import attackButton from "@/assets/img/battle/attack-button.png";
import iconBg from "@/assets/img/battle/icon-bg.svg";
import runButton from "@/assets/img/battle/run-button.png";
import rock from "@/assets/img/battle/rock.png";
import scissors from "@/assets/img/battle/scissors.png";
import paper from "@/assets/img/battle/paper.png";
import attack from "@/assets/img/battle/attack.svg";
import button1 from "@/assets/img/battle/Button1.png";
import button2 from "@/assets/img/battle/Button2.png";
import button3 from "@/assets/img/battle/Button3.png";
import button4 from "@/assets/img/battle/Button4.png";
import button5 from "@/assets/img/battle/Button5.png";

// import tactic from "@/assets/img/battle/tactic.svg";
import btnBg from "@/assets/img/battle/btn-bg.svg";
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

let battlesId = ''
let battle = {}

export default function Battle(props) {
  const [selectActionData, setSelectActionData] = useState('');
  const [selectTacticData, setSelectTacticData] = useState('');
  const [confirmBattleData, setConfirmBattleData] = useState([]);
  const [confirmBattle2Data, setConfirmBattle2Data] = useState([]);
  const [battleData, setBattleData] = useState({});
  const [battleState, setBattleState] = useState(0);
  const [player2LossData, setPlayer2LossData] = useState(0);
  const [player1LossData, setPlayer1LossData] = useState(0);

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
      clearTimeout(timeout)
      timeout = null
      let action = confirmBattleData[0] || 'attack'
      let arg = confirmBattleData[1] || 0
      let actionHex = ethers.utils.formatBytes32String(action);
      let src = await revealBattle(battle.id, actionHex, arg, nonceHex)
      if (src.type == 'success') battle = src.data
      setBattleState(3)
      // initBattle()
    } 
    // else if (battle && (battle.attackerState == 0 || battle.attackerState == 2) && (battle.defenderState == 0 || battle.defenderState == 2) && battleState == 2) {
    //   setBattleState(3)
    // }
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
    console.log(battle)
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
        let data = battleData
        let battle1 = document.querySelector('.battle-1');
        let battle2 = document.querySelector('.battle-2');
        if (battle1 && battle2) {
          battle1.classList.add('attack');
          setTimeout(() => {
            battle1.classList.remove('attack');
            battle2.classList.add('back');
            let defenderHP = battle.defenderHP
            setPlayer2LossData(Number(data.defenderHP) - Number(defenderHP))
            data.defenderHP = defenderHP
            setBattleData(data)
            setTimeout(() => {
              battle2.classList.remove('back');
              setPlayer2LossData(0);
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
                  setPlayer1LossData(Number(data.attackerHP) - Number(attackerHP))
                  data.attackerHP = attackerHP
                  setBattleData(data)
                  if (attackerHP <= 0 || battle.isEnd) {
                    setPlayer1ResidualData(0);
                    setTimeout(() => {props.finishBattle(battle.winner, battle.attacker, battle.defender);}, 600)
                    return
                  }
                  setTimeout(() => {
                    battle1.classList.remove('back');
                    setPlayer1LossData(0);
                    setBattleState(0)
                  }, 400);
                }, 400);
              }, 500)
            }, 400);
          }, 400);
        }
      }
    }
  }, [battleState])

  const setSelectAction = (img: any, action: String) => {
    setSelectActionData(img);
    let bt:any = confirmBattleData
    bt[0] = action
    setConfirmBattleData(bt)
  }
  const setSelectTactic = (img: any, tactic: number) => {
    setSelectTacticData(img);
    let bt:any = confirmBattleData
    bt[1] = tactic
    setConfirmBattleData(bt)
  }

  const getProofHash = (action, arg, nonce) => {
    return solidityKeccak256(
      ["bytes32", "uint256", "bytes32"],
      [action, arg, nonce]
    )
  }

  const confirmBattleFun = async () => {
    if (battleState != 0) return
    if (!confirmBattleData[0]) {
      message.info('Please select action')
      return
    }
    let battle:any = battles.filter((item:any) => (item?.attacker?.toLocaleLowerCase() == props?.curPlayer?.addr.toLocaleLowerCase() || item?.defender?.toLocaleLowerCase() == props?.curPlayer?.addr.toLocaleLowerCase()) && !item.isEnd)[0]
    let action = confirmBattleData[0]
    let arg = confirmBattleData[1] || 0
    let actionHex = ethers.utils.formatBytes32String(action);
    let hash = getProofHash(actionHex, arg, nonceHex);
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
              <div className="mi-battle-character-card battle-1" style={{ marginLeft: '90px' }}>
                <div className="mi-battle-character-card-hp">
                  <div
                    className="hp"
                    style={{
                      position: "absolute",
                      borderRadius: "2px",
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      background: "#FF6161",
                      width: Math.floor(152 * (Number(battleData?.attackerHP) / Number(props?.curPlayer?.addr == battleData?.attacker ? props?.curPlayer?.maxHp : props?.targetPlayer?.maxHp))) + 'px',
                      height: "22px",
                    }}
                  ></div>
                  {
                    player1LossData ? <div className="hp-loss">-{player1LossData.toFixed(0)}</div> : null
                  }
                </div>
                {
                  props?.curPlayer?.addr == battleData.attacker ? <Appearance {...props?.curPlayer?.equip} /> : <Appearance {...props?.targetPlayer?.equip} />
                }
                {/* <img
                  src={duck}
                  style={{
                    transform: "scaleX(-1)",
                  }}
                  alt=""
                /> */}
              </div>
              <div className="mi-battle-character-card battle-2" style={{ marginRight: '90px' }}>
                <div className="mi-battle-character-card-hp">
                  {/* {
                    confirmBattle2Data.length && confirmBattle2Data[0] ? (
                      <div className="confirm-info">
                        <img src={confirmBattle2Data[0]} alt="" />
                        <img src={confirmBattle2Data[1]} alt="" />
                      </div>
                    ) : ''
                  } */}
                  <div
                    className="hp"
                    style={{
                      position: "absolute",
                      borderRadius: "2px",
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      background: "#FF6161",
                      width: Math.floor(152 * (Number(battleData.defenderHP) / Number(props?.curPlayer?.addr == battleData.defender ? props?.curPlayer?.maxHp : props?.targetPlayer?.maxHp))) + 'px',
                      height: "22px",
                    }}
                  ></div>
                  {
                    player2LossData ? <div className="hp-loss">-{(player2LossData).toFixed(0)}</div> : null
                  }
                </div>
                {
                  props?.curPlayer?.addr == battleData.defender ? <Appearance {...props?.curPlayer?.equip} /> : <Appearance {...props?.targetPlayer?.equip} />
                }
              </div>
              <div className="mi-battle-character-info">
                <div className="character-info self">
                  <div>HP : {battleData.attackerHP}/{props?.curPlayer?.addr == battleData.attacker ? props?.curPlayer?.maxHp.toString() : props?.targetPlayer?.maxHp.toString()}</div>
                  <div>ATK : {props?.curPlayer?.addr == battleData.attacker ? props?.curPlayer?.attack?.toString() : props?.targetPlayer?.attack.toString()}</div>
                </div>
                <div className="character-info opponent">
                  <div>HP : {battleData.defenderHP}/{props?.curPlayer?.addr == battleData.defender ? props?.curPlayer?.maxHp.toString() : props?.targetPlayer?.maxHp.toString()}</div>
                  <div>ATK : {props?.curPlayer?.addr == battleData.defender ? props?.curPlayer?.attack?.toString() : props?.targetPlayer?.attack.toString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mi-battle-action">
            <div className="action">
              <div className="action-title">Action</div>
              <div style={{ display: "flex" }}>
                <div className="icon" onClick={() => setSelectAction(attackButton, 'attack')}>
                  {/* <img src={iconBg} alt="" className="icon-bg" /> */}
                  <img src={button4} alt="" className="icon-btn" />
                </div>
                <div className="icon" onClick={() => setSelectAction(runButton, 'escape')}>
                  {/* <img src={iconBg} alt="" className="icon-bg" /> */}
                  <img src={button5} alt="" className="icon-btn" />
                </div>
              </div>
            </div>
            <div className="action">
              <div className="action-hint">{battleState == 0 ? 'Select your action and tactic' : battleState == 1 ? "Waiting for your opponent's move, it may take up to 120 seconds" : ''}</div>
              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  columnGap: "12px",
                }}
              >
                <div style={{ width: "40px", height: selectActionData.indexOf('run-button.png') > -1 ? "40px" : '34px' }}>
                  {selectActionData ? <img src={selectActionData} style={{ width: selectActionData.indexOf('run-button.png') > -1 ? "54px" : '34px', height: selectActionData.indexOf('run-button.png') > -1 ? "54px" : '34px', marginTop: selectActionData.indexOf('run-button.png') > -1 ? "-4px" : '0' }} alt="" /> : null}
                </div>
                <div style={{ width: '40px', height: '40px' }}>
                  {selectTacticData ? <img src={selectTacticData} style={{ width: "40px", height: "40px" }} alt="" /> : null}
                </div>
              </div>
              <div className="confirm-btn" onClick={confirmBattleFun} style={{cursor: battleState == 0 ? 'pointer' : 'no-drop'}}>
                <img src={btnBg} alt="" />
                <div className="confirm-text">confirm</div>
              </div>
            </div>
            <div className="action">
              <div className="action-title" style={{ marginLeft: 'auto' }}>Tactic</div>
              <div style={{ display: "flex" }}>
                <div className="icon icon-r" onClick={() => setSelectTactic(rock, 1)}>
                  {/* <img src={iconBg} alt="" className="icon-bg" /> */}
                  <img src={button1} alt="" className="icon-btn" />
                </div>
                <div className="icon icon-r" onClick={() => setSelectTactic(scissors, 2)}>
                  {/* <img src={iconBg} alt="" className="icon-bg" /> */}
                  <img src={button2} alt="" className="icon-btn" />
                </div>
                <div className="icon icon-r" onClick={() => setSelectTactic(paper, 3)}>
                  {/* <img src={iconBg} alt="" className="icon-bg" /> */}
                  <img src={button3} alt="" className="icon-btn" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mi-battle-info">
          <div className="info-title">Rules</div>
          <div className="action-section">
            <div className="section-title">action</div>
            <div className="action-item">
              <img src={attackButton} alt="" style={{ width: '34px', height: '34px' }} />
              <p>attack</p>
            </div>
            <div className="action-item">
              <img src={runButton} alt="" style={{ width: '54px', height: '54px', marginLeft: '-8px' }} />
              <p>escape</p>
            </div>
          </div>
          <div className="tactic-section">
            <div className="section-title">tactic</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={rock} alt="" />
              <p>{'>'}</p>
              <img src={scissors} alt="" />
              <p>{'>'}</p>
              <img src={paper} alt="" />
              <p>{'>'}</p>
              <img src={rock} alt="" />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
