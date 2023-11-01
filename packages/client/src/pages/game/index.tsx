import React, { useEffect, useRef, useState, useMemo } from "react";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue } from '@latticexyz/recs';
import { decodeEntity } from "@latticexyz/store-sync/recs";
import { LimitSpace, MapConfig } from "@/config";
import { loadMapData } from "@/utils";
import Map from "@/components/Map";
import UserAvatar from "@/components/UserAvatar";
import { useLocation } from "react-router-dom";
import { message } from 'antd';
import "./styles.scss";
import Rank from "@/components/Rank";
import { CurIdMockData, PlayersMockData, RankMockData, TreasureChestMockData } from "@/mock/data";
import { IPlayer } from "@/components/Player";
import { useMUD } from "@/mud/MUDContext";
import Battle from "@/components/Battle";
import GameContext from '@/context';
import useModal from '@/hooks/useModal';
import TreasureChest from '@/components/TreasureChest';
import UserInfoDialog from '@/components/UserInfoDialog';
import { DELIVERY } from '@/config/map';
import { getPlayersCache, updatePlayerPosition } from '@/utils/player';
import { triggerVertexUpdate } from '@/utils/map';
import { bfs, simplifyMapData } from '@/utils/map';
import useMerkel from '@/hooks/useMerkel';
import { ethers } from 'ethers';

let boxId = ''

const toObject = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

const Game = () => {
  const {
    components: { Player, GameConfig, BattleList, BoxList, GlobalConfig, LootList1, LootList2 },
    systemCalls: { move, openBox, revealBox, getCollections, battleInvitation },
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
  const [userInfoPlayer, setUserInfoPlayer] = useState<IPlayer>();

  const [startBattleData, setStartBattleData] = useState(false);
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [balance, setBalance] = useState(0);

  const { account } = network;
  const curId = account;

  const { Modal, open, close, setContent } = useModal();

  const mapDataRef = useRef([]);
  const moveInterval = useRef<NodeJS.Timeout>();
  const location = useLocation();

  const {
    username = "",
    clothes,
    handheld,
    head,
  } = location.state ?? {};

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
  }).filter(e => e.state != 1);


  const [renderPlayers, setRenderPlayers] = useState([]);
  const playersCache = getPlayersCache(players);

  useEffect(() => {
    console.log(players, 'players');
    players.forEach((player) => {
      const index = renderPlayers.findIndex((rPlayer) => rPlayer.addr === player.addr);
      if (index === -1) {
        // add
        setRenderPlayers([...renderPlayers, { ...player }]);
      } else {
        Object.assign(renderPlayers[index], player);
        setRenderPlayers([...renderPlayers]);
      }
    });
  }, [playersCache])

  const curPlayer = renderPlayers.find(player => player.addr.toLocaleLowerCase() == account.toLocaleLowerCase());
  if (curPlayer && curPlayer.addr) {
    localStorage.setItem('curPlayer', JSON.stringify(toObject(curPlayer)))
    localStorage.setItem('worldContractAddress', network.worldContract.address)
  }
  const battles = useEntityQuery([Has(BattleList)]).map((entity) => {
    const id = decodeEntity({ battleId: "uint256" }, entity);
    const battle:any = getComponentValue(BattleList, entity)
    battle.id = id.battleId.toString()
    return battle;
  });

  if (battles.length && !startBattleData) {
    const battle:any = battles.filter((item:any) => (item.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() || item.defender.toLocaleLowerCase() == account.toLocaleLowerCase()) && !item.isEnd)[0]
    if (battle) {
      const targetAddr = battle.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() ? battle.defender : battle.attacker 
      const target = players.filter((item:any) => item.addr.toLocaleLowerCase() == targetAddr.toLocaleLowerCase())[0]
      if (!battleCurPlayer) {
        setBattleCurPlayer(curPlayer)
      }
      if (!targetPlayer) {
        setTargetPlayer(target)
      }
      setStartBattleData(true);
    }
  }
  
  const getCollectionsFun = (box: any) => {
    boxId = ''
    setContent(
      <div className={'mi-modal-content-wrapper'}>
        <div className="mi-modal-content">
          Congrats,you got {box.oreBalance} gems!

          <div className="mi-treasure-chest-wrapper">
            <TreasureChest/>
          </div>
        </div>
        <div className="mi-modal-footer">
          <button className="mi-btn" onClick={async () => {
            await getCollections(box.id, box.oreBalance, box.treasureBalance);
            boxId = ''
            close();
          }}>OK</button>
        </div>
      </div>
    );
    open();
  }
  
  const boxs = useEntityQuery([Has(BoxList)]).map((entity) => {
    const id = decodeEntity({ boxId: "uint256" }, entity);
    const box:any = getComponentValue(BoxList, entity)
    box.id = id.boxId.toString()
    return box;
  }).filter(e => e.opened == false || (e.opened && (e.oreBalance || e.treasureBalance)));;

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
    getBalance()
  }, []);

  useEffect(() => {
    if (boxId) {
      const box = boxs.find((item) => item.id === boxId);
      getCollectionsFun(box);
    }
  }, [boxs]);


  const finishBattle = (e: any) => {
    console.log(e);
    setStartBattleData(false);
    if (e.toLocaleLowerCase() == account.toLocaleLowerCase()) {
      console.log('win');
      message.success('You win the battle');
      setTargetPlayer(null);
    } else {
      console.log('lose');
      message.error('You lose the battle');
    }
  }

  const movePlayer = async (paths, merkelData) => {
    if (curPlayer.waiting) {
      return;
    }
    clearInterval(moveInterval.current);
    let pathIndex = 0;
    moveInterval.current = setInterval(() => {
      setVertexCoordinate(triggerVertexUpdate(paths[pathIndex], curPlayer, mapDataRef.current, vertexCoordinate));
      updatePlayerPosition(curPlayer, paths[pathIndex]);
      setRenderPlayers([...renderPlayers]);
      pathIndex++;
      if (pathIndex === paths.length) {
        clearInterval(moveInterval.current);
        const target = paths[pathIndex - 1];
        const isDelivery = DELIVERY.x === target.x && DELIVERY.y === target.y;
        if (isDelivery) {
          setUserInfoPlayer(curPlayer);
          submitGem();
        }
      }
    }, 300);
    curPlayer.waiting = true;
    const result = await move(merkelData);
    curPlayer.waiting = false;
    if (result?.type === 'error') {
      message.error(result.message);
    }

  };

  const showUserInfo = (player) => {
    setUserInfoPlayer(player);
    setUserInfoVisible(true);
  }

  const submitGem = () => {
    setUserInfoVisible(true);

    setTimeout(() => {
      if (curPlayer.gem > 0) {
        setContent(
          <div className={'mi-modal-content-wrapper'}>
            <div className="mi-modal-content">
              Congrats,you submitted {curPlayer.gem} gems!

              <div className="mi-treasure-chest-wrapper">
                <TreasureChest/>
              </div>
            </div>
            <div className="mi-modal-footer">
              <button className="mi-btn" onClick={() => {
                close();
                curPlayer.gem = 0;
              }}>OK</button>
            </div>
          </div>
        );
        open();
      }
    }, 1000);
  }

  const setStartBattle = async (player) => {
    console.log(player)
    const paths = bfs(simpleMapData, { x: curPlayer.x, y: curPlayer.y }, {x: player.x, y: player.y}).slice(1);
    await battleInvitation(player.addr, formatMovePath(paths));
    console.log(formatMovePath(paths))
    setTargetPlayer(player);
    setBattleCurPlayer(curPlayer)
    setStartBattleData(true);
  }

  const openTreasureChest = async (id) => {
    console.log(id);
    const boxIndex = boxs.findIndex(item => item.id === id);
    const box = boxs[boxIndex]
    if (box.opened) {
      if (box.owner.toLocaleLowerCase() != account.toLocaleLowerCase()) {
        message.error('The treasure chest has been opened by others');
        return
      } else {
        getCollectionsFun(box);
        return
      }
    } 
    boxs[boxIndex].opening = true;
    await openBox(id);
    const blockNumber = await network.publicClient.getBlockNumber()
    // 每隔1s获取一次getBlockNumber
    const interval = setInterval(async () => {
      const currentBlockNumber = await network.publicClient.getBlockNumber()
      console.log(currentBlockNumber, blockNumber, 'currentBlockNumber')
      if (currentBlockNumber - blockNumber >= 2) {
        clearInterval(interval)
        await revealBox(id)
        boxId = id
      }
    }, 1000)
  }

  const [renderPreviewPaths, setRenderPreviewPaths] = useState([]);
  const previewPath = (x, y) => {
    if (x === curPlayer?.x && y === curPlayer?.y) {
      return;
    }
    if (curPlayer) {
      const path = bfs(simpleMapData, curPlayer, { x, y }).slice(1);
      path.slice(0, Number(curPlayer.speed)).forEach(item => item.movable = true);
      setRenderPreviewPaths(path);
    }
  }

  return (
    <GameContext.Provider
      value={{
        curId,
        curAddr: curPlayer?.addr,
        players: renderPlayers,
        renderPreviewPaths,
        mapData: renderMapData,
        onPlayerMove: movePlayer,
        showUserInfo,
        treasureChest: boxs,
        openTreasureChest,
        setStartBattle,
        previewPath
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

        {/*<Rank data={RankMockData} curId={account} />*/}
        <Map
          width={MapConfig.visualWidth}
          height={MapConfig.visualHeight}
          vertexCoordinate={vertexCoordinate}
        />
        {
          startBattleData ? <Battle curPlayer={battleCurPlayer} targetPlayer={targetPlayer} finishBattle={finishBattle} /> : null
        }
        {
          userInfoVisible && (
            <UserInfoDialog
              visible={userInfoVisible}
              onClose={() => {
                setUserInfoVisible(false);
              }}
              gem={userInfoPlayer.gem}
              {...userInfoPlayer.equip}
            />
          )
        }

        <Modal />
      </div>
    </GameContext.Provider>
  );
};

export default Game;
