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

const Game = () => {
  const [renderMapData, setRenderMapData] = useState([]);
  const [vertexCoordinate, setVertexCoordinate] = useState({
    x: 0,
    y: 0,
  });

  const [players, setPlayers] = useState(PlayersMockData);
  const [treasureChest, setTreasureChest] = useState(TreasureChestMockData);
  const curId = CurIdMockData;

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
    avatar = "snake",
    roomId = "000000",
  } = location.state ?? {};


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

  const openTreasureChest = (id) => {
    const targetIndex = treasureChest.findIndex(item => item.id === id);
    treasureChest[targetIndex].opening = true;
    setTreasureChest([...treasureChest]);

    setTimeout(() => {
      treasureChest.splice(targetIndex, 1);
      setTreasureChest([...treasureChest]);

      // const str = `Congrats,you got ${treasureChest[targetIndex].gem} gems!`
      setContent(
        <div className={'mi-modal-content-wrapper'}>
          <div className="mi-modal-content">
            Congrats,you got {treasureChest[targetIndex].gem} gems!
          </div>
          <div className="mi-modal-footer">
            <button className="mi-btn" onClick={close}>OK</button>
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

    // getPosition('0x35be872A3C94Bf581A9DA4c653CE734380b75B7D');
  }, []);

  return (
    <GameContext.Provider
      value={{
        curId,
        players,
        mapData: renderMapData,
        onPlayerMove: movePlayer,
        treasureChest,
        openTreasureChest
      }}
    >
      <div className="mi-game" tabIndex={0}>
        <div className="mi-game-user-avatar">
          <UserAvatar
            username={username}
            roomId={roomId}
            avatar={avatar}
            hp={100}
            maxHp={120}
            ap={50}
            maxAp={100}
          />
        </div>

        <Rank data={RankMockData} curId={CurIdMockData} />
        <Map
          width={MapConfig.visualWidth}
          height={MapConfig.visualHeight}
          vertexCoordinate={vertexCoordinate}
        />
        {/*<Battle />*/}
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
