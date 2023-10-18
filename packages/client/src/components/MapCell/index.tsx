import React from 'react';
import { CellType } from '../../constants';
import { getCellClass, isMovable } from '@/utils';
import './styles.scss';
import Player, { IPlayer } from '@/components/Player';

interface ITransform {
  index: number;
  transform: string;
}

interface ICellClass {
  transforms: ITransform[];
  classList: number[];
}

export interface ICellClassCache {
  [k: string]: ICellClass
}

export interface ICoordinate {
  x: number;
  y: number;
}

interface IProps {
  coordinate: ICoordinate,
  mapData: number[][];
  cellClassCache: ICellClassCache;
  players?: IPlayer[];
  onMoveTo: (ICoordinate) => void;
}

const MapCell = (props: IProps) => {
  const { coordinate: { x, y}, mapData, cellClassCache, players, onMoveTo } = props;
  if (!cellClassCache[`${y}-${x}`]) {
    cellClassCache[`${y}-${x}`] = getCellClass(mapData, { x, y});
  }

  const { transforms, classList } = cellClassCache[`${y}-${x}`];

  const onContextMenu = (e) => {
    e.preventDefault();
    const curMapDataType = mapData[y][x];
    if (isMovable(curMapDataType)) {
      onMoveTo({ x, y});
    }

  }

  return (
    <div className="mi-map-cell" onContextMenu={onContextMenu}>
      <div className="cell-map-box">
        {
          classList.map((item, index) => {
            const transformStyle = transforms.find((item) => item.index === index);
            const style = transformStyle ? {
              transform: transformStyle.transform
            } : {};
            return (
              <div
                key={`${x}-${y}-${index}`}
                className={`inner-cell mi-wall-${item}`}
                style={style}
              />
            )
          })
        }
      </div>

      {
        players && players.map((player) => <Player {...player}/>)
      }
    </div>
  );
};

export default MapCell;