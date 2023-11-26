import React, { useState } from 'react';
import './styles.scss';
import Player from '@/components/PIXIPlayers/Player';
import { Stage } from '@pixi/react';

const Talk = (props) => {
  const {position, text, curPlayer } = props;
  console.log('curPlayer', curPlayer);
  return (
    <div className='talk'>
      <div className='talk-main'>
        <div className='player'>
          {
            curPlayer?.equip ? (
              <Stage width={238} height={281} options={{ resolution: 1, backgroundAlpha: 0 }} style={{transform: 'rotateY(180deg)', marginLeft: 'auto'}} >
                <Player
                  size={128}
                  x={0.5}
                  y={0.5}
                  equip={curPlayer?.equip}
                />
              </Stage>
            ) : null
          }
        </div>
      </div>
    </div>
  );
};

export default Talk;