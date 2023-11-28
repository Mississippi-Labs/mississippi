import React, { useState } from 'react';
import './styles.scss';
import Player from '@/components/PIXIPlayers/Player';
import Typewriter from '@/components/Typewriter';
import { Stage } from '@pixi/react';
import dark from '@/assets/img/duck_index.png';

const Talk = (props) => {
  const {position, text, curPlayer, step, sample } = props;
  return (
    <div className='talk'>
      <div className='talk-main'>
        <div className='sample'>
          <img src={sample}></img>
        </div>
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
        <div className='text' onClick={() => props.onNext()}>
          <div className='step'>{step} / 10</div>
          <div className='name' style={{marginBottom: '18px'}}>{curPlayer?.name || 'Mistery Duck'}:</div>
          <Typewriter text={text} typingSpeed={30} step={step} />
          <div style={{position: 'absolute', bottom: '18px', right: '18px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.80)'}}>Click any button to continue</div>
        </div>
      </div>
    </div>
  );
};

export default Talk;