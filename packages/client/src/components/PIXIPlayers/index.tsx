import React from 'react';
import { Container } from '@pixi/react';
import Player, { IPlayer } from '@/components/PIXIPlayers/Player';
import { isDelivery } from '@/utils/map';

interface IProps {
  data: IPlayer[];
  huntingPlayerId?: string;
}

const PIXIPlayers = (props: IProps) => {

  const { data = [], huntingPlayerId } = props;
  return (
    <Container>
      {
        data.filter(player => !isDelivery(player)).map((player, index) => {

          return <Player key={index} hpVisible hunted={huntingPlayerId === player.addr} {...player}/>;
        })
      }
    </Container>
  );
};

export default PIXIPlayers;