import React, { useEffect, useRef, useState, useMemo } from "react";
import { loadMapData } from "@/utils";
import UserAvatar from "@/components/UserAvatar";
import Leaderboard from "@/components/Leaderboard";
import Meme from "@/components/Meme";
import { useNavigate } from "react-router-dom";
import { message, Modal } from 'antd';
import "./styles.scss";
import { IPlayer } from "@/components/Player";
import { useMUD } from "@/mud/MUDContext";
import Battle from "@/components/Battle";
import Log from "@/components/Log";
import GameContext from '@/context';
import UserInfoDialog from '@/components/UserInfoDialog';
import Talk from '@/components/Talk';
import Header from '../home/header'
import { bfs, simplifyMapData } from '@/utils/map';
import useMerkel from '@/hooks/useMerkel';
import { ethers } from 'ethers';
import lootAbi from '../../../../contracts/out/Loot.sol/MLoot.abi.json'
import userAbi from '../../../../contracts/out/User.sol/MUser.abi.json'
import PIXIAPP from '@/components/PIXIAPP';
import Loading from '@/components/Loading';
import {BLOCK_TIME} from '@/config/chain';
import discordImg from '@/assets/img/discord.png';
import { TALK_MAIN } from '@/config/talk';
import { getClient } from '../../utils/client';
import { getUserPublicProfileRequest } from '@web3mq/client';
import { delay } from '../../utils/delay'

const toObject = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

const groupId = `group:095d747d5e3f09842191d1d9cf98bdd54b23d289`

let userContract: any
let lootContract: any

let timeout = null

const Game = () => {
  const navigate = useNavigate();
  const {
    systemCalls: { move, openBox, revealBox, getCollections, battleInvitation, unlockUserLocation, submitGem, goHome, joinBattlefield },
    network,
  } = useMUD();

  const {tables, useStore, account} = network

  const [step, setStep] = useState(0);

  const [renderMapData, setRenderMapData] = useState([]);

  const simpleMapData = useMemo(() => {
    return simplifyMapData(renderMapData);
  }, [renderMapData]);

  const formatMovePath = useMerkel(simpleMapData);

  const [targetPlayer, setTargetPlayer] = useState(null);
  const [battleCurPlayer, setBattleCurPlayer] = useState(null);
  const [battleId, setBattleId] = useState(null);
  const [userInfoPlayer, setUserInfoPlayer] = useState<IPlayer>();

  const [startBattleData, setStartBattleData] = useState(false);
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [openingBox, setOpeningBox] = useState();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [gotBox, setGotBox] = useState(null);

  const curId = account;

  const mapDataRef = useRef([]);

  const playerList = useRef([])

  // getMUDTables();
  // mud bug, if syncProgress not 100, it will return a decimals less 1.
  // let percentage = 0
  const [percentage, setPercentage] = useState(0);


  const GlobalConfigData = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.GlobalConfig));
    return records.map((e:any) => e.value);
  });

  const privateKey = network.privateKey
  const rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
  const provider = new ethers.providers.JsonRpcProvider(rpc)
  const wallet = new ethers.Wallet(privateKey, provider)

  if (GlobalConfigData.length) {
    let userContractAddress = GlobalConfigData[0].userContract
    let lootContractAddress = GlobalConfigData[0].lootContract
    userContract = new ethers.Contract(userContractAddress, userAbi, wallet)
    lootContract = new ethers.Contract(lootContractAddress, lootAbi, wallet)
  }

  const LootList1Data = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.LootList1));
    return records.map((e:any) => Object.assign(e.value, {addr: e.key.addr}));
  });

  const PlayerParamsData = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.PlayerParams));
    return records.map((e:any) => Object.assign(e.value, {addr: e.key.addr}));
  });
  const PlayerSeasonData = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.PlayerSeason));
    return records.map((e:any) => {
      let item = Object.assign(e.value, {addr: e.key.addr})
      // 获取PlayerParamsData.name
      let PlayerParamsDataItem = PlayerParamsData.find((player: any) => player.addr.toLocaleLowerCase() == e.key.addr.toLocaleLowerCase()) || {}
      item.name = PlayerParamsDataItem.name
      return item
    }).sort((a, b) => b.oreBalance - a.oreBalance);
  });
  const PlayersData = useStore((state: any) => {
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
      Object.keys(playerItem).forEach((k) => {
        if (typeof playerItem[k] === 'bigint') {
          playerItem[k] = Number(playerItem[k])
        }
      });
      if (playerItem.lastBattleTime) {
        let now = Math.floor(new Date().getTime() / 1000)
        let lastBattleTime = playerItem.lastBattleTime
        let diff = now - lastBattleTime
        let diffHp = diff * (playerItem.maxHp / 1000)
        playerItem.hp = Math.floor(playerItem.hp + diffHp)
        if (playerItem.hp > playerItem.maxHp) {
          playerItem.hp = playerItem.maxHp
        }
        let localPlayer: any = localStorage.getItem('curPlayer') || null
        if (localPlayer) {
          localPlayer = JSON.parse(localPlayer)
          if (localPlayer.addr.toLocaleLowerCase() == e.key.addr.toLocaleLowerCase()) {
            playerItem.diffHp = Math.floor(playerItem.hp - localPlayer.hp)
          }
        }
      }
      playerItem.username = playerItem.name
      return playerItem
    })
  });

  playerList.current = PlayersData

  const curPlayer = PlayersData.find((player: any) => player.addr.toLocaleLowerCase() == account.toLocaleLowerCase());
  if (curPlayer && curPlayer.state == 0 && percentage == 100) {
    navigate('/');
  } else if (curPlayer && curPlayer.state == 1 && percentage == 100 && !userInfoVisible) {
    setUserInfoVisible(true);
  } else {
    if (percentage == 100 && curPlayer && curPlayer.addr) {
      curPlayer.seasonOreBalance = PlayerSeasonData.filter((item) => item.addr.toLocaleLowerCase() == curPlayer.addr.toLocaleLowerCase())[0]?.oreBalance
    }
  }
  if (curPlayer && curPlayer.addr) {
    localStorage.setItem('curPlayer', JSON.stringify(toObject(curPlayer)))
    localStorage.setItem('worldContractAddress', network.worldContract.address)
  } else {
    // 返回首页
    if (percentage == 100) {
      navigate('/');
    }
  }

  const BoxListData = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.BoxList));
    return records.map((e:any) => Object.assign(e.value, {id: e.key.boxId})).filter((e: any) => e.opened == false || (e.opened && (e.oreBalance || e.treasureBalance)));
  })

  const BattleList1Data = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.BattleList1));
    return records.map((e:any) => Object.assign(e.value, {id: e.key.battleId}));
  });

  const BattleListData = useStore((state: any) => {
    const records = Object.values(state.getRecords(tables.BattleList));
    return records.map((e:any) => {
      let battleItem = Object.assign(e.value, {id: e.key.battleId})
      // battleList
      let battle = BattleList1Data.find((e: any) => e.id == battleItem.id) || {}
      if (battle) {
        battleItem = Object.assign(battleItem, battle)
      }
      return battleItem
    });
  });

  const battle:any = BattleListData.filter((item:any) => (item.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() || item.defender.toLocaleLowerCase() == account.toLocaleLowerCase()) && !item.isEnd)[0]
  
  if (battle && !startBattleData && percentage == 100) {
    const targetAddr = battle.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() ? battle.defender : battle.attacker 
    const target = PlayersData.filter((item:any) => item.addr.toLocaleLowerCase() == targetAddr.toLocaleLowerCase())[0]
    const cur = PlayersData.find((player: any) => player.addr.toLocaleLowerCase() == account.toLocaleLowerCase());
    if (!battleCurPlayer) {
      setBattleCurPlayer(cur)
    }
    if (!targetPlayer) {
      setTargetPlayer(target)
    }
    if (!battleId) {
      setBattleId(battle.id)
    }
    setStartBattleData(true);
  }  
  const getCollectionsFun = async (box: any) => {
    setGotBox(box);
    setModalType('getCollections');
    let res = await getCollections(box.id, box.oreBalance, box.treasureBalance);
    setOpeningBox(null);
    if (res.type == 'success') {
      setModalVisible(true);
    }
  }

  const getBalance = async () => {
    const balance = await network.publicClient.getBalance({
      address: network.walletClient.account.address
    })
    // 转成eth
    const walletBalance = (+ethers.utils.formatEther(balance.toString())).toFixed(2)
    setBalance(walletBalance);  
  }

  useEffect(() => {
    loadMapData().then((csv) => {
      setRenderMapData(csv);
      mapDataRef.current = csv;
    });
    getBalance();
  }, []);

  useEffect(() => {
    const setP = async () => {
      await delay(400)
      setPercentage(100);
    }
    if (GlobalConfigData.length && percentage < 100) {
      setP()
    }
    
  }, [GlobalConfigData]);

  const [clientData, setClientData] = useState(null)


  const showMsg = async (msg) => {
    // console.log(msg)
    // const userData = await getUserPublicProfileRequest({
    //   did_type: 'web3mq',
    //   did_value: msg.from,
    //   timestamp: Date.now(),
    //   my_userid: '',
    // });
    // console.log(userData)
    
    let playerIndex = playerList.current.findIndex((item) => item.addr.toLocaleLowerCase() == network.account.toLocaleLowerCase())
    let player = playerList.current[playerIndex]
    // console.log(player, playerList.current)
    if (player) player.lastMsg = msg.content
    playerList.current[playerIndex] = player
  }

  const sendMsg = async (msg) => {
    // console.log(msg)
    await clientData.message.sendMessage(`E${msg + 1}`);
  }

  useEffect(() => {
    const getClientFun = async () => {
      try {
        let client = await getClient(network.privateKey, network.walletClient?.chain?.rpcUrls?.default?.http[0], curPlayer?.name)
        console.log(client)
        const handleEvent = async (event: any) => {
          if (event.type === 'channel.getList') {
            const { channelList = [], activeChannel } = client.channel;
            console.log(channelList, activeChannel)
            let channel = channelList.find((item: any) => item.chatid == groupId)
            if (!channelList || !channelList.length || !channel) {
              await client.channel.joinGroup(groupId);
            }
            client.channel.setActiveChannel(channel)
            setClientData(client)
          }
          if (event.type === 'message.getList') {
            console.log(client.message.messageList);
            
            let lastMsg = client.message.messageList[client.message.messageList.length - 1]
            showMsg(lastMsg)
            // let msg = await client.message.getMessageList({
            //   page: 1,
            //   size: 20,
            // }, groupId); 
            // console.log(msg)
          }
          if (event.type === 'message.delivered') {
            console.log(event)
          }
          if (event.type === 'message.send') {
            console.log(event)
            console.log(client.message.messageList);
          }
          
        }
        client.on('channel.getList', handleEvent)
        client.on('message.getList', handleEvent);
        client.on('message.delivered', handleEvent);
        client.on('message.send', handleEvent);
        let channelList = await client.channel.queryChannels({
          page: 1,
          size: 100
        })
        let msg = await client.message.getMessageList({
          page: 1,
          size: 1,
        }, groupId); 
      } catch (error) {
        console.log(error)
      }
    }
    getClientFun()
  }, []);

  const sendMessage = async (data) => {
    await client.message.sendMessage(data);
    console.log(client.message);
  }

  const finishBattle = (winner: any, attacker: any, defender: any) => {
    // return;
    setStartBattleData(false);
    setBattleId(null);
    setBattleCurPlayer(null);
    setTargetPlayer(null);
    if (winner && attacker && defender) {
      let loser = winner.toLocaleLowerCase() == attacker.toLocaleLowerCase() ? defender : attacker
      let loserData = useStore.getState().getValue(tables.Player, { addr: loser })
      if (winner.toLocaleLowerCase() == account.toLocaleLowerCase()) {
        console.log('win');
        if (loserData?.state == 1 || loserData?.state == 0) {
          message.success('You win the battle');
        } else {
          // 对方跑了
          message.info('Target has escaped,You are locked');
          timeout = setTimeout(() => {
            unlockUserLocation();
            timeout = null
          }, 23000);
        }
        setTargetPlayer(null);
      } else {
        console.log('lose');
        let cur = useStore.getState().getValue(tables.Player, { addr: account })
        if (cur?.state == 1 || cur?.state == 0) {
          message.error('You lose the battle');
          return
        } else {
          // 逃跑成功
          message.info('You escaped the battle');
        }
      }
    } else {
      let cur = useStore.getState().getValue(tables.Player, { addr: account })
      if (cur?.state == 1 || cur?.state == 0) {
        navigate('/');
        return
      }
    }
  }

  if (startBattleData && percentage == 100 && battle && battle.id != battleId) {
    console.log('battle', battle, battleId)
    finishBattle(null, null, null)
  }

  const onMoveToDelivery = async () => {
    console.log('onMoveToDelivery')
    submitGemFun();
  }

  const isMovablePlayer = (player) => {
    if (player.waiting) {
      message.error('Waiting for transaction');
      return false;
    }
    const playerLock = useStore.getState().getValue(tables.PlayerLocationLock, { addr: account })
    if (playerLock && Number(playerLock.lockTime)) {
      message.error('You are locked');
      if (!timeout) {
        timeout = setTimeout(() => {
          unlockUserLocation();
          timeout = null
        }, 2000);
      }
      curPlayer.waiting = false;
      return false;
    }
    return true;
  }

  const movePlayer = async (paths, cb) => {
    const merkelData = formatMovePath(paths.slice(1));
    const result = await move(merkelData);
    cb?.();
    if (result?.type === 'error') {
      message.error(result.message);
    }
  };

  const atobUrl = (url) => {
    url = url.replace('data:application/json;base64,', '')
    url = atob(url)
    url = JSON.parse(url)
    return url
  }

  const showUserInfo = async (player) => {
    // if (!player.userUrl || !player.lootUrl) {
    //   let addon = useStore.getState().getValue(tables.Addon, { userId: player.addr })
    //   let userTokenId = addon.userId.toString()
    //   let lootTokenId = addon.lootId.toString()
  
    //   let urls = await Promise.all([userContract.tokenURI(userTokenId), lootContract.tokenURI(lootTokenId)])
    //   let url = urls[0]
    //   let lootUrl = urls[1]
    
    //   url = atobUrl(url)
    //   lootUrl = atobUrl(lootUrl)

    //   player.userUrl = url.image
    //   player.lootUrl = lootUrl.image
    // }

    player.seasonOreBalance = PlayerSeasonData.filter((item) => item.addr.toLocaleLowerCase() == player.addr.toLocaleLowerCase())[0]?.oreBalance
    
    setUserInfoPlayer(player);
    setUserInfoVisible(true);
  }

  const goHomeFun = async () => {
    if (!curPlayer.waiting) {
      try {
        curPlayer.waiting = true;
        await goHome();
        if (curPlayer.oreBalance > 0) {
          console.log('submitGem')
          setGotBox({oreBalance: curPlayer.oreBalance});
          await submitGem();
          setModalType('submitGem');
          setModalVisible(true);
        }
        curPlayer.waiting = false;
      } catch (error) {
        console.log(error)
      }
    } else {
      setTimeout(() => {
        goHomeFun();
      }, 500)
    }
  }

  const closeUserInfoDialog = async () => {
    if (curPlayer.state != 1 && (curPlayer.x == 4 && curPlayer.y == 5) && !userInfoPlayer) return;
    if (curPlayer.waiting) {
      message.error('Waiting for transaction');
      return;
    } else {
      if (curPlayer?.state == 1) {
        message.loading('join battlefield')
        await joinBattlefield()
        message.destroy() 
      }
      setUserInfoVisible(false);
      setUserInfoPlayer(null);
    }
  }

  const submitGemFun = async () => {
    setUserInfoVisible(true);
    try {
      goHomeFun();
    } catch (error) {
      console.log(error)
    }
  }

  const closeModal = async () => {
    if (modalType === 'submitGem') {
      curPlayer.oreBalance = 0;
      curPlayer.seasonOreBalance = PlayerSeasonData.filter((item) => item.addr.toLocaleLowerCase() == curPlayer.addr.toLocaleLowerCase())[0]?.oreBalance
    }
    setModalVisible(false);
    setGotBox(null);
    setModalType('');
  }

  const setStartBattle = async (player) => {
    const paths = bfs(simpleMapData, { x: curPlayer.x, y: curPlayer.y }, {x: player.x, y: player.y}).slice(1);
    let res = await battleInvitation(player.addr, formatMovePath(paths));
    if (res) {
      // setTargetPlayer(player);
      // setBattleCurPlayer(curPlayer)
      // setStartBattleData(true);
    }
  }

  const openTreasureChest = async (id) => {
    const boxIndex = BoxListData.findIndex(item => item.id === id);
    const box = BoxListData[boxIndex]
    if (box.opened) {
      getCollectionsFun(box);
      return
    }
    setOpeningBox(id);
    await openBox(id);
    const blockNumber = await network.publicClient.getBlockNumber()
    // 每隔1s获取一次getBlockNumber
    const interval = setInterval(async () => {
      const currentBlockNumber = await network.publicClient.getBlockNumber()
      if (currentBlockNumber - blockNumber >= 2) {
        clearInterval(interval)
        let boxData = await revealBox(id)
        boxData.id = id
        getCollectionsFun(boxData);
      }
    }, 1000)
  }

  const [talked, setTalked] = useState(localStorage.getItem('talked') || 'false')
  const onNext = async () => {
    console.log(step, TALK_MAIN.length)
    if (step < TALK_MAIN.length - 1) {
      setStep(step + 1)
    } else {
      setTalked('true')
      localStorage.setItem('talked', 'true')
      return
    }
  }

  const onSkip = async () => {
    setTalked('true')
    localStorage.setItem('talked', 'true')
    return
  }

  const blockTime = BLOCK_TIME[network?.publicClient?.chain?.id]
  return (
    <GameContext.Provider
      value={{
        curId,
        curAddr: curPlayer?.addr,
        blockTime,
        players: PlayersData,
        curPlayer,
        simpleMapData,
        mapData: renderMapData,
        onPlayerMove: movePlayer,
        openingBox,
        showUserInfo,
        treasureChest: BoxListData,
        openTreasureChest,
        setStartBattle,
        isMovablePlayer,
        onMoveToDelivery,
        battles: BattleListData
      }}
    >
      <div className="mi-game" tabIndex={0}>
      <div className="mi-game-head">
        <div className="mi-game-user-avatar">
          <UserAvatar
            {...(curPlayer ?? {})}
            balance={balance}
            address={account}
          />
        </div>
        <Header onlyRight={true} />
      </div>
        {
          percentage < 100 ?
            <Loading percent={percentage}/>
            :
            <PIXIAPP/>
        }
        {
          (curPlayer && percentage == 100 && (talked == 'false')) ? <Talk onNext={onNext} onSkip={onSkip} text={TALK_MAIN[step].text} sample={TALK_MAIN[step].img} step={step + 1}  /> : null
        }
        <div className="discord">
          <a href="https://discord.gg/UkarGN9Fjn" target="_blank"><img src={discordImg} /></a>
        </div>
        <Log />
        {
          startBattleData ? <Battle curPlayer={battleCurPlayer} targetPlayer={targetPlayer} battleId={battleId} finishBattle={finishBattle} /> : null
        }
        {
          userInfoPlayer ? (
            <UserInfoDialog
              visible={userInfoVisible}
              onClose={closeUserInfoDialog}
              oneself={false}
              {...userInfoPlayer}
            />
          ) : (
            <UserInfoDialog
              visible={userInfoVisible}
              onClose={closeUserInfoDialog}
              oneself={true}
              {...curPlayer}
            />
          )
        }
        

        <Modal
          visible={modalVisible}
          className="mi-modal"
          footer={null}
          onCancel={() => setModalVisible(false)}
        >
          <div className={'mi-modal-content-wrapper'}>
            <div className="mi-modal-content">
              { 
                modalType === 'submitGem' ? <div className="mi-modal-title">Congrats,you submitted {gotBox?.oreBalance} gems!</div> : null
              }
              {
                modalType === 'getCollections' ? <div className="mi-modal-title">{gotBox?.oreBalance ? `Congrats,you got ${gotBox?.oreBalance} gems!` : `oops! It's an empty box`}</div> : null
              }
              <div className="mi-treasure-chest-wrapper">
                <div className="mi-treasure-chest"/>
              </div>
            </div>
            <div className="mi-modal-footer">
              <button className="mi-btn" onClick={closeModal}>OK</button>
            </div>
          </div>
        </Modal>
        {
          percentage === 100 && <Leaderboard boxesCount={BoxListData.length}  leaderboard={PlayerSeasonData} />
        }

        {
          clientData && <Meme sendMsg={sendMsg} />
        }

      </div>
    </GameContext.Provider>
  );
};

export default Game;
