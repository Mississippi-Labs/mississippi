import React from 'react';
import { Container } from '@pixi/react';
import Player, { IPlayer } from '@/components/PIXIPlayers/Player';
import { isDelivery } from '@/utils/map';
import { MapConfig } from '@/config';

interface IProps {
  data: IPlayer[];
  huntingPlayerId?: string;
  curPlayerPosition: number[];
}

const PIXIPlayers = (props: IProps) => {

  const { data = [], huntingPlayerId, curPlayerPosition } = props;

  const isRenderable = (player) => {
    return (Math.abs(player.x - curPlayerPosition[0]) < MapConfig.visualWidth)
      && (Math.abs(player.y - curPlayerPosition[1]) < MapConfig.visualHeight)
      && !isDelivery(player)
  }

  return (
    <Container>
      {
        data.filter(isRenderable).map((player, index) => {

          return <Player key={player.addr} hpVisible hunted={huntingPlayerId === player.addr} {...player}/>;
        })
      }
    </Container>
  );
};

export default PIXIPlayers;