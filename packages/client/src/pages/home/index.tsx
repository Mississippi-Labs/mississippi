import React, { useState } from 'react';
import Header from '@/pages/home/header';
import './styles.scss';
import useModal from '@/hooks/useModal';
import Loading from '@/components/Loading';

const Home = () => {

  const [hasInit, setHasInit] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { Modal, open, close, setContent } = useModal({
    title: '',
  });

  const createWallet = () => {
    setContent(
      <div className="create-wallet-loading-wrapper">
        <Loading/>
        <div className="create-wallet-loading-content">
          Creating Wallet...
        </div>
      </div>
    );
    open();
    setTimeout(() => {
      setWalletAddress('0X1234567894519845184814');
      setContent(
        <div className="create-wallet-successful-wrapper">
          <div className="create-wallet-successful-content">
            You have successfully created a wallet, and we will send you xxx test tokens as  a gift.
            Start your journey in Mississippi!
          </div>
          <button className="mi-btn" onClick={toMint}>OK</button>
        </div>
      )
    }, 3000);
  }
  
  const toMint = () => {
    close();
  }

  const play = () => {
    if (hasInit) {
      return;
    }
    setHasInit(true);
    createWallet();
  }

  return (
    <div className="mi-home-page">
      <Header
        onPlayBtnClick={play}
        walletAddress={walletAddress}
      />
      <section className="mi-section">
        <button className="play-btn mi-btn" onClick={play}>PLAY NOW</button>
      </section>
      <Modal/>
    </div>
  );
};

export default Home;