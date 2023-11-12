import React, { useEffect, useState } from 'react';
import { Container, AnimatedSprite, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';

import { Actions, FrameOffsetY, FrameSize } from '@/config/hero';
import { MapConfig } from '@/config/map';
const { cellSize } = MapConfig;

export type PlayerToward = 'Left' | 'Right';

interface IMudPlayer {
  x: number;
  y: number;
  hp: number;
  attack: number;
  attackRange: number;
  speed: number;
  strength: number;
  space: number;
  oreBalance: number;
  treasureBalance: number;
  state: string;
  lastBattleTime: number;
  maxHp: number;
  name: string;
  url: string;
  equip: {
    clothes: string;
    handheld: string;
    head: string;
  }
}

export interface IPlayer extends IMudPlayer {
  action?: string;
  toward?: PlayerToward;
  size?: number;
  position?: [number, number];
}

const Player = (props: IPlayer) => {

  const { action = 'idle', size = cellSize, toward = 'Right', x = 0, y = 0, equip = {} } = props;
  const { clothes, handheld, head: cap } = equip;
  const [textureMap, setTextureMap] = useState({
    body: null,
    eyes: null,
    hair: null,
    head: null,
    arms: null,

    armor: null,
    weapon: null,
    helmet: null
  });

  const [frameIndex, setFrameIndex] = useState(0);

  
  const getRegionTexture = (region, type = 'Human') => {

    let sheet;
    const textures = [];

    try {
      sheet = PIXI.Texture.from(`/assets/img/hero/${region}/${type}.png`)
    } catch (e) {
      console.error(`can't find ${region}-${type}`);
      return  textures;
    }

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

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex(prevIndex => (prevIndex + 1) % Actions[action].step);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (clothes) {
      textureMap.armor = getRegionTexture('armor', clothes);
    }
    if (cap) {
      textureMap.helmet = getRegionTexture('helmet', cap);
    }
    if (handheld) {
      textureMap.weapon = getRegionTexture('weapon', handheld);
    }

  }, [clothes, cap, handheld]);

  const scale = size / cellSize * 3;

  const commonProps = {
    isPlaying: true,
    scale: [scale * (toward === 'Right' ? 1: -1), scale],
    anchor: 0.5,
    animationSpeed: 0,
    currentFrame: frameIndex,
    x: size / 2,
    y: size / 2
  }

  return (
    <Container
      position={[x * size, y * size]}
    >
      {
        ['body', 'head', 'hair', 'eyes',  'arms', 'armor', 'helmet', 'weapon']
          .filter((item) => textureMap[item] && textureMap[item].length > 0)
          .map((item) => {
            return (
              <AnimatedSprite
                key={item}
                textures={textureMap[item]}
                {...commonProps}
              />
            )
        })
      }
      {/*<AnimatedSprite*/}
      {/*  key={'body'}*/}
      {/*  textures={body}*/}
      {/*  {...commonProps}*/}
      {/*/>*/}

      {/*<AnimatedSprite*/}
      {/*  key={'head'}*/}
      {/*  textures={head}*/}
      {/*  {...commonProps}*/}
      {/*/>*/}

      {/*<AnimatedSprite*/}
      {/*  key={'hair'}*/}
      {/*  textures={hair}*/}
      {/*  {...commonProps}*/}
      {/*/>*/}

      {/*<AnimatedSprite*/}
      {/*  key={'eyes'}*/}
      {/*  textures={eyes}*/}
      {/*  {...commonProps}*/}
      {/*/>*/}

      {/*<AnimatedSprite*/}
      {/*  key={'arms'}*/}
      {/*  textures={arms}*/}
      {/*  {...commonProps}*/}
      {/*/>*/}

      {/*<AnimatedSprite*/}
      {/*  key={'armor'}*/}
      {/*  textures={armor}*/}
      {/*  {...commonProps}*/}
      {/*/>*/}

      {/*<AnimatedSprite*/}
      {/*  key={'helmet'}*/}
      {/*  textures={helmet}*/}
      {/*  {...commonProps}*/}
      {/*/>*/}

      {/*<AnimatedSprite*/}
      {/*  key={'weapon'}*/}
      {/*  textures={weapon}*/}
      {/*  {...commonProps}*/}
      {/*/>*/}

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