import React, { useState } from 'react';
import './styles.scss';
import Player from '@/components/PIXIPlayers/Player';
import { Stage } from '@pixi/react';

const Talk = (props) => {
  const {position, text, curPlayer } = props;
  console.log('curPlayer', curPlayer);
  return (
    <div className='talk'>
      <div className='player'>
        <Stage width={256} height={256} options={{ resolution: 1, backgroundAlpha: 0 }}>
          <Player
            size={128}
            x={0.5}
            y={0.5}
            equip={curPlayer?.equip}
          />
        </Stage>
      </div>
    </div>
  );
};

export default Talk;