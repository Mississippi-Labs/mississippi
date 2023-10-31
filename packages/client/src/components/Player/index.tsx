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
  addr: string;
  username: string;
  gem: number;
  toward?: PlayerToward;
  waiting?: boolean;
  equip: {
    head: string;
    handheld: string;
    clothes: string;
  };
}

const Player = (props: IPlayer) => {

  const { username, id, equip, gem = 0, toward, waiting } = props;
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
      {
        waiting && <div className={'waiting-tip'}>Waiting</div>
      }
    </div>
  );
};

export default Player;