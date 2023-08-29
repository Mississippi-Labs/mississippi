import React, { useMemo } from 'react';
import { IPlayer } from '../Player';
import MapCell from '../MapCell';
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
  const { width, height, vertexCoordinate, data } = props;
  const { x: startX, y: startY } = vertexCoordinate;
  const staticData = useMemo(() => {
    return Array(height).fill(0).map(_ => Array(width).fill(0));
  }, [width, height]);

  // console.log(data, 'data')

  if (data.length === 0) {
    return <div className="mi-map-wrapper"/>
  }

  return (
    <div className="mi-map-wrapper">
      <div className="mi-map-content">
      {
        staticData.map((row, rowIndex) => {
          return (
            <div className="mi-map-row" key={startY + rowIndex}>
              {
                row.map((_, colIndex) => {
                  return (
                    <MapCell
                      key={startX + colIndex}
                      coordinate={{
                        x: startX + colIndex,
                        y: startY + rowIndex
                      }}
                      mapData={data}
                    />
                    // <div className="mi-map-cell" key={startX + colIndex}>{data[startY + rowIndex][startX + colIndex]}</div>
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