import React, { useEffect, useRef, useState, useMemo } from "react";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Has, HasValue, getComponentValue, ProxyRead } from '@latticexyz/recs';
import { decodeEntity, encodeEntity, singletonEntity } from "@latticexyz/store-sync/recs";
import { LimitSpace, MapConfig } from "@/config";
import { loadMapData } from "@/utils";
import Map from "@/components/Map";
import UserAvatar from "@/components/UserAvatar";
import Leaderboard from "@/components/Leaderboard";
import { useLocation, useNavigate } from "react-router-dom";
import { message, Modal } from 'antd';
import "./styles.scss";
import Rank from "@/components/Rank";
import { CurIdMockData, PlayersMockData, RankMockData, TreasureChestMockData } from "@/mock/data";
import { IPlayer } from "@/components/Player";
import { useMUD } from "@/mud/MUDContext";
import Battle from "@/components/Battle";
import GameContext from '@/context';
// import useModal from '@/hooks/useModal';
import TreasureChest from '@/components/TreasureChest';
import UserInfoDialog from '@/components/UserInfoDialog';
import { DELIVERY } from '@/config/map';
import { getPlayersCache, updatePlayerPosition } from '@/utils/player';
import { triggerVertexUpdate } from '@/utils/map';
import { bfs, simplifyMapData } from '@/utils/map';
import useMerkel from '@/hooks/useMerkel';
import { ethers } from 'ethers';
import lootAbi from '../../../../contracts/out/Loot.sol/MLoot.abi.json'
import userAbi from '../../../../contracts/out/User.sol/MUser.abi.json'
import PIXIAPP from '@/components/PIXIAPP';


const toObject = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

let userContract: any
let lootContract: any

let timeout = null

const Game = () => {
  const navigate = useNavigate();
  const {
    components: { Player, PlayerAddon, BattleList, BoxList, GlobalConfig, LootList1, LootList2, PlayerLocationLock, PlayerSeason, SyncProgress },
    systemCalls: { move, openBox, revealBox, getCollections, battleInvitation, unlockUserLocation, submitGem, goHome, joinBattlefield },
    network,
  } = useMUD();

  const [renderMapData, setRenderMapData] = useState([]);
  const [vertexCoordinate, setVertexCoordinate] = useState({
    x: 0,
    y: 0,
  });

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

  const [percentage, setPercentage] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [gotBox, setGotBox] = useState(null);

  const { account } = network;
  const curId = account;

  // const { Modal, open, close, setContent } = useModal();

  const mapDataRef = useRef([]);
  const moveInterval = useRef<NodeJS.Timeout>();


  const GlobalConfigData = useEntityQuery([Has(GlobalConfig)]).map((entity) => getComponentValue(GlobalConfig, entity));
  // console.log(GlobalConfigData, 'GlobalConfigData')

  if (GlobalConfigData.length && GlobalConfigData[0].userContract) {
    let privateKey = network.privateKey
    let rpc = network.walletClient?.chain?.rpcUrls?.default?.http[0] || 'http://127.0.0.1:8545'
    let provider = new ethers.providers.JsonRpcProvider(rpc)
    let wallet = new ethers.Wallet(privateKey, provider)
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

  const LootList1Data = useEntityQuery([Has(LootList1)]).map((entity) => {
    const loot = getComponentValue(LootList1, entity);
    const address = decodeEntity({ addr: "address" }, entity)?.addr?.toLocaleLowerCase() || ''
    loot.addr = address
    return loot;
  })

  const players = useEntityQuery([Has(Player)]).map((entity) => {
    const address = decodeEntity({ addr: "address" }, entity)?.addr?.toLocaleLowerCase() || ''
    const player = getComponentValue(Player, entity);
    player.addr = address
    player.username = player.name;
    LootList1Data.forEach((item) => {
      if (item.addr.toLocaleLowerCase() === address.toLocaleLowerCase()) {
        let clothes = item.chest.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
        let handheld = item.weapon.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
        let head = item.head.replace(/"(.*?)"/, '').split(' of')[0].replace(/^\s+|\s+$/g,"")
        player.equip = {
          clothes,
          handheld,
          head,
        }
      }
    })
    return player;
  }).filter(e => e.state > 1);
  const PlayerSeasonData = useEntityQuery([Has(PlayerSeason)]).map((entity) => {
    const playerSeason = getComponentValue(PlayerSeason, entity);
    const address = decodeEntity({ addr: "address" }, entity)?.addr?.toLocaleLowerCase() || ''
    playerSeason.addr = address
    playerSeason.username = players.filter((item) => item.addr.toLocaleLowerCase() == address.toLocaleLowerCase())[0]?.name
    return playerSeason;
  }).sort((a, b) => {
    return b.oreBalance - a.oreBalance
  })

  const [renderPlayers, setRenderPlayers] = useState([]);
  const playersCache = getPlayersCache(players);
  useEffect(() => {
    let renderPlayersArr = [...renderPlayers];
    players.forEach((player) => {
      const index = renderPlayers.findIndex((rPlayer) => rPlayer.addr === player.addr);
      if (index === -1) {
        // add
        renderPlayersArr.push({ ...player });
      } else {
        // update
        renderPlayersArr[index] = Object.assign(renderPlayersArr[index], player);
      }
    });
    // remove players中不存在的
    renderPlayersArr = renderPlayersArr.filter((player) => {
      return players.findIndex((p) => p.addr === player.addr) !== -1;
    });
    setRenderPlayers(renderPlayersArr);
  }, [playersCache])

  const curPlayer = renderPlayers.find(player => player.addr.toLocaleLowerCase() == account.toLocaleLowerCase());
  if (curPlayer && curPlayer.addr) {
    localStorage.setItem('curPlayer', JSON.stringify(toObject(curPlayer)))
    localStorage.setItem('worldContractAddress', network.worldContract.address)
  } else {
    // 返回首页
  }
  const battles = useEntityQuery([Has(BattleList), HasValue(BattleList, {isEnd: false})]).map((entity) => {
    const id = decodeEntity({ battleId: "uint256" }, entity);
    const battle:any = getComponentValue(BattleList, entity)
    battle.id = id.battleId.toString()
    return battle;
  });
  const battle:any = battles.filter((item:any) => (item.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() || item.defender.toLocaleLowerCase() == account.toLocaleLowerCase()) && !item.isEnd)[0]
  if (battle && !startBattleData && percentage == 100) {
      const targetAddr = battle.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() ? battle.defender : battle.attacker 
      const target = players.filter((item:any) => item.addr.toLocaleLowerCase() == targetAddr.toLocaleLowerCase())[0]
      const cur = players.find(player => player.addr.toLocaleLowerCase() == account.toLocaleLowerCase());
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
  
  const getCollectionsFun = (box: any) => {
    setGotBox(box);
    setModalType('getCollections');
    setModalVisible(true);
  }
  
  const boxs = useEntityQuery([Has(BoxList)]).map((entity) => {
    const id = decodeEntity({ boxId: "uint256" }, entity);
    const box:any = getComponentValue(BoxList, entity)
    box.id = id.boxId.toString()
    return box;
  }).filter(e => e.opened == false || (e.opened && (e.oreBalance || e.treasureBalance)));

  const getBalance = async () => {
    const balance = await network.publicClient.getBalance({
      address: network.walletClient.account.address
    })
    // 转成eth
    const walletBalance = (+ethers.utils.formatEther(balance.toString())).toFixed(2)
    setBalance(walletBalance);  
  }

  const syncprogress = getComponentValue(SyncProgress, singletonEntity);

  useEffect(() => {
    if (percentage < 100) {
      // console.log(syncprogress, 'syncprogress')
      setPercentage(syncprogress?.percentage || 0);
    }
  }, [syncprogress])

  useEffect(() => {
    loadMapData().then((csv) => {
      setRenderMapData(csv);
      mapDataRef.current = csv;
    });
    getBalance()
  }, []);


  const finishBattle = (winner: any, attacker: any, defender: any) => {
    setStartBattleData(false);
    setBattleId(null);
    if (winner && attacker && defender) {
      let loser = winner.toLocaleLowerCase() == attacker.toLocaleLowerCase() ? defender : attacker
      let loserData = getComponentValue(Player, encodeEntity({ addr: "address" }, { addr: loser}))
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
        let cur = getComponentValue(Player, network.playerEntity);
        if (cur?.state == 1 || cur?.state == 0) {
          message.error('You lose the battle');
          navigate('/');
          return
        } else {
          // 逃跑成功
          message.info('You escaped the battle');
        }
      }
    } else {
      let cur = getComponentValue(Player, network.playerEntity);
      if (cur?.state == 1 || cur?.state == 0) {
        navigate('/');
        return
      }
    }
    
  }

  const movePlayer = async (paths, merkelData) => {
    if (curPlayer.waiting) {
      message.error('Waiting for transaction');
      return;
    }
    let txFinished = false;
    curPlayer.waiting = true;
    let playerLock = getComponentValue(PlayerLocationLock, encodeEntity({ addr: "address" }, { addr: account}))
    console.log(playerLock, 'playerLock')
    if (playerLock && Number(playerLock.lockTime)) {
      message.error('You are locked');
      if (!timeout) {
        timeout = setTimeout(() => {
          unlockUserLocation();
          timeout = null
        }, 2000);
      }
      txFinished = true;
      curPlayer.waiting = false;
      return
    }
    clearInterval(moveInterval.current);
    let pathIndex = 0;
    const timeInterval = ~~(1500 / Number(curPlayer.speed))
    moveInterval.current = setInterval(async () => {
      setVertexCoordinate(triggerVertexUpdate(paths[pathIndex], curPlayer, mapDataRef.current, vertexCoordinate));
      updatePlayerPosition(curPlayer, paths[pathIndex]);
      setRenderPlayers([...renderPlayers]);
      pathIndex++;
      if (pathIndex === paths.length) {
        clearInterval(moveInterval.current);
        if (!txFinished) {
          curPlayer.waiting = true;
        }
        const target = paths[pathIndex - 1];
        const isDelivery = DELIVERY.x === target.x && DELIVERY.y === target.y;
        if (isDelivery) {
          let player = curPlayer
          let addon = getComponentValue(PlayerAddon, encodeEntity({addr: "address"}, {addr: player.addr}))
          let userTokenId = addon.userId.toString()
          let lootTokenId = addon.lootId.toString()
      
          let urls = await Promise.all([userContract.tokenURI(userTokenId), lootContract.tokenURI(lootTokenId)])
          let url = urls[0]
          let lootUrl = urls[1]
        
          url = atobUrl(url)
          lootUrl = atobUrl(lootUrl)

          player.userUrl = url.image
          player.lootUrl = lootUrl.image
          player.seasonOreBalance = PlayerSeasonData.filter((item) => item.addr.toLocaleLowerCase() == player.addr.toLocaleLowerCase())[0]?.oreBalance
          setUserInfoPlayer(player);
          submitGemFun();
        }
      }
    }, timeInterval);
    const result = await move(merkelData);
    txFinished = true;
    curPlayer.waiting = false;
    // if (renderPreviewPaths.length > 0) {
    //   const lastPreviewPath = renderPreviewPaths[renderPreviewPaths.length - 1];
      // previewPath(lastPreviewPath.x, lastPreviewPath.y);
    // }
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
    if (!player.userUrl || !player.lootUrl) {
      let addon = getComponentValue(PlayerAddon, encodeEntity({addr: "address"}, {addr: player.addr}))
      console.log(addon)
      let userTokenId = addon.userId.toString()
      let lootTokenId = addon.lootId.toString()
  
      let urls = await Promise.all([userContract.tokenURI(userTokenId), lootContract.tokenURI(lootTokenId)])
      let url = urls[0]
      let lootUrl = urls[1]
    
      url = atobUrl(url)
      lootUrl = atobUrl(lootUrl)

      player.userUrl = url.image
      player.lootUrl = lootUrl.image
    }

    player.seasonOreBalance = PlayerSeasonData.filter((item) => item.addr.toLocaleLowerCase() == player.addr.toLocaleLowerCase())[0]?.oreBalance
    
    setUserInfoPlayer(player);
    setUserInfoVisible(true);
  }

  const goHomeFun = async () => {
    if (!curPlayer.waiting) {
      try {
        curPlayer.waiting = true;
        await goHome();
        await joinBattlefield()
        curPlayer.waiting = false;
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('waiting')
      setTimeout(() => {
        goHomeFun();
      }, 500)
    }
  }

  const closeUserInfoDialog = () => {
    if (curPlayer.waiting) {
      message.error('Waiting for transaction');
      return;
    } else {
      setUserInfoVisible(false);
    }
  }

  const submitGemFun = async () => {
    setUserInfoVisible(true);
    try {
      goHomeFun();
      if (curPlayer.oreBalance > 0) {
        console.log('submitGem')
        setGotBox({oreBalance: curPlayer.oreBalance});
        await submitGem();
        console.log(curPlayer)
        setModalType('submitGem');
        setModalVisible(true);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const closeModal = async () => {
    if (modalType === 'getCollections') {
      await getCollections(gotBox.id, gotBox.oreBalance, gotBox.treasureBalance);
    } else if (modalType === 'submitGem') {
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
    const boxIndex = boxs.findIndex(item => item.id === id);
    const box = boxs[boxIndex]
    if (box.opened) {
      getCollectionsFun(box);
      return
    }
    setOpeningBox(boxs[boxIndex].id);
    await openBox(id);
    const blockNumber = await network.publicClient.getBlockNumber()
    // 每隔1s获取一次getBlockNumber
    const interval = setInterval(async () => {
      const currentBlockNumber = await network.publicClient.getBlockNumber()
      if (currentBlockNumber - blockNumber >= 2) {
        clearInterval(interval)
        let boxData = await revealBox(id)
        boxData.id = id
        setOpeningBox(null);
        getCollectionsFun(boxData);
      }
    }, 1000)
  }


  return (
    <GameContext.Provider
      value={{
        curId,
        curAddr: curPlayer?.addr,
        players,
        curPlayer,
        simpleMapData,
        mapData: renderMapData,
        onPlayerMove: movePlayer,
        openingBox,
        showUserInfo,
        treasureChest: boxs,
        openTreasureChest,
        setStartBattle,
      }}
    >
      <div className="mi-game" tabIndex={0}>
        <div className="mi-game-user-avatar">
          <UserAvatar
            username={curPlayer?.username}
            hp={curPlayer?.hp}
            maxHp={curPlayer?.maxHp}
            ap={50}
            maxAp={100}
            clothes={curPlayer?.equip?.clothes}
            handheld={curPlayer?.equip?.handheld}
            head={curPlayer?.equip?.head}
            address={account}
            balance={balance}
          />
        </div>

        {/*<Map*/}
        {/*  width={MapConfig.visualWidth}*/}
        {/*  height={MapConfig.visualHeight}*/}
        {/*  vertexCoordinate={vertexCoordinate}*/}
        {/*/>*/}
        <PIXIAPP
          chests={boxs}
        />
        {
          startBattleData ? <Battle curPlayer={battleCurPlayer} targetPlayer={targetPlayer} battleId={battleId} finishBattle={finishBattle} /> : null
        }
        <UserInfoDialog
          visible={userInfoVisible}
          onClose={closeUserInfoDialog}
          {...userInfoPlayer}
        />

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
                modalType === 'getCollections' ? <div className="mi-modal-title">Congrats,you got {gotBox?.oreBalance} gems!</div> : null
              }
              <div className="mi-treasure-chest-wrapper">
                <TreasureChest/>
              </div>
            </div>
            <div className="mi-modal-footer">
              <button className="mi-btn" onClick={closeModal}>OK</button>
            </div>
          </div>
        </Modal>
        <Leaderboard boxesCount={boxs.length}  leaderboard={PlayerSeasonData} />
      </div>
    </GameContext.Provider>
  );
};

export default Game;
