import React from 'react';
import './styles.scss';
import { CurIdMockData } from '@/mock/data';
import Fog from '@/components/Fog';
import Appearance from '@/components/Appearance';

export interface IPlayer {
  x: number;
  y: number;
  id: number;
  username: string;
  gem?: number;
  equip: {
    head: string;
    handheld: string;
    clothes: string;
  };
}

const Player = (props: IPlayer) => {

  const { username, id, equip, gem = 0 } = props;
  return (
    <div className="mi-player">
      <div className="player-info">
        {
          gem > 0 && <span className="gem-num">24</span>
        }
        <span className="player-username">{username}</span>

      </div>
      <Appearance {...equip} />
      {/*<div className="player-body avatar-box avatar-panda"/>*/}
      {
        id === CurIdMockData && <Fog />
      }
    </div>
  );
};

export default Player;