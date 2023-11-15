import React, { useEffect, useRef, useState } from 'react';
import { Container, AnimatedSprite, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';

import { Actions, FrameOffsetY, FrameSize } from '@/config/hero';
import { MapConfig } from '@/config/map';
import { loadAssets } from '@/utils';
const { cellSize } = MapConfig;

export type PlayerToward = 'Left' | 'Right';

const textStyle = new PIXI.TextStyle({
  align: 'center',
  fontFamily: '"MISS", Helvetica, sans-serif',
  fontSize: 12,
  fontWeight: '400',
  stroke: '#000',
  wordWrap: true,
})

export interface IPlayer {
  // mud data field
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
  state: number;
  lastBattleTime: number;
  maxHp: number;
  name: string;
  url: string;
  equip: {
    clothes: string;
    handheld: string;
    head: string;
  }
  // fe field
  action?: string;
  toward?: PlayerToward;
  size?: number;
  position?: [number, number];
  moving?: boolean;
  waiting?: boolean; // wait tx
  isPlaying?: boolean;
}

const Player = (props: IPlayer) => {

  const { action = 'idle', size = cellSize, toward = 'Right', x = 0, y = 0, equip = {}, name, isPlaying = true, waiting = false, moving } = props;
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
  const frameInterval = useRef<NodeJS.Timeout>();
  
  const loadTexture = (region, type = 'Human') => {

    let sheet;
    const textures = [];
    loadAssets(`/assets/img/hero/${region}/${type}.png`, (assets) => {
      sheet = PIXI.Texture.from(assets);
      for (let i = 0; i < Actions[action].step; i++) {
        const offsetX = i * FrameSize;
        const offsetY = Actions[action].row * FrameSize + FrameOffsetY;
        const hFrameSize = (assets.height < offsetY + FrameSize) ? (assets.height - offsetY) : FrameSize;
        const frame = new PIXI.Rectangle(offsetX, offsetY, FrameSize, hFrameSize);
        textures.push(new PIXI.Texture(sheet, frame));
      }
      textureMap[region] = textures;
      setTextureMap({
        ...textureMap
      })
    })
  }

  useEffect(() => {
    loadTexture('body');
    loadTexture('eyes');
    loadTexture('hair', 'Hair2');
    loadTexture('head');
    loadTexture('arms');
  }, [action]);

  useEffect(() => {
    clearInterval(frameInterval.current);
    setFrameIndex(0);
    frameInterval.current = setInterval(() => {
      if (isPlaying) {
        if (Actions[action].loop) {
          setFrameIndex(prevIndex => (prevIndex + 1) % Actions[action].step);
        } else {
          setFrameIndex(prevIndex => {
            if (prevIndex === Actions[action].step - 1) {
              clearInterval(frameInterval.current)
              return prevIndex;
            }
            return (prevIndex + 1) % Actions[action].step;
          });
        }
      }
    }, 300);

    return () => clearInterval(frameInterval.current);
  }, [action]);

  useEffect(() => {
    if (clothes) {
      loadTexture('armor', clothes);
    }
    if (cap) {
      loadTexture('helmet', cap);
    }
    if (handheld) {
      loadTexture('weapon', handheld);
    }
  }, [clothes, cap, handheld, action]);

  const scale = size / cellSize * 3;

  const commonProps = {
    isPlaying,
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
        name &&
        <Text
          text={name}
          anchor={0.5}
          x={cellSize / 2}
          y={-20}
          style={textStyle}
        />
      }
      {
        (waiting && !moving) && (
          <Text
            text={'Wait TX'}
            anchor={0.5}
            x={cellSize / 2}
            y={size + 10}
            style={textStyle}
          />
        )

      }
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
    </Container>
  );
};

export default Player;