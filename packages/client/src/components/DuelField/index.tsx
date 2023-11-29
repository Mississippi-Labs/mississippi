import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AnimatedSprite, Stage } from '@pixi/react';
import Player, { IPlayer } from '@/components/PIXIPlayers/Player';
import { Actions, ActionType, EffectCfg, EffectFrameCount, FrameOffsetY, FrameSize } from '@/config/hero';
import { loadAssets } from '@/utils';
import * as PIXI from 'pixi.js';


export type AttackType = 'sprint' | 'sneak' | 'magic';
export type RoleType = 'left' | 'right';

interface IProps {
  leftPlayer: IPlayer;
  rightPlayer: IPlayer;
  afterAttack?: (role: RoleType) => void;
}

export interface IDuelFieldMethod {
  leftAttack: (type: AttackType) => void;
  rightAttack: (type: AttackType) => void;
  kill: (role: RoleType) => void;
}


const DuelField = React.forwardRef<IDuelFieldMethod>((props: IProps, ref) => {

  const { leftPlayer, rightPlayer, afterAttack } = props;
  const [leftAction, setLeftAction] = useState<ActionType>('idle');
  const [rightAction, setRightAction] = useState<ActionType>('idle');
  const textureMap = useRef({
    magic: null,
    sprint: null,
    sneak: null
  });
  const [frameIndex, setFrameIndex] = useState(0);
  const frameInterval = useRef<NodeJS.Timeout>();
  const [attackType, setAttackType] = useState<AttackType>(null);
  const [effectPositionX, setEffectPositionX] = useState(200);

  useImperativeHandle(ref, () => ({
    leftAttack: (type: AttackType) => {
      setLeftAction('slash');
      setRightAction('blink');
      setEffectPositionX(680);
      console.log(leftPlayer.name, 'attack', type);
      if (textureMap.current[type]) {
        setAttackType(type);
      }
    },
    rightAttack: (type: AttackType) => {
      setRightAction('slash');
      setLeftAction('blink');
      setEffectPositionX(200);
      if (textureMap.current[type]) {
        setAttackType(type);
      }
      console.log(rightPlayer.name, 'attack', type);
    },
    kill: (role: RoleType) => {
      if (role === 'left') {
        setLeftAction('die')
      } else if (role === 'right') {
        setRightAction('die');
      }
    },
  }));

  useEffect(() => {
    if (!attackType) {
      return
    }
    clearInterval(frameInterval.current);
    frameInterval.current = setInterval(() => {
      setFrameIndex((prevState => {
        if (prevState + 1 >= EffectFrameCount) {
          setAttackType(null);
          clearInterval(frameInterval.current)
        }
        return (prevState + 1) % EffectFrameCount;
      }));
    }, 60);
  }, [attackType]);

  const loadTexture = (type: AttackType) => {
    loadAssets(`/assets/img/effect/${type}.png`, (assets) => {
      const sheet = PIXI.Texture.from(assets);
      const textures = [];
      for (let i = 0; i < EffectFrameCount; i++) {
        const offsetX = (i % EffectCfg[type].col) * EffectCfg[type].width;
        const offsetY = ~~(i / EffectCfg[type].col) * EffectCfg[type].height;
        const frame = new PIXI.Rectangle(offsetX, offsetY, EffectCfg[type].width, EffectCfg[type].height);
        textures.push(new PIXI.Texture(sheet, frame));
      }
      textureMap.current[type] = textures;
    })
  }

  useEffect(() => {
    loadTexture('sneak');
    loadTexture('sprint');
    loadTexture('magic');
  }, []);


  return (
    <Stage width={860} height={380} options={{ resolution: 1, backgroundAlpha: 0 }}>
      <Player
        {...leftPlayer}
        name={''}
        size={128}
        y={1.5}
        x={0.5}
        action={leftAction}
        onActionEnd={(action) => {
          if (action === 'slash') {
            setLeftAction('idle');
            setRightAction('idle');
            afterAttack?.('left');
          }
        }}
      />
      <Player
        {...rightPlayer}
        name={''}
        size={128}
        y={1.5}
        x={5.1}
        action={rightAction}
        onActionEnd={(action) => {
          if (action === 'slash') {
            setLeftAction('idle');
            setRightAction('idle');
            afterAttack?.('right');
          }
        }}
      />
      {
        attackType && textureMap.current[attackType] && (
          <AnimatedSprite
            anchor={0.5}
            x={effectPositionX}
            y={240}
            scale={attackType === 'sprint' ? 1.5 : 1}
            isPlaying
            animationSpeed={0}
            currentFrame={frameIndex}
            textures={textureMap.current[attackType]}
          />
        )
      }

    </Stage>
  );
});

export default DuelField;