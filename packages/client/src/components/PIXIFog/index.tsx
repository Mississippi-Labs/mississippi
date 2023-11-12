import React, { useEffect, useState } from 'react';
import { Container, Sprite } from '@pixi/react';
import { MapConfig } from '@/config/map';
import * as PIXI from 'pixi.js';
const { cellSize, visualWidth } = MapConfig;


interface IProps {
  offsetX?: number;
  offsetY?: number;
  position?: [number, number];
}


const Fog = (props: IProps) => {
  const { offsetX = 0, offsetY = 0, position = [0, 0] } = props;
  const [texture, setTexture] = useState<PIXI.Texture>();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const width = cellSize * visualWidth * 3;
    // const height = cellSize * visualHeight * 3;
    canvas.width = width;
    canvas.height = width;

    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(width / 2, width / 2, width / 16, width / 2, width / 2, width / 8);

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, width);
    setTexture(PIXI.Texture.from(canvas));
  }, []);

  if (!texture) {
    return null;
  }

  return (
    <Container
      position={[offsetX + position[0] * cellSize, offsetY + position[1] * cellSize]}
    >
      <Sprite
        texture={texture}
        anchor={0.5}
      />
    </Container>
  );
};

export default Fog;