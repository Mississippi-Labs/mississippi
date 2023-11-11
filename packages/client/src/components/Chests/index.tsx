import React, { useEffect, useState } from 'react';
import { Container, Sprite } from '@pixi/react';
import { MapConfig } from '@/config/map';
import * as PIXI from 'pixi.js';
import ProgressBar from '@/components/Chests/ProgressBar';
const { cellSize, spriteCellSize, visualWidth, visualHeight } = MapConfig;

interface IChest {
  x: number;
  y: number;
  opening: boolean;
}

interface IProps {
  offsetX?: number;
  offsetY?: number;
  data?: IChest[];
}


const Chests = (props: IProps) => {
  const { offsetX = 0, offsetY = 0, data = [] } = props;

  const [texture, setTexture] = useState<PIXI.Texture<PIXI.Resource>>();

  useEffect(() => {
    const chestTexture = PIXI.Texture.from('/assets/img/chest.png');
    setTexture(chestTexture);
  }, []);

  if (!texture) {
    return null;
  }

  return (
    <Container
      position={[offsetX, offsetY]}
    >
      {
        data.map((item) => {
          return (
            <Container position={[item.x * cellSize, item.y * cellSize]} key={item.id}>
              <ProgressBar width={cellSize} animate={item.id === 1}/>
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