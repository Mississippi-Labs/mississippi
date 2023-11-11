import React from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import { MapConfig } from '@/config/map';
import PIXIMap from '@/components/PIXIMap';
import Chests from '@/components/Chests';
import { TreasureChestMockData } from '@/mock/data';

const { cellSize, spriteCellSize, visualWidth, visualHeight } = MapConfig;

const PIXIAPP = () => {
  return (
    <Stage
      width={cellSize * visualWidth}
      height={cellSize * visualHeight}
      options={{ resolution: 1 }}
    >
      <PIXIMap/>
      <Chests data={TreasureChestMockData}/>
    </Stage>
  );
};

export default PIXIAPP;