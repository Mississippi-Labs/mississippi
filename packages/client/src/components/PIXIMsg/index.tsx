import React, { useRef, useEffect } from 'react';
import { IPlayer } from '@/components/PIXIPlayers/Player';
import { Container, Sprite } from '@pixi/react';
import { isDelivery } from '@/utils/map';
import { getValidMsgContent } from '@/utils/player';
import { MapConfig } from '@/config/map';
import { loadAssets } from '@/utils';
import * as PIXI from 'pixi.js';

const { cellSize } = MapConfig;

interface IMsgMap {
  [key: string]: {
    content: string;
    time: number;
  }
}

interface IProps {
  players: IPlayer[];
  msgMap: IMsgMap;
}


const PIXIMsg = (props: IProps) => {
  const { players, msgMap } = props;
  const assets = useRef(null);

  const loadTexture = (msg: any) => {
    // e 分割
    let msgArr = msg.split('E');
    let index = msgArr[1] - 1;
    console.log('index', index);
    //  一行10个 取第n个图
    let x = index % 10;
    let y = Math.floor(index / 10);
    // 图片宽度30，间隔5 取第n个坐标
    x = x * 35;
    y = y * 35;
    console.log('x', x);
    let sheet;
    sheet = PIXI.Texture.from(assets.current);
    let rectangle = new PIXI.Rectangle(x, y, 30, 30);
    let texture = new PIXI.Texture(sheet, rectangle);
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    return texture;
  }

  useEffect(() => {
    loadAssets(`/assets/img/meme/meme.svg`, (res) => {
      assets.current = res;
    })
  }, [msgMap]);
  return (
    <Container>
      {
        players.filter(player => !isDelivery(player) && getValidMsgContent(player?.addr?.toLocaleLowerCase(), msgMap)).map((player) => (
          <Container position={[player.x * cellSize, player.y * cellSize]} key={player.addr}>
            <Sprite
              image={'/assets/img/meme/box.png'}
              width={56}
              height={50}
              x={cellSize + 18}
              y={-16}
              anchor={0.5}
              zIndex={10}
            />
            <Sprite
              x={cellSize + 23}
              y={-17}
              anchor={0.5}
              zIndex={11}
              texture={loadTexture(getValidMsgContent(player?.addr?.toLocaleLowerCase(), msgMap))}
            />
          </Container>
        ))
      }
    </Container>
  );
};

export default PIXIMsg;