import React, { useEffect, useState } from 'react';
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
import { IPlayer } from '@/components/PIXIPlayers/Player';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
// PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;
const { cellSize, spriteCellSize, visualWidth, visualHeight } = MapConfig;

interface IProps {
  players: IPlayer[];
  chests: [];
}

const PIXIAPP = (props: IProps) => {

  const { players = [], chests = [] } = props;

  // const [players, setPlayers] = useState([{ x: 1, y: 1 }]);
  //
  // useEffect(() => {
  //   setInterval(() => {
  //     players[0].x++
  //     setPlayers([...players])
  //   }, 3000)
  // }, [])

  console.log(chests, 'chests')

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
      <Chests data={chests}/>
      <PIXIPlayers data={players}/>
      <PIXIFog/>

    </Stage>
  );
};

export default PIXIAPP;