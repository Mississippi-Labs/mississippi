import React, { useState } from 'react';
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
import "./styles.scss";

export default function Battle(props) {
  const [selectActionData, setSelectActionData] = useState('');
  const [selectTacticData, setSelectTacticData] = useState('');
  const [player2LossData, setPlayer2LossData] = useState(0);
  const [player1LossData, setPlayer1LossData] = useState(0);
  const [confirmBattleData, setConfirmBattleData] = useState([]);

  const [player2ResidualData, setPlayer2ResidualData] = useState(1);
  const [player1ResidualData, setPlayer1ResidualData] = useState(1);

  const setSelectAction = (img: any) => {
    setSelectActionData(img);
  }
  const setSelectTactic = (img: any) => {
    setSelectTacticData(img);
  }
  const confirmBattle = () => {
    //battle-1
    let battle1 = document.querySelector('.battle-1');
    let battle2 = document.querySelector('.battle-2');
    setConfirmBattleData([selectActionData, selectTacticData])
    if (battle1 && battle2) {
      battle1.classList.add('attack');
      setTimeout(() => {
        battle1.classList.remove('attack');
        battle2.classList.add('back');
        setPlayer2LossData(.4);
        // setPlayer2ResidualData(player2ResidualData - .4);
        if (player2ResidualData - .4 <= 0) {
          setPlayer2ResidualData(0);
        } else {
          setPlayer2ResidualData(player2ResidualData - .4);
        }

        setTimeout(() => {
          battle2.classList.remove('back');
          setPlayer2LossData(0);
          // console.log(player2ResidualData)
          if (player2ResidualData - .4 <= 0) {
            setConfirmBattleData([]);
            props.finishBattle(1);
            return
          }
          setTimeout(() => {
            battle2.classList.add('attack');
            setTimeout(() => {
              battle2.classList.remove('attack');
              battle1.classList.add('back');
              setPlayer1LossData(.4);
              if (player1ResidualData - .4 <= 0) {
                setPlayer1ResidualData(0);
                setConfirmBattleData([]);
                props.finishBattle(2);
                return
              } else {
                setPlayer1ResidualData(player1ResidualData - .4);
              }
              setTimeout(() => {
                battle1.classList.remove('back');
                setPlayer1LossData(0);
                setConfirmBattleData([]);
              }, 400);
            }, 400);
          }, 1000)
        }, 400);
      }, 400);
    }
  }
  return (
    <div className="mi-battle-wrap">
      <div className="mi-battle-content">
        <div className="mi-battle">
          <div className="mi-battle-main">
            <div className="mi-battle-character">
              <div className="mi-battle-character-card battle-1" style={{ marginLeft: '90px' }}>
                <div className="mi-battle-character-card-hp">
                  {
                    confirmBattleData.length && confirmBattleData[0] ? (
                      <div className="confirm-info">
                        <img src={confirmBattleData[0]} alt="" />
                        <img src={confirmBattleData[1]} alt="" />
                      </div>
                    ) : ''
                  }
                  <div
                    className="hp"
                    style={{
                      position: "absolute",
                      borderRadius: "2px",
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      background: "#FF6161",
                      width: 152 * player1ResidualData + 'px',
                      height: "22px",
                    }}
                  ></div>
                  {
                    player1LossData ? <div className="hp-loss">-{(50 * player1LossData).toFixed(0)}</div> : null
                  }
                </div>
                <img
                  src={duck}
                  style={{
                    transform: "scaleX(-1)",
                  }}
                  alt=""
                />
              </div>
              <div className="mi-battle-character-card battle-2" style={{ marginRight: '90px' }}>
                <div className="mi-battle-character-card-hp">
                  {
                    confirmBattleData.length && confirmBattleData[0] ? (
                      <div className="confirm-info">
                        <img src={confirmBattleData[0]} alt="" />
                        <img src={confirmBattleData[1]} alt="" />
                      </div>
                    ) : ''
                  }
                  <div
                    className="hp"
                    style={{
                      position: "absolute",
                      borderRadius: "2px",
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      background: "#FF6161",
                      width: 152 * player2ResidualData + 'px',
                      height: "22px",
                    }}
                  ></div>
                  {
                    player2LossData ? <div className="hp-loss">-{(50 * player2LossData).toFixed(0)}</div> : null
                  }
                  {/* <div className="hp-loss">-{160 * player2LossData}</div> */}
                </div>
                <img src={duck} alt="" />
              </div>
              <div className="mi-battle-character-info">
                <div className="character-info self">
                  <div>HP : {(50 * player1ResidualData).toFixed(0)}/50</div>
                  <div>ATK : 20</div>
                </div>
                <div className="character-info opponent">
                  <div>HP : {(50 * player2ResidualData).toFixed(0)}/50</div>
                  <div>ATK : 20</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mi-battle-action">
            <div className="action">
              <div className="action-title">Action</div>
              <div style={{ display: "flex" }}>
                <div className="icon" onClick={() => setSelectAction(attackButton)}>
                  {/* <img src={iconBg} alt="" className="icon-bg" /> */}
                  <img src={button4} alt="" className="icon-btn" />
                </div>
                <div className="icon" onClick={() => setSelectAction(runButton)}>
                  {/* <img src={iconBg} alt="" className="icon-bg" /> */}
                  <img src={button5} alt="" className="icon-btn" />
                </div>
              </div>
            </div>
            <div className="action">
              <div className="action-hint">Opponent making a move</div>
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
              <div className="confirm-btn" onClick={confirmBattle}>
                <img src={btnBg} alt="" />
                <div className="confirm-text">confirm</div>
              </div>
            </div>
            <div className="action">
              <div className="action-title" style={{ marginLeft: 'auto' }}>Tactic</div>
              <div style={{ display: "flex" }}>
                <div className="icon icon-r" onClick={() => setSelectTactic(rock)}>
                  {/* <img src={iconBg} alt="" className="icon-bg" /> */}
                  <img src={button1} alt="" className="icon-btn" />
                </div>
                <div className="icon icon-r" onClick={() => setSelectTactic(scissors)}>
                  {/* <img src={iconBg} alt="" className="icon-bg" /> */}
                  <img src={button2} alt="" className="icon-btn" />
                </div>
                <div className="icon icon-r" onClick={() => setSelectTactic(paper)}>
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
