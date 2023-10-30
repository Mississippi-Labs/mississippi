import React, { useEffect, useRef, useState, useMemo } from "react";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue } from '@latticexyz/recs';
import { decodeEntity } from "@latticexyz/store-sync/recs";
import { LimitSpace, MapConfig } from "@/config";
import { loadMapData } from "@/utils";
import Map from "@/components/Map";
import UserAvatar from "@/components/UserAvatar";
import { useLocation } from "react-router-dom";
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
    components: { Player, GameConfig, BattleList, BoxList, GlobalConfig },
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
  });

  const curPlayer = players.find(player => player.addr.toLocaleLowerCase() == account.toLocaleLowerCase());

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

  const treasureChest = boxs.filter((item) => !item.opened);

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
    if (e == 1) {
      console.log('win');
      let treasureChestData = treasureChest
      console.log(treasureChestData, treasureChestData[treasureChestData.length - 1]);
      let item = {
        id: treasureChestData.length ? treasureChestData[treasureChestData.length - 1].id + 1 : 1,
        x: targetPlayer.x,
        y: targetPlayer.y,
        gem: targetPlayer.gem
      }
      treasureChestData.push(item)
      let targetPlayerIndex = players.findIndex((item) => item.x === targetPlayer.x && item.y === targetPlayer.y);
      players.splice(targetPlayerIndex, 1);
      setTreasureChest([...treasureChestData]);
      // setPlayers([...players]);
      // getWinTreasureChest(targetPlayer.gem)
      setTargetPlayer(null);
    } else if (e == 2) {
      console.log('lose');
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
                setPlayers([...players]);
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
    setStartBattleData(true);
  }

  const openTreasureChest = async (id) => {
    console.log(id);
    const targetIndex = treasureChest.findIndex(item => item.id === id);
    treasureChest[targetIndex].opening = true;
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

  const getWinTreasureChest = (gem = 1) => {
    curPlayer.gem += gem;
    const targetPlayerData = players.find((item) => item.x === targetPlayer.x && item.y === targetPlayer.y);
    targetPlayerData.gem -= gem;
    setPlayers([...players]);
    setContent(
      <div className={'mi-modal-content-wrapper'}>
        <div className="mi-modal-content">
          Congrats,you got {gem} gems!

          <div className="mi-treasure-chest-wrapper">
            <TreasureChest/>
          </div>
        </div>
        <div className="mi-modal-footer">
          <button className="mi-btn" onClick={close}>OK</button>
        </div>
      </div>
    );
    open();
  }




  return (
    <GameContext.Provider
      value={{
        curId,
        players,
        mapData: renderMapData,
        onPlayerMove: movePlayer,
        showUserInfo,
        treasureChest,
        openTreasureChest,
        setStartBattle,
        getWinTreasureChest
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
          startBattleData ? <Battle curPlayer={curPlayer} targetPlayer={targetPlayer} finishBattle={finishBattle} /> : null
        }
        <div className="opt-wrapper">
          <button className="mi-btn">Rank</button>
          <button className="mi-btn">Help</button>
          <button className="mi-btn" onClick={() => {
            showUserInfo(curPlayer);
          }}>Info</button>
        </div>
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
