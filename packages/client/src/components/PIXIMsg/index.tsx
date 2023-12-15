import React from 'react';
import { IPlayer } from '@/components/PIXIPlayers/Player';
import { Container, Sprite } from '@pixi/react';
import { isDelivery } from '@/utils/map';
import { getValidMsgContent } from '@/utils/player';
import { MapConfig } from '@/config/map';

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
  return (
    <Container>
      {
        players.filter(player => !isDelivery(player) && getValidMsgContent(player.addr, msgMap)).map((player) => (
          <Container position={[player.x * cellSize, player.y * cellSize]} key={player.addr}>
            <Sprite
              image={'/assets/img/meme/box.svg'}
              width={40}
              height={37}
              x={cellSize + 18}
              y={-20}
              anchor={0.5}
              zIndex={10}
            />
            <Sprite
              image={`/assets/img/meme/${getValidMsgContent(player.addr, msgMap)}.svg`}
              width={22}
              height={22}
              x={cellSize + 21}
              y={-20}
              anchor={0.5}
              zIndex={11}
            />
          </Container>
        ))
      }
    </Container>
  );
};

export default PIXIMsg;