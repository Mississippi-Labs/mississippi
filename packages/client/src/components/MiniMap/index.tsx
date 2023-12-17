import React from 'react';
import { Container, Graphics, Stage } from '@pixi/react';
import { IPlayer } from '@/components/PIXIPlayers/Player';
import MAP_CFG, { DELIVERY } from '@/config/map';

import './styles.scss';
import { CellType } from '@/constants';
import { ICoordinate } from '@/components/PIXIMap';

interface IProps {
  curPlayer: IPlayer;
  visible: boolean;
}

const size = 10;

const drawBlock = (g) => {
  g.clear();
  g.beginFill(0x000000);
  g.drawRect(0, 0, size, size);
}

const drawEmpty = (g) => {
  g.clear();
  g.beginFill(0x763b36);
  g.drawRect(0, 0, size, size);
}

const BlockRect = ({ x, y}: ICoordinate) => {
  return (
    <Graphics
      x={x * size}
      y={y * size}
      draw={drawBlock}
    />
  )
}

const EmptyRect = ({ x, y }: ICoordinate) => {
  return (
    <Graphics
      x={x * size}
      y={y * size}
      draw={drawEmpty}
    />
  )
}

const MemoMap = React.memo(function InnerMiniMap() {
  return <Container>
    {
      MAP_CFG.map((row, y) => {
        return (
          <React.Fragment key={y}>
            {
              row.map((col, x) => {
                return (
                  col === CellType.immovable ?
                    <BlockRect key={`${x}-${y}`} x={x} y={y}/>
                    :
                    <EmptyRect key={`${x}-${y}`} x={x} y={y}/>
                )
              })
            }
          </React.Fragment>
        )
      })
    }
  </Container>
})

const MiniMap = (props: IProps) => {

  const { curPlayer, visible } = props;

  return (
    <div className={`mini-map-wrapper ${visible ? '' : 'hidden'}`}>
      <Stage
        width={MAP_CFG[0].length * size}
        height={MAP_CFG.length * size}
        options={{ resolution: 1 }}
      >

        <MemoMap/>

        <Graphics
          x={DELIVERY.x * size}
          y={DELIVERY.y * size}
          draw={(g) => {
            g.clear();
            g.beginFill(0x00ff00);
            g.drawRect(0, 0, size, size);
          }}
        />

        {
          curPlayer && (
            <Graphics
              x={curPlayer.x * size}
              y={curPlayer.y * size}
              draw={(g) => {
                g.clear();
                g.beginFill(0xff0000);
                g.drawRect(0, 0, size, size);
              }}
            />
          )
        }
      </Stage>
    </div>
  );
};

export default MiniMap;