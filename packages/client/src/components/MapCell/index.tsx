import React from 'react';
import { CellType } from '../../constants';
import { getCellClass } from '@/utils';
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

interface IProps {
  coordinate: {
    x: number;
    y: number;
  },
  mapData: number[][];
  cellClassCache: ICellClassCache;
  player?: IPlayer;
}

const MapCell = (props: IProps) => {
  const { coordinate: { x, y}, mapData, cellClassCache, player } = props;
  if (!cellClassCache[`${y}-${x}`]) {
    cellClassCache[`${y}-${x}`] = getCellClass(mapData, { x, y});
  }

  const { transforms, classList } = cellClassCache[`${y}-${x}`]


  return (
    <div className="mi-map-cell">
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
        player && <Player {...player}/>
      }
    </div>
  );
};

export default MapCell;