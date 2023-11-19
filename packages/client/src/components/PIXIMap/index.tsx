import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Container, Sprite } from '@pixi/react';

import MAP_CFG, { MapConfig } from '@/config/map';
import { ICellClassCache, ICoordinate } from '@/components/MapCell';
import { getCellClass } from '@/utils';

interface IProps {
  offset?: {
    x: number;
    y: number;
  }
  emitEvent?: (action: string, coordinate: ICoordinate, type: number) => void;
}

const { cellSize, spriteCellSize, visualWidth, visualHeight } = MapConfig;

const PIXIMap = (props: IProps = {}) => {

  const { offset = { x: 0, y: 0 }, emitEvent } = props;
  const { x: offsetX, y: offsetY } = offset;
  const cellClassCache = useRef<ICellClassCache>({});
  const [textures, setTextures] = useState<PIXI.Texture<PIXI.Resource>[]>([]);

  useEffect(() => {
    const spriteSheetTexture = PIXI.Texture.from('/assets/img/map/wall_sprite.png');
    const _textures = Array(24).fill(0).map((_, index) => {
      const size = cellSize / 3;
      const sprite1Rect = new PIXI.Rectangle(index * size, 0, size, size);
      // @ts-ignore
      return new PIXI.Texture(spriteSheetTexture, sprite1Rect);
    });

    setTextures(_textures);
  }, [])

  const isRenderable = (x: number, y: number) => {
    return x >= -cellSize && x < cellSize*(visualWidth + 1) && y >= -cellSize && y <= cellSize*(visualHeight + 1);
  }

  if (textures.length === 0) {
    return null;
  }

  return (
    <Container 
      position={[offsetX, offsetY]}
    >
      {
        MAP_CFG.map((row, y) => {
          return row.map((type, x) => {
            if (!cellClassCache.current[`${y}-${x}`]) {
              cellClassCache.current[`${y}-${x}`] = getCellClass(MAP_CFG, { x, y})
            }
            const { transforms, classList } = cellClassCache.current[`${y}-${x}`];
            const positionX = x * cellSize;
            const positionY = y * cellSize;
            const renderable = isRenderable(positionX + offsetX, positionY + offsetY);
            if (!renderable) {
              return null;
            }
            return (
              <Container
                position={[positionX, positionY]}
                key={`${x}-${y}`}
                interactive={'auto'}
                onclick={(e) => {
                  emitEvent?.('click', { x, y }, e);
                }}
                onmouseenter={(e) => {
                  emitEvent?.('hover', { x, y }, e);
                }}
                onrightclick={(e) => {
                  emitEvent?.('rightClick', { x, y }, e);
                }}
              >
                {
                  classList.map((item, index) => {
                    const transformStyle = transforms.find((item) => item.index === index);
                    return (
                      <Sprite
                        key={`${x}-${y}-${index}`}
                        x={(index % 3) * spriteCellSize + spriteCellSize / 2}
                        y={~~(index / 3) * spriteCellSize + spriteCellSize / 2}
                        width={spriteCellSize}
                        height={spriteCellSize}
                        anchor={0.5}
                        angle={transformStyle?.rotation ?? 0}
                        texture={textures[item - 1]}
                      />
                    )
                  })
                }
              </Container>
            )
          })
        })
      }
    </Container>
  );
};

export default React.memo(PIXIMap);