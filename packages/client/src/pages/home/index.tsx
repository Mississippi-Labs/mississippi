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
import { decodeEntity } from "@latticexyz/store-sync/recs";
import { ethers } from 'ethers';

import indexDuckImg from '@/assets/img/duck_index.png';

import lootAbi from '../../../../contracts/out/Loot.sol/MLoot.abi.json'
import userAbi from '../../../../contracts/out/User.sol/MUser.abi.json'
import pluginAbi from '../../../../contracts/out/Plugin.sol/MPlugin.abi.json'

let userContract: any
let lootContract: any
let pluginContract: any

let userTokenIds: any
let lootTokenIds: any

const Home = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    components: { GlobalConfig, Player },
    systemCalls: { selectBothNFT, joinBattlefield, setInfo, initUserInfo },
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
    getBalance()
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
  const [player, setPlayer] = useState<any>();

  const players = useEntityQuery([Has(Player)]).map((entity) => {
    const address = decodeEntity({ addr: "address" }, entity)?.addr?.toLocaleLowerCase() || ''
    const player = getComponentValue(Player, entity);
    player.addr = address
    return player;
  })

  const curPlayer = players.find(player => player.addr.toLocaleLowerCase() == network?.account.toLocaleLowerCase());

  const GlobalConfigData = useEntityQuery([Has(GlobalConfig)]).map((entity) => getComponentValue(GlobalConfig, entity));
  console.log(GlobalConfigData, 'GlobalConfigData')

  if (GlobalConfigData.length && GlobalConfigData[0].userContract) {
    let privateKey = network.privateKey
    let rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(privateKey, provider)
    let userContractAddress = GlobalConfigData[0].userContract
    userContract = new ethers.Contract(userContractAddress, userAbi, wallet)
    userContract?.getUserTokenIdList().then(res => {
      userTokenIds = res
    })
  }

  if (GlobalConfigData.length && GlobalConfigData[0].lootContract && !lootContract) {
    let privateKey = network.privateKey
    let rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(privateKey, provider)
    let lootContractAddress = GlobalConfigData[0].lootContract
    lootContract = new ethers.Contract(lootContractAddress, lootAbi, wallet)
    lootContract?.getUserTokenIdList().then(res => {
      lootTokenIds = res
    })
  }

  if (GlobalConfigData.length && GlobalConfigData[0].pluginContract && !pluginContract) {
    let privateKey = network.privateKey
    let rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(privateKey, provider)
    let pluginContractAddress = GlobalConfigData[0].pluginContract
    pluginContract = new ethers.Contract(pluginContractAddress, pluginAbi, wallet)
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
  }
  
  const toMint = async () => {
    if (!usernameRef.current.value) {
      message.error('Please input your username');
      return;
    }
    setUsername(usernameRef.current.value);
    close();
    setStep('mint');
  }

  const mint = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await pluginContract.multMint()
        await res.wait()
        let blockNumber = await network.publicClient.getBlockNumber()
        let interval = setInterval(async () => {
          let currentBlockNumber = await network.publicClient.getBlockNumber()
          if (currentBlockNumber - blockNumber >= 2) {
            clearInterval(interval)
            let tokenIds = await Promise.all([userContract.getUserTokenIdList(), lootContract.getUserTokenIdList()])
            userTokenIds = tokenIds[0]
            lootTokenIds = tokenIds[1]
            let revealres = await pluginContract.multRevealNFT(lootTokenIds[lootTokenIds.length - 1].toString(), userTokenIds[userTokenIds.length - 1].toString())
            await revealres.wait()
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

  const toObject = (obj) => {
    return JSON.parse(JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value
  ))
}

  const mintAndGo = async () => {
    setMinting(true);
    try {
      messageApi.open({
        type: 'loading',
        content: 'minting loot and user,please wait...',
        duration: 7,
      })
  
      if (!(userTokenIds.length && lootTokenIds.length)) {
        await mint()
      }
      let userTokenId = userTokenIds[userTokenIds.length - 1].toString()
      let lootTokenId = lootTokenIds[lootTokenIds.length - 1].toString()
  
  
      let urls = await Promise.all([userContract.tokenURI(userTokenId), lootContract.tokenURI(lootTokenId)])
      let url = urls[0]
      let lootUrl = urls[1]
      
      url = atobUrl(url)
      lootUrl = atobUrl(lootUrl)
      setUserUrl(url.image)
      setLootUrl(lootUrl.image)
      let { playerData, lootData } = await selectBothNFT(userTokenId, lootTokenId, network.account)
  
      let clothes = lootData.chest.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
      let handheld = lootData.weapon.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
      let head = lootData.head.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
      setPlayer(playerData)
      setClothes(clothes);
      setHandheld(handheld);
      setHead(head);

      let player = Object.assign(playerData, {username, clothes, handheld, head, userUrl: url.image, lootUrl: lootUrl.image})
      console.log(player, 'player')
      localStorage.setItem('playerInfo', JSON.stringify(toObject(player)));
      
      let result = await Promise.all([setInfo(username, ''), joinBattlefield()])
      console.log(result, 'result')
      setMinting(false);
      navigate('/game', {
        state: {
          username,
          clothes,
          handheld,
          head,
        }
      });
    } catch (error) {
      setMinting(false);
      console.log(error)
      message.error(error);
    }
  }

  const play = () => {
    if (!network.account) {
      message.error('waiting for wallet connection');
      return;
    }
    if (curPlayer && curPlayer.state != 1 && curPlayer.state != 0) {
      navigate('/game', {
        state: {
          username: '',
          clothes: '',
          handheld: '',
          head: '',
        }
      });
    } else {
      localStorage.removeItem('curPlayer');
      localStorage.removeItem('worldContractAddress');
      createWallet();
    }
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

  const initUserInfoFun = async () => {
    await initUserInfo()
    localStorage.removeItem('curPlayer');
    localStorage.removeItem('worldContractAddress');
    message.success('init success')
  }

  return (
    <div className="mi-home-page">
      {contextHolder}
      <Header
        onPlayBtnClick={play}
        walletAddress={walletAddress}
        walletBalance={walletBalance}
      />
      {
        step === 'play' && (
          <section className="mi-section index-section">
            <div className="section-box">
              <div className="intro-box">
                <h1 className={'intro-title'}>Welcome to Mississippi</h1>
                <p>
                  An ancient cave, cursed by its creator, opens intermittently as if alive <br/><br/>

                  The cavern is rich in energy gems that prudent adventurers can take, while those who miss the time to leave due to greed will be trapped in the cavern forever <br/><br/>

                  The Mississippi Company executives saw the value of the caves and decided to monopolize them <br/><br/>

                  Just when the plan was about to succeed, a group of crazy duck adventurers stormed into the cave...
                </p>
                <button className="play-btn mi-btn" onClick={play}>PLAY NOW</button>
                <button className="play-btn mi-btn" onClick={initUserInfoFun}>INIT USER</button>

              </div>
            </div>
            <img src={indexDuckImg} alt="duck" className={'duck-index'}/>

          </section>
        )
      }

      {
        step === 'mint' && (
          <div className="mi-section mint-section">
            <div className="mint-box">
              <h2 className="mint-title">HOME</h2>
              <UserInfo clothes={clothes} handheld={handheld} head={head} userUrl={userUrl} lootUrl={lootUrl} player={player} />
              <button className="mi-btn" onClick={mintAndGo} disabled={minting}>
                {minting ? 'Loading...' : 'MINT AND GO'}
              </button>
              {
                minting ? <div style={{textAlign: 'center', fontSize: '12px'}}>The minting process may take up to several tens of seconds</div> : null
              }
            </div>
          </div>
        )
      }
      <Modal />
    </div>
  );
};

export default Home;