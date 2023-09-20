import React, { useEffect, useRef, useState } from 'react';
import { MapConfig } from '@/config';
import { loadMapData } from '@/utils';
import Map from '@/components/Map';
import UserAvatar from '@/components/UserAvatar';
import { useLocation } from 'react-router-dom';
import './styles.scss';

const Game = () => {
  const [renderMapData, setRenderMapData] = useState([]);
  const [vertexCoordinate, setVertexCoordinate] = useState({
    x: 0,
    y: 0
  });

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
  }

  useEffect(() => {
    loadMapData().then((csv) => {
      setRenderMapData(csv);
      mapDataRef.current = csv;
    });

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
      <Map
        width={MapConfig.visualWidth}
        height={MapConfig.visualHeight}
        players={[]}
        data={renderMapData}
        vertexCoordinate={vertexCoordinate}
      />
    </div>
  )
};

export default Game;