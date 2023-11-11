import React from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import { MapConfig } from '@/config/map';
import PIXIMap from '@/components/PIXIMap';
import Chests from '@/components/Chests';
import { TreasureChestMockData } from '@/mock/data';
import Delivery from '@/components/Delivery';
import PreviewPaths from '@/components/PreviewPaths';
import PIXIFog from '@/components/PIXIFog';

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
      <PIXIFog/>

    </Stage>
  );
};

export default PIXIAPP;