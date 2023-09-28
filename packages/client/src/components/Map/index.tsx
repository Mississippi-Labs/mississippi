import React, { useEffect, useMemo, useRef } from 'react';
import { IPlayer } from '../Player';
import MapCell, { ICellClassCache } from '../MapCell';
import './styles.scss';

interface IProps {
  width: number;
  height: number;
  players: IPlayer[];
  data: number[][];
  vertexCoordinate: {
    x: number,
    y: number,
  }
}

const Map = (props: IProps) => {
  const { width, height, vertexCoordinate, data, players } = props;
  const { x: startX, y: startY } = vertexCoordinate;

  const staticData = useMemo(() => {
    return Array(height).fill(0).map(() => Array(width).fill(0));
  }, [width, height]);

  const playerData = useMemo(() => {
    const obj = {};
    players.forEach((player) => {
      obj[`${player.x}-${player.y}`] = player;
    });
    return obj;
  }, [players]);

  const cellClassCache = useRef<ICellClassCache>({});


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
                      mapData={data}
                      cellClassCache={cellClassCache.current}
                      player={playerData[`${x}-${y}`]}
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