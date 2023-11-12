import React, { useContext } from 'react';
import './styles.scss';
import { CurIdMockData } from '@/mock/data';
import Fog from '@/components/Fog';
import Appearance from '@/components/Appearance';
import GameContext from '@/context';

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
  console.log(props, 'player props')
  const { username, addr, equip, gem = 0, toward, waiting, x, y } = props;
  const { curAddr } = useContext(GameContext);

  // console.log(addr, curAddr, 'addr curid')
  return (
    <div>
    {
      x == 0 && y == 0 ? null : (
        <div className="mi-player">
          <div className="player-info">
            {
              gem > 0 && <span className="gem-num">{gem}</span>
            }
            <span className="player-username">{username}</span>

          </div>
          <Appearance toward={toward as PlayerToward} {...equip} />
          {
            addr === curAddr && <Fog />
          }
          {
            waiting && <div className={'waiting-tip'}>Wait TX</div>
          }
        </div>
      )
    }
    </div>
  );
};

export default Player;