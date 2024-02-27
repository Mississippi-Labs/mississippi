import React, { useRef, useState } from 'react';
import './styles.scss';
import Header from './header';
import UserInfo from './userInfo';
import fightIcon from '@/assets/img/fight-icon.png';
import Dialog from '@/pages/ffa/dialog';
import DuelField from '@/components/DuelField';
import { playerA, playerB } from '@/mock/data';

const FFA = () => {

  const [tab, setTab] = useState('home');

  const [dialogVisible, setDialogVisible] = useState(false);
  const [battleVisible, setBattleVisible] = useState(false);
  const battleRef = useRef();

  return (
    <div className={'ffa-page'}>
      <Header/>

      <section className={'ffa-section'}>
        <div className="ffa-switch-wrapper">
          <h2
            className={`switch-item ${tab === 'home' ? 'active' : ''}`}
            onClick={() => {
              setTab('home')
            }}
          >Home</h2>
          <h2
            className={`switch-item ${tab === 'battle' ? 'active' : ''}`}
            onClick={() => {
              setTab('battle')
            }}
          >Battle</h2>
        </div>
        {
          tab === 'home' && <>
            <UserInfo/>
            <button className="mi-btn">Mint and Go</button>
          </>
        }

        {
          tab === 'battle' && <div className={'ffa-battle-wrapper'} >
            <div className="left-content">
              <h3>Leaderboard</h3>
              <div className="leaderboard-wrapper">
                <ul className={'leaderboard-list'}>
                  <li className={'rank-row'}>
                    <div className="rank-num">1</div>
                    <div className="username">Bob</div>
                    <div className="addr">0x34..35</div>
                    <div className="win-count">V2</div>
                    <div className="lose-count">D6</div>
                    <div
                      className="fight-icon"
                      onClick={() => {
                        setDialogVisible(true);
                      }}
                    >
                      <img src={fightIcon} alt="fight"/>
                    </div>
                  </li>
                </ul>
                <div className="my-rank-info rank-row">
                  <div className="rank-num">12</div>
                  <div className="username">Tom</div>
                  <div className="addr">0x34..35</div>
                  <div className="win-count">V2</div>
                  <div className="lose-count">D6</div>

                </div>
              </div>
            </div>
            <div className="right-content">
              <h3>My Battle Logs</h3>
              <ul className="ffa-logs-wrapper">
                <li>
                  <div className="ffa-content">I challenged XX Victory</div>
                  <time>11/25 20:20</time>
                </li>
                <li>
                  <div className="ffa-content">XX challenged me Lose</div>
                  <time>11/24 21:20</time>
                </li>
              </ul>
            </div>
          </div>
        }
      </section>

      <Dialog visible={dialogVisible}>
        <div className={'dialog-user'}>
          <div className="dialog-userinfo">
            <div className="username">AA</div>
            <dl>
              <dt>HP</dt>
              <dd>100</dd>
            </dl>
            <dl>
              <dt>Attack</dt>
              <dd>100</dd>
            </dl>
            <dl>
              <dt>Defense</dt>
              <dd>100</dd>
            </dl>
            <dl>
              <dt>Speed</dt>
              <dd>10</dd>
            </dl>
          </div>

          <div className="dialog-opt">
            <button className="battle-opt mi-btn" onClick={() => setBattleVisible(true)}>Battle</button>
            <button
              className="battle-opt mi-btn"
              onClick={() => {
                setDialogVisible(false);
              }}
            >OK</button>

          </div>
        </div>
      </Dialog>
      {
        battleVisible && (
          <div className="ffa-battle-dialog">
            <div className="battle-user-info player1">
              <div className="battle-user-info-detail">
                <div className="username">Alic</div>
                <div>ATK 10</div>
                <div>DEF 10</div>
                <div>SPD 10</div>
              </div>

              <div className="hp-wrapper">
                <div className="hp" style={{ width: '50%' }}>100/200</div>
              </div>
            </div>

            <div className="battle-user-info player2">
              <div className="battle-user-info-detail">
                <div className="username">Bob</div>
                <div>ATK 10</div>
                <div>DEF 10</div>
                <div>SPD 10</div>
              </div>

              <div className="hp-wrapper">
                <div className="hp" style={{ width: '50%' }}>120/240</div>
              </div>
            </div>

            <DuelField
              ref={battleRef}
              leftPlayer={playerA}
              rightPlayer={playerB}
              afterAttack={() => {
                console.log('attack')
              }}
            />
          </div>
        )
      }

    </div>
  );
};

export default FFA;