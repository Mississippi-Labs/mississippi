import React, { useEffect, useRef, useState } from "react";
import { useComponentValue } from "@latticexyz/react";
import { LimitSpace, MapConfig } from "@/config";
import { loadMapData } from "@/utils";
import Map from "@/components/Map";
import UserAvatar from "@/components/UserAvatar";
import { useLocation } from "react-router-dom";
import "./styles.scss";
import Rank from "@/components/Rank";
import { CurIdMockData, PlayersMockData, RankMockData, TreasureChestMockData } from "@/mock/data";
import { IPlayer } from "@/components/Player";
import { uploadUserMove } from "@/service/user";
import { useMUD } from "@/mud/MUDContext";
import { getComponentValue } from "@latticexyz/recs";
import Battle from "@/components/Battle";
import GameContext from '@/context';
import useModal from '@/hooks/useModal';
import TreasureChest from '@/components/TreasureChest';
import UserInfo from '@/components/UserInfo';
import UserInfoDialog from '@/components/UserInfoDialog';
import { DELIVERY } from '@/config/map';
import { updatePlayerPosition } from '@/utils/player';
import { triggerVertexUpdate } from '@/utils/map';

const Game = () => {
  const [renderMapData, setRenderMapData] = useState([]);
  const [vertexCoordinate, setVertexCoordinate] = useState({
    x: 0,
    y: 0,
  });

  const [players, setPlayers] = useState(PlayersMockData);
  const [curPlayerState, setCurPlayerState] = useState(null);
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [treasureChest, setTreasureChest] = useState(TreasureChestMockData);
  const curId = CurIdMockData;
  const curPlayer = players.find((item) => item.id === curId);

  // let curPlayer, targetPlayer

  const [startBattleData, setStartBattleData] = useState(false);
  const [userInfoVisible, setUserInfoVisible] = useState(false);

  const {
    components,
    systemCalls: { move, getPosition },
    network,
  } = useMUD();

  const { Modal, open, close, setContent } = useModal({
    title: '',
  });

  const mapDataRef = useRef([]);
  const location = useLocation();
  const {
    username = "",
    clothes,
    handheld,
    head,
  } = location.state ?? {};


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
      setPlayers([...players]);
      // getWinTreasureChest(targetPlayer.gem)
      setTargetPlayer(null);
    } else if (e == 2) {
      console.log('lose');
    }
  }

  const movePlayer = (paths, merkelData) => {
    let pathIndex = 0;
    const interval = setInterval(() => {
      setVertexCoordinate(triggerVertexUpdate(paths[pathIndex], curPlayer, mapDataRef.current, vertexCoordinate));
      updatePlayerPosition(curPlayer, paths[pathIndex]);
      pathIndex++;
      setPlayers([...players]);
      if (pathIndex === paths.length) {
        clearInterval(interval);
        const target = paths[pathIndex - 1];
        const isDelivery = DELIVERY.x === target.x && DELIVERY.y === target.y;
        if (isDelivery) {
          submitGem();
        }
      }
    }, 300);
    // move(merkelData);
  };

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

  const setStartBattle = ({x, y}) => {
    let targetPlayerData = players.find((item) => item.x === x && item.y === y);
    if (curPlayer && targetPlayerData) {
      setCurPlayerState(curPlayer);
      setTargetPlayer(targetPlayerData);
      setStartBattleData(true);
    }
  }

  const openTreasureChest = (id) => {
    const targetIndex = treasureChest.findIndex(item => item.id === id);
    treasureChest[targetIndex].opening = true;
    setTreasureChest([...treasureChest]);

    setTimeout(() => {
      curPlayer.gem += treasureChest[targetIndex].gem;
      setPlayers([...players]);
      setContent(
        <div className={'mi-modal-content-wrapper'}>
          <div className="mi-modal-content">
            Congrats,you got {treasureChest[targetIndex].gem} gems!

            <div className="mi-treasure-chest-wrapper">
              <TreasureChest/>
            </div>
          </div>
          <div className="mi-modal-footer">
            <button className="mi-btn" onClick={() => {
              treasureChest.splice(targetIndex, 1);
              setTreasureChest([...treasureChest]);
              close();
            }}>OK</button>
          </div>
        </div>
      );
      open();
    }, 3000);
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


  useEffect(() => {
    loadMapData().then((csv) => {
      setRenderMapData(csv);
      mapDataRef.current = csv;
    });

    curPlayer.equip = {
      clothes,
      handheld,
      head,
    }
    curPlayer.username = username;
    setPlayers([...players]);

  }, []);

  return (
    <GameContext.Provider
      value={{
        curId,
        players,
        mapData: renderMapData,
        onPlayerMove: movePlayer,
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

        <Rank data={RankMockData} curId={CurIdMockData} />
        <Map
          width={MapConfig.visualWidth}
          height={MapConfig.visualHeight}
          vertexCoordinate={vertexCoordinate}
        />
        {
          startBattleData ? <Battle curPlayer={curPlayerState} targetPlayer={targetPlayer} finishBattle={finishBattle} /> : null
        }
        <div className="opt-wrapper">
          <button className="mi-btn">Rank</button>
          <button className="mi-btn">Help</button>
          <button className="mi-btn" onClick={() => {
            setUserInfoVisible(true)
          }}>Info</button>
        </div>
        {
          userInfoVisible && (
            <UserInfoDialog
              visible={userInfoVisible}
              onClose={() => {
                setUserInfoVisible(false);
              }}
              gem={curPlayer.gem}
              {...curPlayer.equip}
            />
          )
        }

        <Modal />
      </div>
    </GameContext.Provider>
  );
};

export default Game;
