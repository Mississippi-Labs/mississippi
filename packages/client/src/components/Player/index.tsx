import React from 'react';
import './styles.scss';

export interface IPlayer {
  x: number;
  y: number;
  id: number;
  username: string;
}

const Player = (props: IPlayer) => {
  return (
    <div className="mi-player">
      <div className="player-name">{props.username}</div>
      <div className="player-body avatar-box avatar-panda"/>
    </div>
  );
};

export default Player;