import React, { useContext, useState } from 'react';
import './styles.scss';
import GameContext from '@/context';

export interface ITreasureChest {
  id?: number | string;
  x?: number;
  y?: number;
  gem?: number;
  opening?: boolean;
}

const TreasureChest = (props: ITreasureChest) => {

  const { openingBox } = useContext(GameContext);
  const opening = openingBox === props.id;

  return (
    <div className={'mi-treasure-chest'}>
      <div className={`open-loading ${opening ? 'opening' : ''}`}>
        <div className="progress"/>
      </div>
    </div>
  );
};

export default TreasureChest;