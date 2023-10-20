import React, { useRef, useState } from 'react';
import Header from '@/pages/home/header';
import './styles.scss';
import useModal from '@/hooks/useModal';
import Loading from '@/components/Loading';
import MintList from '@/config/mint';
import { message } from 'antd';
import UserInfo from '@/components/UserInfo';

const Home = () => {

  const [hasInit, setHasInit] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [step, setStep] = useState('mint');
  const usernameRef = useRef<HTMLInputElement>();
  const { Modal, open, close, setContent } = useModal({
    title: '',
  });

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
    console.log(usernameRef.current.value, 'username');
    setWalletAddress('0X1234567894519845184814');
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
            <div className="mint-box">
              <h2 className="mint-title">HOME</h2>
              <UserInfo/>
              <button className="mi-btn">mint and go</button>
            </div>

            {/*<div className="mint-wrapper">*/}
            {/*  <div className="choose-unit-wrapper">*/}
            {/*    {*/}
            {/*      MintList.map((item) => {*/}
            {/*        return (*/}
            {/*          <div className="mint-row" key={item.name}>*/}

            {/*          </div>*/}
            {/*        )*/}
            {/*      })*/}
            {/*    }*/}
            {/*  </div>*/}

            {/*  <div className="preview-wrapper">*/}
            {/*    <div className="preview-box">*/}

            {/*    </div>*/}

            {/*    <div className="init-name-wrapper">*/}
            {/*      <label htmlFor="username">Name You Character</label>*/}
            {/*      <input type="text" className="username" id="username"/>*/}
            {/*    </div>*/}

            {/*    <div className="opt-wrapper">*/}
            {/*      <button className="mi-btn">mint player</button>*/}
            {/*      */}
            {/*    </div>*/}

            {/*  </div>*/}
            {/*</div>*/}
          </div>
        )
      }

      <Modal/>
    </div>
  );
};

export default Home;