import React, { useMemo } from 'react';
import { IPlayer } from '../Player';
import './styles.scss';

interface IProps {
  width: number;
  height: number;
  players: IPlayer[];
}

const Map = (props: IProps) => {
  const { width, height } = props;
  const staticData = useMemo(() => {
    return Array(height).fill(0).map(_ => Array(width).fill(0));
  }, [width, height]);

  return (
    <div className="mi-map-wrapper">
      <div className="mi-map-content">
      {
        staticData.map((row) => {
          return (
            <div className="mi-map-row">
              {
                row.map(() => <div className="mi-map-cell"/>)
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