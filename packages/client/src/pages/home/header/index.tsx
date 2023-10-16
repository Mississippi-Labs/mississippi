import React from 'react';
import Logo from '@/assets/img/logo.png';
import './styles.scss';
import imgTelegram from '@/assets/img/icon_t.png';
import imgTwitter from '@/assets/img/icon_tw.png';
import imgDiscord from '@/assets/img/icon_d.png';

const HomeHeader = () => {
  return (
    <div className="home-header">
      <img src={Logo} alt="MISSISSIPPI" className="header-logo"/>
      <nav className="header-nav">
        <ul className="menu-lv1">
          <li><a href="">Leaderboard</a></li>
          <li><a href="">Docs</a></li>
          <li className="menu-socials">
            <a href="">Socials</a>
            <ul className="menu-lv2">
              <li>
                <a href="https://twitter.com/0xMississippi" target="_blank" rel="noreferrer">Twitter</a>
                <img src={imgTwitter} alt=""/>
              </li>
              <li>
                <a href="" title="coming soon">Discord</a>
                <img src={imgDiscord} alt=""/>
              </li>
              <li>
                <a href="" title="coming soon">Telegram</a>
                <img src={imgTelegram} alt=""/>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <button className="play-btn">PLAY</button>
    </div>
  );
};

export default HomeHeader;