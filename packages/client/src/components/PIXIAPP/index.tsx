import React from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { MapConfig } from '@/config/map';
import PIXIMap from '@/components/PIXIMap';
import Chests from '@/components/Chests';
import { TreasureChestMockData } from '@/mock/data';
import Delivery from '@/components/Delivery';
import PreviewPaths from '@/components/PreviewPaths';
import PIXIFog from '@/components/PIXIFog';
import PIXIPlayers from '@/components/PIXIPlayers';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const { cellSize, spriteCellSize, visualWidth, visualHeight } = MapConfig;

const PIXIAPP = () => {
  return (
    <Stage
      width={cellSize * visualWidth}
      height={cellSize * visualHeight}
      options={{ resolution: 1 }}
    >
      <PIXIMap/>
      <Delivery/>
      <PreviewPaths
        data={[
          {
            x: 5,
            y: 5,
            movable: true
          },
          {
            x: 5,
            y: 6,
            movable: true
          },
          {
            x: 5,
            y: 7
          },
        ]}
      />
      <Chests data={TreasureChestMockData}/>
      <PIXIPlayers/>
      <PIXIFog/>

    </Stage>
  );
};

export default PIXIAPP;