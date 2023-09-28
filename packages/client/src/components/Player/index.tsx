import React from 'react';
import './styles.scss';

export interface IPlayer {
  x: number;
  y: number;
  id: number;
}

const Player = (props: IPlayer) => {
  return (
    <div className="mi-player">
      {props.id}
      {props.x}
      {props.y}
    </div>
  );
};

export default Player;