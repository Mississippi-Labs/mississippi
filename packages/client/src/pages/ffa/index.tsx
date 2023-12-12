import React, { useState } from 'react';
import './styles.scss';
import Header from './header';
import UserInfo from './userInfo';
import fightIcon from '@/assets/img/fight-icon.png';

const FFA = () => {

  const [tab, setTab] = useState('home');


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
                    <div className="fight-icon">
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
    </div>
  );
};

export default FFA;