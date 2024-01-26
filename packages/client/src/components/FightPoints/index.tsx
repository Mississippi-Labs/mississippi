import React, {useEffect, useRef} from 'react';
import {AnimatedSprite, Container} from "@pixi/react";
import {loadAssets} from "@/utils";
import * as PIXI from "pixi.js";
import {MapConfig} from "@/config/map";
const { cellSize } = MapConfig;


interface IPoint {
    x: number,
    y: number
}

interface IProps {
  data: IPoint[];
}

const FightPoints = (props: IProps) => {

    const textureMap = useRef([]);

    const loadTexture = (type: string) => {
        loadAssets(`/assets/img/fight/${type}.png`, (assets) => {
            const sheet = PIXI.Texture.from(assets);
            textureMap.current.push(sheet);
        })
    }

    useEffect(() => {
        loadTexture('xs1');
        loadTexture('xs2');
        loadTexture('xs3');
        loadTexture('xs4');
    }, []);


  if (textureMap.current.length < 4) {
    return null;
  }
  return (
    <Container>
        {
            props.data.map((point, index) => {
                return (
                  <AnimatedSprite
                    key={index}
                    x={point.x * cellSize}
                    y={point.y * cellSize}
                    width={cellSize}
                    height={cellSize}
                    isPlaying
                    scale={1.2}
                    animationSpeed={0.1}
                    textures={textureMap.current}
                  />
                )
            })
        }

    </Container>
  );
};

export default FightPoints;