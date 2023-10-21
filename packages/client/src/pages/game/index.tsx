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

const Game = () => {
  const [renderMapData, setRenderMapData] = useState([]);
  const [vertexCoordinate, setVertexCoordinate] = useState({
    x: 0,
    y: 0,
  });

  const [players, setPlayers] = useState(PlayersMockData);
  const [curPlayer, setCurPlayer] = useState(null);
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [treasureChest, setTreasureChest] = useState(TreasureChestMockData);
  const curId = CurIdMockData;

  // let curPlayer, targetPlayer

  const [startBattleData, setStartBattleData] = useState(false);

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
      const curPlayer = players.find((item) => item.id === curId);
      curPlayer.gem += targetPlayer.gem;
      setPlayers([...players]);
      setContent(
        <div className={'mi-modal-content-wrapper'}>
          <div className="mi-modal-content">
            Congrats,you got {targetPlayer.gem} gems!

            <div className="mi-treasure-chest-wrapper">
              <TreasureChest
                opening={false}
              />
            </div>
          </div>
          <div className="mi-modal-footer">
            <button className="mi-btn" onClick={() => {
              setTargetPlayer(null);
              close();
            }}>OK</button>
          </div>
        </div>
      );
      open();
    } else if (e == 2) {
      console.log('lose');
    }
  }

  const movePlayer = (paths, merkelData) => {
    let pathIndex = 0;
    const curPlayerIndex = players.findIndex(
      (item) => item.id === curId
    );
    const interval = setInterval(() => {
      triggerVertexUpdate(paths[pathIndex], players[curPlayerIndex]);
      Object.assign(players[curPlayerIndex], paths[pathIndex]);
      pathIndex++;
      setPlayers([...players]);
      if (pathIndex === paths.length) {
        clearInterval(interval);
      }
    }, 300);
    // move(merkelData);
  };

  const setStartBattle = ({x, y}) => {
    let curPlayerData = players.find((item) => item.id === curId);
    let targetPlayerData = players.find((item) => item.x === x && item.y === y);
    if (curPlayerData && targetPlayerData) {
      setCurPlayer(curPlayerData);
      setTargetPlayer(targetPlayerData);
      setStartBattleData(true);
    }
  }

  const openTreasureChest = (id) => {
    const targetIndex = treasureChest.findIndex(item => item.id === id);
    treasureChest[targetIndex].opening = true;
    setTreasureChest([...treasureChest]);

    setTimeout(() => {
      const curPlayer = players.find((item) => item.id === curId);
      curPlayer.gem += treasureChest[targetIndex].gem;
      setPlayers([...players]);
      setContent(
        <div className={'mi-modal-content-wrapper'}>
          <div className="mi-modal-content">
            Congrats,you got {treasureChest[targetIndex].gem} gems!

            <div className="mi-treasure-chest-wrapper">
              <TreasureChest
                {...treasureChest[targetIndex]}
                opening={false}
              />
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

  const triggerVertexUpdate = (cur, before) => {
    const xDegree = cur.x - before.x;
    const yDegree = cur.y - before.y;
    const mapData = mapDataRef.current;
    if (xDegree === 1) {
      const limitExceeded = cur.x - vertexCoordinate.x > LimitSpace.x;
      const lessBoundary =
        vertexCoordinate.x + MapConfig.visualWidth < mapData[0].length - 1;
      if (limitExceeded && lessBoundary) {
        vertexCoordinate.x++;
      }
    } else if (xDegree === -1) {
      const limitExceeded = cur.x - vertexCoordinate.x < LimitSpace.x;
      const lessBoundary = vertexCoordinate.x > 0;
      if (limitExceeded && lessBoundary) {
        vertexCoordinate.x--;
      }
    } else if (yDegree === 1) {
      const limitExceeded = cur.y - vertexCoordinate.y > LimitSpace.y;
      const lessBoundary =
        vertexCoordinate.y + MapConfig.visualHeight < mapData.length - 1;
      if (limitExceeded && lessBoundary) {
        vertexCoordinate.y++;
      }
    } else if (yDegree === -1) {
      const limitExceeded = cur.y - vertexCoordinate.y < LimitSpace.y;
      const lessBoundary = vertexCoordinate.y > 0;
      if (limitExceeded && lessBoundary) {
        vertexCoordinate.y--;
      }
    }

    setVertexCoordinate({
      ...vertexCoordinate,
    });
  };

  useEffect(() => {
    loadMapData().then((csv) => {
      setRenderMapData(csv);
      mapDataRef.current = csv;
    });

    const curPlayerIndex = players.findIndex(
      (item) => item.id === curId
    );

    players[curPlayerIndex].equip = {
      clothes,
      handheld,
      head,
    }

    players[curPlayerIndex].username = username;

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

        <Rank data={RankMockData} curId={CurIdMockData} />
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
          <button className="mi-btn">Info</button>
        </div>
        <Modal />
      </div>
    </GameContext.Provider>
  );
};

export default Game;
