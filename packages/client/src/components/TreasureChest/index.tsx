import React, { useState } from 'react';
import './styles.scss';

export interface ITreasureChest {
  id?: number | string;
  x?: number;
  y?: number;
  gem?: number;
  opening?: boolean;
}

const TreasureChest = (props: ITreasureChest) => {

  const { opening } = props;

  return (
    <div className={'mi-treasure-chest'}>
      <div className={`open-loading ${opening ? 'opening' : ''}`}>
        <div className="progress"/>
      </div>
    </div>
  );
};

export default TreasureChest;