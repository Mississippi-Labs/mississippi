import React from 'react';
import { CellType } from '../../constants';
import { getCellClass } from '../../utils';
import './styles.scss';

interface ITransform {
  index: number;
  transform: string;
}

interface ICellClass {
  transforms: ITransform[];
  classList: number[];
}

interface IProps {
  coordinate: {
    x: number;
    y: number;
  },
  mapData: number[][];
  cellClassCache: {
    [k: string]: ICellClass
  };
}

const MapCell = (props: IProps) => {
  const { coordinate: { x, y}, mapData, cellClassCache } = props;
  if (!cellClassCache[`${y}-${x}`]) {
    cellClassCache[`${y}-${x}`] = getCellClass(mapData, { x, y});
  }

  const { transforms, classList } = cellClassCache[`${y}-${x}`]


  return (
    <div className="mi-map-cell">
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
  );
};

export default MapCell;