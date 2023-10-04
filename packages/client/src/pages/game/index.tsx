import React, { useEffect, useRef, useState } from 'react';
import { MapConfig } from '@/config';
import { loadMapData } from '@/utils';
import Map from '@/components/Map';
import UserAvatar from '@/components/UserAvatar';
import { useLocation } from 'react-router-dom';
import './styles.scss';
import Rank from '@/components/Rank';
import { CurIdMockData, PlayersMockData, RankMockData } from '@/mock/data';
import { IPlayer } from '@/components/Player';
import { uploadUserMove } from '@/service/user';

const Game = () => {
  const [renderMapData, setRenderMapData] = useState([]);
  const [vertexCoordinate, setVertexCoordinate] = useState({
    x: 0,
    y: 0
  });

  const [curPlayer, setCurPlayer] = useState<null | IPlayer>(null);
  const [players, setPlayers] = useState(PlayersMockData);

  const mapDataRef = useRef([]);
  const location = useLocation();
  const { username = '', avatar = 'snake', roomId = '000000' } = location.state ?? {};

  const onKeyDown = (e) => {
    const mapData = mapDataRef.current;
    if (mapData.length === 0 || e.keyCode < 37 || e.keyCode > 40) {
      return;
    }
    switch (e.keyCode) {
      case 37:
        vertexCoordinate.x = Math.max(0, vertexCoordinate.x - 1);
        break;
      case 38:
        vertexCoordinate.y = Math.max(0, vertexCoordinate.y - 1);
        break;
      case 39:
        vertexCoordinate.x = Math.min(mapData[0].length - 1 - MapConfig.visualWidth, vertexCoordinate.x + 1);
        break;
      case 40:
        vertexCoordinate.y = Math.min(mapData.length - 1 - MapConfig.visualHeight, vertexCoordinate.y + 1);
        break;
    }
    setVertexCoordinate({
      ...vertexCoordinate
    });
  };
  
  const movePlayer = (paths, merkelData) => {
    let pathIndex = 0;
    const curPlayerIndex = players.findIndex(item => item.id === curPlayer!.id);
    const interval = setInterval(() => {
      Object.assign(players[curPlayerIndex], paths[pathIndex]);
      pathIndex++;
      setPlayers([...players]);
      if (pathIndex === paths.length) {
        clearInterval(interval);
      }
    }, 300);
    uploadUserMove(merkelData);
  }

  useEffect(() => {
    loadMapData().then((csv) => {
      setRenderMapData(csv);
      mapDataRef.current = csv;
    });

    const player = players.find((item) => item.id === CurIdMockData);
    setCurPlayer(player as IPlayer);

  }, []);

  return (
    <div className="mi-game" onKeyDown={onKeyDown} tabIndex={0}>
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

      <Rank
        data={RankMockData}
        curId={CurIdMockData}
      />
      <Map
        width={MapConfig.visualWidth}
        height={MapConfig.visualHeight}
        players={players}
        curId={CurIdMockData}
        data={renderMapData}
        vertexCoordinate={vertexCoordinate}
        onPlayerMove={movePlayer}
      />
    </div>
  )
};

export default Game;