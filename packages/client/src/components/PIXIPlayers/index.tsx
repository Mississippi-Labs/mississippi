import React from 'react';
import { Container } from '@pixi/react';
import Player, { IPlayer } from '@/components/PIXIPlayers/Player';
import { isDelivery } from '@/utils/map';

interface IProps {
  data: IPlayer[];
}

const PIXIPlayers = (props: IProps) => {

  const { data = [] } = props;

  return (
    <Container>
      {
        data.filter(player => !isDelivery(player)).map((player, index) => {
          return <Player key={index} {...player}/>;
        })
      }
    </Container>
  );
};

export default PIXIPlayers;