import React, { useEffect, useState } from 'react';
import { Container, Graphics, Sprite } from '@pixi/react';
import { MapConfig } from '@/config/map';
import * as PIXI from 'pixi.js';
const { cellSize, visualWidth, visualHeight } = MapConfig;

interface IPaths {
  x: number;
  y: number;
  movable?: boolean;
}

interface IProps {
  offsetX?: number;
  offsetY?: number;
}


const Fog = (props: IProps) => {
  const { offsetX = 0, offsetY = 0 } = props;
  const [texture, setTexture] = useState<PIXI.Texture<PIXI.Resource>>();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const width = cellSize * visualWidth * 3;
    // const height = cellSize * visualHeight * 3;
    canvas.width = width;
    canvas.height = width;

    const ctx = canvas.getContext('2d');

// 创建径向渐变
// 参数分别为：内圆中心x坐标，内圆中心y坐标，内圆半径，外圆中心x坐标，外圆中心y坐标，外圆半径
    const gradient = ctx.createRadialGradient(width / 2, width / 2, width / 8, width / 2, width / 2, width / 4);

// 定义颜色停点
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); // 0%处透明
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)'); // 100%处不透明

// 应用渐变并绘制矩形
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, width);
    setTexture(PIXI.Texture.from(canvas));
  }, []);

  if (!texture) {
    return null;
  }

  return (
    <Container
      position={[offsetX, offsetY]}
    >
      <Sprite
        texture={texture}
        anchor={0.5}
      />
    </Container>
  );
};

export default Fog;