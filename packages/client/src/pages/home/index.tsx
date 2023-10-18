import React, { useState } from 'react';
import Header from '@/pages/home/header';
import './styles.scss';
import useModal from '@/hooks/useModal';
import Loading from '@/components/Loading';
import MintList from '@/config/mint';

const Home = () => {

  const [hasInit, setHasInit] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [step, setStep] = useState('play');
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
    setStep('mint');
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
            <h2 className="mint-title">Mint Your Own Character</h2>
            <p className="mint-desc">
              You can select and combine elements from the left bar to create your own character. <br/>
              After generation of your character, initial attributes will be randomly generated
            </p>

            <div className="mint-wrapper">
              <div className="choose-unit-wrapper">
                {
                  MintList.map((item) => {
                    return (
                      <div className="mint-row" key={item.name}>

                      </div>
                    )
                  })
                }
              </div>

              <div className="preview-wrapper">
                <div className="preview-box">

                </div>

                <div className="init-name-wrapper">
                  <label htmlFor="username">Name You Character</label>
                  <input type="text" className="username" id="username"/>
                </div>

                <div className="opt-wrapper">
                  <button className="mi-btn">mint player</button>
                  <button className="mi-btn">mint and go</button>
                </div>

              </div>
            </div>
          </div>
        )
      }

      <Modal/>
    </div>
  );
};

export default Home;