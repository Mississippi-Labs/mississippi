import React, { useEffect, useRef, useState } from 'react';
import Header from '@/pages/home/header';
import './styles.scss';
import useModal from '@/hooks/useModal';
import Loading from '@/components/Loading';
import MintList from '@/config/mint';
import { message } from 'antd';
import UserInfo from '@/components/UserInfo';
import { UserAddress } from '@/mock/data';
import { UserAddressKey } from '@/config';
import { useNavigate } from 'react-router-dom';
import Duck from '@/config/duck';

const Home = () => {

  const [walletAddress, setWalletAddress] = useState('');
  const [step, setStep] = useState('play');
  const usernameRef = useRef<HTMLInputElement>();
  const { Modal, open, close, setContent } = useModal({
    title: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    // const address = localStorage.getItem(UserAddressKey);
    // if (address) {
    //   setWalletAddress(address);
    // }
  }, []);

  const [clothes, setClothes] = useState<string>();
  const [handheld, setHandheld] = useState<string>();
  const [head, setHead] = useState<string>();
  const [username, setUsername] = useState<string>();


  const createWallet = () => {
    setContent(
      <div className="create-wallet-wrapper">
        <div className="create-wallet-content">
          You have successfully created a wallet.Name your character and start your journey!
        </div>
        <div className="mint-name">
          <input type="text" className="mi-input" ref={usernameRef} />
          <button className="mi-btn" onClick={toMint}>OK</button>
        </div>
      </div>
    );
    open();
    // setTimeout(() => {
    //   setWalletAddress('0X1234567894519845184814');
    //   setContent(
    //     <div className="create-wallet-successful-wrapper">
    //       <div className="create-wallet-successful-content">
    //         You have successfully created a wallet, and we will send you xxx test tokens as  a gift.
    //         Start your journey in Mississippi!
    //       </div>
    //       <button className="mi-btn" onClick={toMint}>OK</button>
    //     </div>
    //   )
    // }, 3000);
  }
  
  const toMint = () => {
    if (!usernameRef.current.value) {
      message.error('Please input your username');
      return;
    }
    setUsername(usernameRef.current.value);
    setWalletAddress(UserAddress);
    localStorage.setItem('mi_user_address', UserAddress)
    close();
    setStep('mint');
  }

  const mintAndGo = () => {
    const clothes = Duck.Clothes[~~(Math.random() * Duck.Clothes.length)];
    const handheld = Duck.HandHeld[~~(Math.random() * Duck.HandHeld.length)];
    const head = Duck.Head[~~(Math.random() * Duck.Head.length)];
    setClothes(clothes);
    setHandheld(handheld);
    setHead(head);

    setTimeout(() => {
      navigate('/game', {
        state: {
          username,
          clothes,
          handheld,
          head,
        }
      });
    }, 3000)
  }

  const play = () => {
    // if (walletAddress) {
    //   setContent(
    //     <div className="create-wallet-wrapper">
    //       <div className="create-wallet-content">
    //         You have successfully created a wallet.Name your character and start your journey!
    //       </div>
    //       <div className="mint-name">
    //         <input type="text" className="mi-input" ref={usernameRef} />
    //         <button className="mi-btn" onClick={toMint}>OK</button>
    //       </div>
    //     </div>
    //   );
    //   open();
    //   return;
    // }
    createWallet();
  }

  return (
    <div className="mi-home-page">
      <Header
        onPlayBtnClick={play}
        walletAddress={walletAddress}
      />
      {
        step === 'play' && (
          <section className="mi-section">
            <button className="play-btn mi-btn" onClick={play}>PLAY NOW</button>
          </section>
        )
      }

      {
        step === 'mint' && (
          <div className="mi-section mint-section">
            <div className="mint-box">
              <h2 className="mint-title">HOME</h2>
              <UserInfo clothes={clothes} handheld={handheld} head={head}/>
              <button className="mi-btn" onClick={mintAndGo}>MINT AND GO</button>
            </div>
          </div>
        )
      }

      <Modal/>
    </div>
  );
};

export default Home;