import React, { useEffect, useRef, useState } from 'react';
import Header from '@/pages/home/header';
import './styles.scss';
import { message, Modal } from 'antd';
import UserInfo from '@/components/UserInfo';
import { useNavigate } from 'react-router-dom';
import { useMUD } from '@/mud/MUDContext';
import { ethers } from 'ethers';

import indexDuckImg from '@/assets/img/duck_index.svg';

import lootAbi from '../../../../contracts/out/Loot.sol/MLoot.abi.json'
import userAbi from '../../../../contracts/out/User.sol/MUser.abi.json'
import pluginAbi from '../../../../contracts/out/Plugin.sol/MPlugin.abi.json'
import StaticInfo from '@/pages/home/StaticInfo';

let userContract: any
let lootContract: any
let pluginContract: any

let userTokenIds: any
let lootTokenIds: any

const Home = () => {
  const {
    systemCalls: { selectBothNFT, joinBattlefield, setInfo },
    network,
  } = useMUD();

  const { tables, useStore } = network;

  const [step, setStep] = useState('play');
  const usernameRef = useRef<HTMLInputElement>();
  const [modalVisible, setModalVisible] = useState(false);

  const [minting, setMinting] = useState(false);

  const navigate = useNavigate();

  const [clothes, setClothes] = useState<string>();
  const [handheld, setHandheld] = useState<string>();
  const [head, setHead] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [userUrl, setUserUrl] = useState<string>();
  const [lootUrl, setLootUrl] = useState<string>();
  const [player, setPlayer] = useState<any>();

  // getMUDData
  const GameConfigData = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.GameConfig));
    return records.map((e:any) => e.value);
  });
  const GlobalConfigData = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.GlobalConfig));
    return records.map((e:any) => e.value);
  });
  const LootList1Data = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.LootList1));
    return records.map((e:any) => Object.assign(e.value, {addr: e.key.addr}));
  });

  const PlayerParamsData = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.PlayerParams));
    return records.map((e:any) => Object.assign(e.value, {addr: e.key.addr}));
  });
  const PlayerData = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.Player));
    return records.map((e:any) => {
      let playerItem = Object.assign(e.value, {addr: e.key.addr})
      //LootList1Data
      let loot = LootList1Data.find((loot: any) => loot.addr == e.key.addr) || {}
      let clothes = loot?.chest?.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
      let handheld = loot?.weapon?.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
      let head = loot?.head?.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
      playerItem.equip = {
        clothes,
        handheld,
        head,
      }
      // PlayerParamsData
      let playerParams = PlayerParamsData.find((player: any) => player.addr == e.key.addr) || {}
      playerItem = Object.assign(playerItem, playerParams)
      return playerItem
    })
  });

  const PlayerAddonData = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.PlayerAddon));
    return records.map((e:any) => Object.assign(e.value, {addr: e.key.addr}));
  });

  const curPlayer = PlayerData.find((player: any) => player.addr.toLocaleLowerCase() == network?.account.toLocaleLowerCase());

  const privateKey = network.privateKey
  const rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
  const provider = new ethers.providers.JsonRpcProvider(rpc)
  const wallet = new ethers.Wallet(privateKey, provider)

  if (GlobalConfigData.length) {
    let userContractAddress = GlobalConfigData[0].userContract
    let lootContractAddress = GlobalConfigData[0].lootContract
    let pluginContractAddress = GlobalConfigData[0].pluginContract
    userContract = new ethers.Contract(userContractAddress, userAbi, wallet)
    lootContract = new ethers.Contract(lootContractAddress, lootAbi, wallet)
    pluginContract = new ethers.Contract(pluginContractAddress, pluginAbi, wallet)
    userContract?.getUserTokenIdList().then((res:any) => {
      userTokenIds = res
    })
    lootContract?.getUserTokenIdList().then((res:any) => {
      lootTokenIds = res
    })
  }

  console.log(PlayerAddonData, GameConfigData, GlobalConfigData, LootList1Data, PlayerData, 'PlayerAddonData, GameConfigData, SyncProgressData, GlobalConfigData, LootList1Data, PlayerData')

  const syncprogress = {percentage: 100}
  // isOpen
  const [isOpen, setIsOpen] = useState(import.meta.env.VITE_IS_OPEN == 'true' ? true : false);

  useEffect(() => {
    // 获取参数
    const params = new URLSearchParams(window.location.search);
    const author = params.get("author")
    if (author) {
      setIsOpen(true)
    }
  }, [])

  const atobUrl = (url) => {
    url = url.replace('data:application/json;base64,', '')
    url = atob(url)
    url = JSON.parse(url)
    return url
  }


  useEffect(() => {
    console.log(curPlayer?.state, 'curPlayer')
    if (curPlayer?.state >= 1) {
      console.log(curPlayer.name, 'curPlayer')
      setUsername(curPlayer.name);
      setClothes(curPlayer?.equip?.clothes);
      setHandheld(curPlayer?.equip?.handheld);
      setHead(curPlayer?.equip?.head);
      setPlayer(curPlayer);
    }
    
    // const address = localStorage.getItem(UserAddressKey);
    // if (address) {
    //   setWalletAddress(address);
    // }
  }, [curPlayer?.name]);

  const createWallet = () => {
    setModalVisible(true);
  }
  const toMint = async () => {
    console.log(usernameRef.current.value, 'usernameRef.current.value')
    if (!usernameRef.current.value) {
      message.error('Please input your username');
      return;
    }
    setUsername(usernameRef.current.value);
    setModalVisible(false);
    mintAndGo('', usernameRef.current.value);
  }

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      toMint();
    }
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
            let revealres = await pluginContract.multRevealNFT(lootTokenIds[0].toString(), userTokenIds[0].toString())
            console.log(revealres, 'revealres')
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

  const toObject = (obj) => {
    return JSON.parse(JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value
  ))
}

  const mintAndGo = async (type, uName) => {
    if (syncprogress?.percentage != 100) {
      message.error('Waiting for sync...');
      return;
    }
    if (!username && !uName) {
      createWallet();
      return;
    }
    setMinting(true);
    try {
      if (!(userTokenIds?.length && lootTokenIds?.length) || (type == 'mint')) {
        message.loading('minting loot and user,please wait...')
        await mint()
        message.destroy()
      }
      if (curPlayer?.state >= 2) {
        navigate('/game');
        return;
      } else if (curPlayer?.state == 1) {
        message.loading('join battlefield')
        await joinBattlefield()
        message.destroy()
        navigate('/game');
        return
      }
      let userTokenId = userTokenIds[0].toString()
      let lootTokenId = lootTokenIds[0].toString()
  
      // let urls = await Promise.all([userContract.tokenURI(userTokenId), lootContract.tokenURI(lootTokenId)])
      // let url = urls[0]
      // let lootUrl = urls[1]
      // console.log("get loot and user success")
      // console.log(urls, 'url')
      // try {
      //   url = atobUrl(url)
      //   lootUrl = atobUrl(lootUrl)
      // } catch (error) {
      //   mintAndGo('mint')
      //   console.log(error)
      // }
      // setUserUrl(url.image)
      // setLootUrl(lootUrl.image)

      let { playerData, lootData } = await selectBothNFT(userTokenId, lootTokenId, network.account)

      let clothes = lootData.chest.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
      let handheld = lootData.weapon.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
      let head = lootData.head.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
      setPlayer(playerData)
      setClothes(clothes);
      setHandheld(handheld);
      setHead(head);

      playerData.equip = {
        clothes,
        handheld,
        head,
      }

      let player = Object.assign(playerData, {username: username || uName, clothes, handheld, head})
      console.log(player, 'player', username, uName)
      await Promise.all([setInfo(username || uName, ''), joinBattlefield()])
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

  const getProgress = () => {
    if (syncprogress?.percentage == 100) {
      return '100%'
    } else {
      if (syncprogress?.percentage) {
        return Math.floor(syncprogress?.percentage * 100) + '%'
      } else {
        return '0%'
      }
    }
  }

  const play = () => {
    if (!isOpen) {
      message.error(`Please wait for open demo day`);
      return;
    }
    if (!network.account) {
      message.error('waiting for wallet connection');
      return;
    }
    if (curPlayer?.state >= 1) {
      setStep('mint');
    } else {
      localStorage.removeItem('curPlayer');
      localStorage.removeItem('worldContractAddress');
      setStep('mint');
      // createWallet();
    }
  }

  return (
    <div className="mi-home-page">
      <Header
        onPlayBtnClick={play}
      />
      {
        step === 'play' && (
          <StaticInfo
            onPlay={play}
            isOpen={isOpen}
          />
          // <section className="mi-section index-section">
          //   <div className="section-box">
          //     <div className="intro-box">
          //       <h1 className={'intro-title'}>Welcome to Mississippi</h1>
          //       <p>
          //         An ancient cave, cursed by its creator, opens intermittently as if alive <br/><br/>
          //
          //         The cavern is rich in energy gems that prudent adventurers can take, while those who miss the time to leave due to greed will be trapped in the cavern forever <br/><br/>
          //
          //         The Mississippi Company executives saw the value of the caves and decided to monopolize them <br/><br/>
          //
          //         Just when the plan was about to succeed, a group of crazy duck adventurers stormed into the cave...
          //       </p>
          //       <button className="play-btn mi-btn" onClick={play}>{(!isOpen) ? 'Please wait for open demo day' : 'PLAY NOW'}</button>
          //
          //     </div>
          //   </div>
          //   <img src={indexDuckImg} alt="duck" className={'duck-index'}/>
          //
          // </section>
        )
      }

      {
        step === 'mint' && (
          <div className="mi-section mint-section">
            <div className="mint-box">
              <h2 className="mint-title">HOME</h2>
              <UserInfo clothes={clothes} handheld={handheld} head={head} userUrl={userUrl} lootUrl={lootUrl} player={player} />
              <button className="mi-btn" onClick={mintAndGo} disabled={minting}>
                {syncprogress?.percentage == 100 ? minting ? 'Loading...' : (userTokenIds?.length && lootTokenIds?.length) ? 'Join The Game' : 'MINT AND GO': `Waiting for sync... ${getProgress()}`}
              </button>
              {
                minting ? <div style={{textAlign: 'center', fontSize: '12px'}}>The minting process may take up to several tens of seconds</div> : null
              }
            </div>
          </div>
        )
      }
      <Modal
        open={modalVisible}
        className="mi-modal"
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <div className="create-wallet-wrapper">
          <div className="create-wallet-content">
            You have successfully created a wallet.Name your character and start your journey!
          </div>
          <div className="mint-name">
            <input type="text" className="mi-input" ref={usernameRef} onKeyUp={handleKeyUp} />
            <button className="mi-btn" onClick={toMint}>OK</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;