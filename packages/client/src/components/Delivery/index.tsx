import React from 'react';
import { Container, Sprite } from '@pixi/react';
import { MapConfig } from '@/config/map';
const { cellSize, spriteCellSize, visualWidth, visualHeight } = MapConfig;

const Delivery = () => {
  return (
    <Container
      position={[4 * cellSize, 5 * cellSize]}
    >
      <Sprite
        width={cellSize}
        height={cellSize}
        image={'/assets/img/delivery.png'}
      />
    </Container>
  );
};

export default Delivery;