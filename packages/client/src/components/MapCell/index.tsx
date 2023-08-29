import React from 'react';
import { CellType } from '../../constants';
import { getCellClass } from '../../utils';
import './styles.scss';

interface IProps {
  coordinate: {
    x: number;
    y: number;
  },
  mapData: number[][];
}

const MapCell = (props: IProps) => {
  const { coordinate: { x, y}, mapData } = props;
  const current = mapData[y][x];

  const { transforms, classList } = getCellClass(mapData, { x, y})


  return (
    <div className="mi-map-cell">
      {
        classList.map((item, index) => {
          const style = transforms[index] ? {
            transform: transforms[index].transform
          } : {};
          return (
            <div
              key={`${x}-${y}`}
              className={`inner-cell mi-wall-${item}`}
              style={style}
            />
          )
        })
      }
    </div>
  );
};

export default MapCell;