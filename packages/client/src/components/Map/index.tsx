import React, { useContext, useMemo, useRef, useState } from 'react';
import { IPlayer } from '../Player';
import MapCell, { ICellClassCache, ICoordinate } from '../MapCell';
import './styles.scss';
import { bfs, simplifyMapData } from '@/utils/map';
import useMerkel from '@/hooks/useMerkel';
import { ITreasureChest } from '@/components/TreasureChest';
import GameContext from '@/context';
import { main } from '../../utils/createMerkelTree';

interface IProps {
  width: number;
  height: number;
  vertexCoordinate: ICoordinate;
}

const Map = (props: IProps) => {
  const { width, height, vertexCoordinate } = props;
  const { x: startX, y: startY } = vertexCoordinate;

  const [prevActionCoordinate, setPrevActionCoordinate] = useState({ x: -1, y: -1});
  const { onPlayerMove, players, treasureChest = [], curId, mapData } = useContext(GameContext);

  const staticData = useMemo(() => {
    return Array(height).fill(0).map(() => Array(width).fill(0));
  }, [width, height]);

  const simpleMapData = useMemo(() => {
    return simplifyMapData(mapData);
  }, [mapData]);

  const formatMovePath = useMerkel(simpleMapData);

  const treasureChestData = useMemo(() => {
    const obj = {};
    treasureChest.forEach((player) => {
      if (obj[`${player.x}-${player.y}`]) {
        obj[`${player.x}-${player.y}`].push(player)
      } else {
        obj[`${player.x}-${player.y}`] = [player];
      }
    });
    return obj;
  }, [treasureChest]);

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
    console.log(players, coordinate, 'onMoveTo', curId)
    const { x, y} = players.find((player) => player.addr.toLocaleLowerCase() === curId.toLocaleLowerCase());
    const paths = bfs(simpleMapData, { x, y }, coordinate).slice(1);
    onPlayerMove(paths, formatMovePath(paths));
    // 全是1的地图
    // const player = players.find((e) => e.addr.toLocaleLowerCase() === curId.toLocaleLowerCase());
    // let from = {x: player.x, y: player.y}
    // let to = coordinate
    // let map_info = [];
    // let line = Array.from({ length: 100 }, () => 1);
    // for (let i = 0; i < 10; i++) {
    //   map_info.push(line);
    // }
    // let {merkelData, paths} = main(from, to);
    // onPlayerMove(paths, merkelData);
  }


  if (mapData.length === 0) {
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
                      cellClassCache={cellClassCache.current}
                      players={playerData[`${x}-${y}`]}
                      treasureChest={treasureChestData[`${x}-${y}`]}
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