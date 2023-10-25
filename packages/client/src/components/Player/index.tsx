import React from 'react';
import './styles.scss';
import { CurIdMockData } from '@/mock/data';
import Fog from '@/components/Fog';
import Appearance from '@/components/Appearance';

export type PlayerToward = 'Left' | 'Right';

export interface IPlayer {
  x: number;
  y: number;
  id: number;
  username: string;
  gem: number;
  toward?: PlayerToward;
  equip: {
    head: string;
    handheld: string;
    clothes: string;
  };
}

const Player = (props: IPlayer) => {

  const { username, id, equip, gem = 0, toward } = props;
  return (
    <div className="mi-player">
      <div className="player-info">
        {
          gem > 0 && <span className="gem-num">{gem}</span>
        }
        <span className="player-username">{username}</span>

      </div>
      <Appearance toward={toward as PlayerToward} {...equip} />
      {
        id === CurIdMockData && <Fog />
      }
    </div>
  );
};

export default Player;