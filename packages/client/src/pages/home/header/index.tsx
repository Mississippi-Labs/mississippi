import React from 'react';
import Logo from '@/assets/img/logo.png';
import './styles.scss';
import imgTelegram from '@/assets/img/icon_t.png';
import imgTwitter from '@/assets/img/icon_tw.png';
import imgDiscord from '@/assets/img/icon_d.png';
import UserAddress from '@/components/UserAddress';

interface IProps {
  onPlayBtnClick: () => void;
  walletAddress: string;
  walletBalance: string;
}

const HomeHeader = (props: IProps) => {
  return (
    <div className="home-header">
      <a href="/">
      <img src={Logo} alt="MISSISSIPPI" className="header-logo"/>
      </a>
      
      <nav className="header-nav">
        <ul className="menu-lv1">
          {/* <li><a href="">Leaderboard</a></li> */}
          <li><a href="https://mississippi.gitbook.io/mississippi/" target='_blank'>Docs</a></li>
          <li className="menu-socials">
            <a href="">Socials</a>
            <ul className="menu-lv2">
              <li>
                <a href="https://twitter.com/0xMississippi" target="_blank" rel="noreferrer">Twitter</a>
                <img src={imgTwitter} alt=""/>
              </li>
              <li>
                <a href="https://discord.gg/rg9V8J49" target="_blank" title="coming soon">Discord</a>
                <img src={imgDiscord} alt=""/>
              </li>
              
            </ul>
          </li>
        </ul>
      </nav>

      {
        props.walletAddress ?
          <UserAddress address={props.walletAddress} account={props.walletBalance + 'ETH'}/>
          :
          <button className="play-btn mi-btn" onClick={props.onPlayBtnClick}>PLAY NOW</button>
      }
    </div>
  );
};

export default HomeHeader;