import React from 'react';
import { Container } from '@pixi/react';
import Player, { IPlayer } from '@/components/PIXIPlayers/Player';

interface IProps {
  data: IPlayer[];
}

const PIXIPlayers = (props: IProps) => {

  const { data = [] } = props;

  console.log(data, 'data')

  return (
    <Container>
      {
        data.map((player, index) => {
          return <Player key={index} {...player}/>;
        })
      }
    </Container>
  );
};

export default PIXIPlayers;