import React, { useEffect, useState } from 'react';
import { Container, AnimatedSprite, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
const { cellSize } = MapConfig;

import { Actions, FrameOffsetY, FrameSize } from '@/config/hero';
import { MapConfig } from '@/config/map';

export type PlayerToward = 'Left' | 'Right';

interface IProps {
  action: string;
  toward?: PlayerToward;
}

const Player = (props: IProps) => {

  const { action = 'idle', size = cellSize, toward = 'Right' } = props;
  const [textureMap, setTextureMap] = useState({
    body: null,
    eyes: null,
    hair: null,
    head: null,
    arms: null,
  });
  
  const getRegionTexture = (region, type = 'Human') => {
    const sheet = PIXI.Texture.from(`/assets/img/hero/${region}/${type}.png`);

    const textures = [];
    for (let i = 0; i < Actions[action].step; i++) {
      const frame = new PIXI.Rectangle(i * FrameSize, Actions[action].row * FrameSize + FrameOffsetY, FrameSize, FrameSize);
      textures.push(new PIXI.Texture(sheet, frame));
    }
    return textures;
  }

  useEffect(() => {

    textureMap.body = getRegionTexture('body');
    textureMap.eyes = getRegionTexture('eyes');
    textureMap.hair = getRegionTexture('hair', 'Hair2');
    textureMap.head = getRegionTexture('head');
    textureMap.arms = getRegionTexture('arms');

    setTextureMap({
      ...textureMap
    })
  }, []);

  const { body, eyes, hair, head, arms } = textureMap;

  if (!body) {
    return null;
  }

  const scale = size / cellSize * 3;

  const commonProps = {
    isPlaying: true,
    scale: [scale * (toward === 'Right' ? 1 : -1), scale],
    anchor: 0.5,
    animationSpeed: 0.04,
    x: size / 2,
    y: size / 2
  }

  return (
    <Container
      width={size}
      height={size}
    >
      <AnimatedSprite
        key={'body'}
        textures={body}
        {...commonProps}
      />

      <AnimatedSprite
        key={'head'}
        textures={head}
        {...commonProps}
      />

      <AnimatedSprite
        key={'hair'}
        textures={hair}
        {...commonProps}
      />

      <AnimatedSprite
        key={'eyes'}
        textures={eyes}
        {...commonProps}
      />

      <AnimatedSprite
        key={'arms'}
        textures={arms}
        {...commonProps}
      />

      {/*<Graphics*/}
      {/*  draw={g => {*/}
      {/*    g.clear();*/}
      {/*    const color = 0xFF0000;*/}
      {/*    g.beginFill(color, 0.2);*/}
      {/*    g.lineStyle(1, color, 1);*/}
      {/*    g.drawRect(0, 0, cellSize, cellSize);*/}
      {/*  }}*/}
      {/*/>*/}
    </Container>
  );
};

export default Player;