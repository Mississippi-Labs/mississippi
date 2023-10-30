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
import { delay } from '@/utils';
import { useMUD } from '@/mud/MUDContext';
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue } from '@latticexyz/recs';
import { ethers } from 'ethers';
import { min } from 'rxjs';

import lootAbi from '../../../../contracts/out/Loot.sol/MLoot.abi.json'
import userAbi from '../../../../contracts/out/User.sol/MUser.abi.json'

console.log(lootAbi, 'lootAbi')

let userContract: any
let lootContract: any
const Home = () => {

  const {
    components: { GlobalConfig },
    systemCalls: { selectUserNft, joinBattlefield },
    network
  } = useMUD();

  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [step, setStep] = useState('play');
  const usernameRef = useRef<HTMLInputElement>();
  const { Modal, open, close, setContent } = useModal({
    title: '',
  });

  const [minting, setMinting] = useState(false);

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
  const [userUrl, setUserUrl] = useState<string>();
  const [lootUrl, setLootUrl] = useState<string>();

  const GlobalConfigData = useEntityQuery([Has(GlobalConfig)]).map((entity) => getComponentValue(GlobalConfig, entity));
  console.log(GlobalConfigData, 'GlobalConfigData')

  if (GlobalConfigData.length && GlobalConfigData[0].userContract) {
    let privateKey = network.privateKey
    let rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(privateKey, provider)
    console.log(wallet)
    let userContractAddress = GlobalConfigData[0].userContract
    userContract = new ethers.Contract(userContractAddress, userAbi, wallet)
  }

  if (GlobalConfigData.length && GlobalConfigData[0].lootContract && !lootContract) {
    let privateKey = network.privateKey
    let rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(privateKey, provider)
    let lootContractAddress = GlobalConfigData[0].lootContract
    lootContract = new ethers.Contract(lootContractAddress, lootAbi, wallet)
  }

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
  
  const toMint = async () => {
    if (!usernameRef.current.value) {
      message.error('Please input your username');
      return;
    }
    setUsername(usernameRef.current.value);
    await getBalance()
    close();
    setStep('mint');
  }

  const mintLoot = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let tx = await lootContract.mint()
        await tx.wait()
        console.log(tx, 'tx')
        message.success('Mint Loot Success');
        let tokenIds = await lootContract.getUserTokenIdList()
        let tokenId = tokenIds[tokenIds.length - 1].toString()
        // 获取当前getBlockNumber
        let blockNumber = await network.publicClient.getBlockNumber()
        // 每隔1s获取一次getBlockNumber
        let interval = setInterval(async () => {
          let currentBlockNumber = await network.publicClient.getBlockNumber()
          if (currentBlockNumber - blockNumber >= 2) {
            clearInterval(interval)
            let t = await lootContract.revealNFT(tokenId)
            await t.wait()
            message.success('reveal Loot Success');
            resolve('success')
          }
        }, 1000)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  const mintUser = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let tx = await userContract.mint()
        await tx.wait()
        console.log(tx, 'tx')
        message.success('Mint User Success');
        let tokenIds = await userContract.getUserTokenIdList()
        let tokenId = tokenIds[tokenIds.length - 1].toString()
        // 获取当前getBlockNumber
        let blockNumber = await network.publicClient.getBlockNumber()
        // 每隔1s获取一次getBlockNumber
        let interval = setInterval(async () => {
          let currentBlockNumber = await network.publicClient.getBlockNumber()
          if (currentBlockNumber - blockNumber >= 2) {
            clearInterval(interval)
            let t = await userContract.revealNFT(tokenId)
            await t.wait()
            console.log(t, 't')
            message.success('reveal User Success');
            resolve('success')
          }
        }, 1000)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  const atobUrl = (url) => {
    url = url.replace('data:application/json;base64,', '')
    url = atob(url)
    url = JSON.parse(url)
    return url
  }

  const mintAndGo = async () => {
    const clothes = Duck.Clothes[~~(Math.random() * Duck.Clothes.length)];
    const handheld = Duck.HandHeld[~~(Math.random() * Duck.HandHeld.length)];
    const head = Duck.Head[~~(Math.random() * Duck.Head.length)];

    setMinting(true);
    await mintUser();
    await mintLoot()

    let tokenIds = await userContract.getUserTokenIdList()
    let tokenId = tokenIds[tokenIds.length - 1].toString()
    let lootTokenIds = await lootContract.getUserTokenIdList()
    let lootTokenId = tokenIds[lootTokenIds.length - 1].toString()
    let url = await userContract.tokenURI(tokenId)
    let lootUrl = await lootContract.tokenURI(lootTokenId)
    
    url = atobUrl(url)
    lootUrl = atobUrl(lootUrl)
    setUserUrl(url.image)
    setLootUrl(lootUrl.image)

    await selectUserNft(tokenId)
    await joinBattlefield()

    delay(100).then(() => {
      setClothes(clothes);
      setHandheld(handheld);
      setHead(head);
    }).delay(3000).then(() => {
      navigate('/game', {
        state: {
          username,
          clothes,
          handheld,
          head,
        }
      });
    })

    setMinting(false);

  }

  const play = () => {
    createWallet();
  }

  const getBalance = async () => {
    let balance = await network.publicClient.getBalance({
      address: network.walletClient.account.address
    })
    // 转成eth
    let walletBalance = (+ethers.utils.formatEther(balance.toString())).toFixed(2)
    setWalletAddress(network.walletClient.account.address);
    setWalletBalance(walletBalance);
    localStorage.setItem('mi_user_address', network.walletClient.account.address)
  }

  return (
    <div className="mi-home-page">
      <Header
        onPlayBtnClick={play}
        walletAddress={walletAddress}
        walletBalance={walletBalance}
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
              <UserInfo clothes={clothes} handheld={handheld} head={head} userUrl={userUrl} lootUrl={lootUrl} />
              <button className="mi-btn" onClick={mintAndGo} disabled={minting}>
                {minting ? 'Loading...' : 'MINT AND GO'}
              </button>
            </div>
          </div>
        )
      }

      <Modal/>
    </div>
  );
};

export default Home;