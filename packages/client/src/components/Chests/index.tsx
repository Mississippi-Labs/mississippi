import React, { useEffect, useState } from 'react';
import { Container, Sprite } from '@pixi/react';
import { MapConfig } from '@/config/map';
import * as PIXI from 'pixi.js';
import ProgressBar from '@/components/Chests/ProgressBar';
import { loadAssets } from '@/utils';
import { ICoordinate } from '@/components/MapCell';
const { cellSize, spriteCellSize, visualWidth, visualHeight } = MapConfig;

interface IChest {
  x: number;
  y: number;
  opening: boolean;
}

interface IProps {
  data?: IChest[];
  onOpen?: (id, c: ICoordinate) => void;
  openingBox?: number;
}


const Chests = (props: IProps) => {
  const { data = [], onOpen, openingBox } = props;

  const [texture, setTexture] = useState<PIXI.Texture>();

  useEffect(() => {
    loadAssets('/assets/img/chest.png', (assets) => {
      const chestTexture = PIXI.Texture.from(assets);
      setTexture(chestTexture);
    })
  }, []);

  if (!texture) {
    return null;
  }

  return (
    <Container
      onclick={() => {
        onOpen?.(data[0].id, { x: data[0].x, y: data[0].y })
      }}
    >
      {
        data.map((item) => {
          return (
            <Container position={[item.x * cellSize, item.y * cellSize]} key={item.id}>
              {
                openingBox === item.id && <ProgressBar width={cellSize} animate={true}/>
              }
              <Sprite
                width={cellSize}
                height={cellSize * 64 / 94}
                y={18}
                texture={texture}
              />
            </Container>
          )
        })
      }
    </Container>
  );
};

export default Chests;