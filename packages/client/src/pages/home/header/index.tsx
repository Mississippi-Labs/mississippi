import React from 'react';
import Logo from '@/assets/img/logo.png';
import './styles.scss';

const HomeHeader = () => {
  return (
    <div className="home-header">
      <img src={Logo} alt="MISSISSIPPI" className="header-logo"/>
      <nav className="header-nav">
        <ul>
          <li><a href="">Leaderboard</a></li>
          <li><a href="">Docs</a></li>
        </ul>
      </nav>

      <button className="play-btn">Play</button>
    </div>
  );
};

export default HomeHeader;