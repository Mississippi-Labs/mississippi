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
import { updatePlayerPosition } from '@/utils/player';
import { triggerVertexUpdate } from '@/utils/map';
import { bfs, simplifyMapData } from '@/utils/map';
import useMerkel from '@/hooks/useMerkel';

let boxId = ''

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
    return loot;
  })

  const LootList2Data = useEntityQuery([Has(LootList2)]).map((entity) => {
    const loot = getComponentValue(LootList2, entity);
    return loot;
  })

  console.log(LootList1Data, LootList2Data, 'LootList1Data')

  const players = useEntityQuery([Has(Player)]).map((entity) => {
    const address = decodeEntity({ addr: "address" }, entity)?.addr?.toLocaleLowerCase() || ''
    const player = getComponentValue(Player, entity);
    player.addr = address
    if (address.toLocaleLowerCase() === account.toLocaleLowerCase()) {
      player.equip = {
        clothes,
        handheld,
        head,
      }
      player.username = username;
    }
    return player;
  }).filter(e => e.state != 1);
  console.log(players, 'players')

  const curPlayer = players.find(player => player.addr.toLocaleLowerCase() == account.toLocaleLowerCase());
  const battles = useEntityQuery([Has(BattleList)]).map((entity) => {
    let id = decodeEntity({ battleId: "uint256" }, entity);
    let battle:any = getComponentValue(BattleList, entity)
    battle.id = id.battleId.toString()
    return battle;
  });

  if (battles.length && !startBattleData) {
    let battle:any = battles.filter((item:any) => (item.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() || item.defender.toLocaleLowerCase() == account.toLocaleLowerCase()) && !item.isEnd)[0]
    if (battle) {
      let targetAddr = battle.attacker.toLocaleLowerCase() == account.toLocaleLowerCase() ? battle.defender : battle.attacker 
      let target = players.filter((item:any) => item.addr.toLocaleLowerCase() == targetAddr.toLocaleLowerCase())[0]
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
    let id = decodeEntity({ boxId: "uint256" }, entity);
    let box:any = getComponentValue(BoxList, entity)
    box.id = id.boxId.toString()
    return box;
  });

  useEffect(() => {
    loadMapData().then((csv) => {
      setRenderMapData(csv);
      mapDataRef.current = csv;
    });
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

  const movePlayer = (paths, merkelData) => {
    clearInterval(moveInterval.current);
    let pathIndex = 0;
    moveInterval.current = setInterval(() => {
      setVertexCoordinate(triggerVertexUpdate(paths[pathIndex], curPlayer, mapDataRef.current, vertexCoordinate));
      updatePlayerPosition(curPlayer, paths[pathIndex]);
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
    move(merkelData);
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
    let box = boxs[boxIndex]
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
    let blockNumber = await network.publicClient.getBlockNumber()
    // 每隔1s获取一次getBlockNumber
    let interval = setInterval(async () => {
      let currentBlockNumber = await network.publicClient.getBlockNumber()
      console.log(currentBlockNumber, blockNumber, 'currentBlockNumber')
      if (currentBlockNumber - blockNumber >= 2) {
        clearInterval(interval)
        await revealBox(id)
        boxId = id
      }
    }, 1000)
  }

  return (
    <GameContext.Provider
      value={{
        curId,
        players,
        mapData: renderMapData,
        onPlayerMove: movePlayer,
        showUserInfo,
        treasureChest: boxs,
        openTreasureChest,
        setStartBattle
      }}
    >
      <div className="mi-game" tabIndex={0}>
        <div className="mi-game-user-avatar">
          <UserAvatar
            username={username}
            hp={100}
            maxHp={120}
            ap={50}
            maxAp={100}
            clothes={clothes}
            handheld={handheld}
            head={head}
          />
        </div>

        <Rank data={RankMockData} curId={account} />
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
