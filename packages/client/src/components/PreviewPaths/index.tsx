import React from 'react';
import { Container, Graphics, Sprite } from '@pixi/react';
import { MapConfig } from '@/config/map';
const { cellSize } = MapConfig;

interface IPaths {
  x: number;
  y: number;
  movable?: boolean;
}

interface IProps {
  offsetX?: number;
  offsetY?: number;
  data: IPaths[];
}


const PreviewPaths = (props: IProps) => {
  const { offsetX = 0, offsetY = 0, data = [] } = props;

  return (
    <Container
      position={[offsetX, offsetY]}
    >
      {
        data.map((item) => {
          return (
            <Graphics
              key={`${item.x}-${item.y}`}
              x={item.x * cellSize}
              y={item.y * cellSize}
              draw={g => {
                g.clear();
                const color = item.movable ? 0x4EBFFF : 0xFF0000;
                g.beginFill(color, 0.2);
                g.lineStyle(1, color, 1);
                g.drawRect(0, 0, cellSize, cellSize);
              }}
            />
          )
        })
      }
    </Container>
  );
};

export default PreviewPaths;