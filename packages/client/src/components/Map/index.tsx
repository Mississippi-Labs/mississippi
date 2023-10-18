import React, { useMemo, useRef, useState } from 'react';
import { IPlayer } from '../Player';
import MapCell, { ICellClassCache, ICoordinate } from '../MapCell';
import './styles.scss';
import { bfs, simplifyMapData } from '@/utils/map';
import useMerkel from '@/hooks/useMerkel';

interface IProps {
  width: number;
  height: number;
  players: IPlayer[];
  data: number[][];
  curId: number;
  vertexCoordinate: {
    x: number,
    y: number,
  };
  onPlayerMove: (paths: ICoordinate[], simpleMapData: number[][]) => void;
}

const Map = (props: IProps) => {
  const { width, height, vertexCoordinate, data = [], players, curId, onPlayerMove } = props;
  const { x: startX, y: startY } = vertexCoordinate;

  const [prevActionCoordinate, setPrevActionCoordinate] = useState({ x: -1, y: -1});

  const staticData = useMemo(() => {
    return Array(height).fill(0).map(() => Array(width).fill(0));
  }, [width, height]);

  const simpleMapData = useMemo(() => {
    return simplifyMapData(data);
  }, [data]);

  const formatMovePath = useMerkel(simpleMapData);

  const playerData = useMemo(() => {
    const obj = {};
    players.forEach((player) => {
      if (obj[`${player.x}-${player.y}`]) {
        obj[`${player.x}-${player.y}`].push(player)
      } else {
        obj[`${player.x}-${player.y}`] = [player];
      }
    });
    return obj;
  }, [players]);

  const cellClassCache = useRef<ICellClassCache>({});

  const onMoveTo = (coordinate) => {
    const { x, y} = players.find((player) => player.id === curId);
    const paths = bfs(simpleMapData, { x, y }, coordinate).slice(1);
    onPlayerMove(paths, formatMovePath(paths));
  }


  if (data.length === 0) {
    return <div className="mi-map-wrapper"/>
  }

  return (
    <div className="mi-map-wrapper">
      <div className="mi-map-content">
      {
        staticData.map((row, rowIndex) => {
          const y = startY + rowIndex
          return (
            <div className="mi-map-row" key={y}>
              {
                row.map((_, colIndex) => {
                  const x = startX + colIndex;
                  return (
                    <MapCell
                      key={startX + colIndex}
                      coordinate={{
                        x,
                        y
                      }}
                      prevActionCoordinate={prevActionCoordinate}
                      onExeAction={setPrevActionCoordinate}
                      mapData={data}
                      cellClassCache={cellClassCache.current}
                      players={playerData[`${x}-${y}`]}
                      onMoveTo={onMoveTo}
                    />
                  )
                })
              }
            </div>
          )
        })
      }
      </div>
    </div>
  );
};

export default Map;