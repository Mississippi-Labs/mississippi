import React, { useState } from 'react';
import './styles.scss';
import Player from '@/components/PIXIPlayers/Player';
import Typewriter from '@/components/Typewriter';
import { Stage } from '@pixi/react';
import dark from '@/assets/img/duck_index.png';

const Talk = (props) => {
  const {position, text = 'I used to be an adventurer like you, then I took an arrow in the knee', curPlayer } = props;
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
            ) : <img src={dark} className='dark' />
          }
        </div>
        <div className='text'>
          <Typewriter text={text} typingSpeed={50} name={curPlayer?.name || ''} />
        </div>
      </div>
    </div>
  );
};

export default Talk;