import React from 'react';
import './styles.scss';
import UserAddress from '@/components/UserAddress';
import { Stage } from '@pixi/react';
import Player, { IPlayer } from '@/components/PIXIPlayers/Player';

interface IProps extends IPlayer {
  address: string;
}

const UserAvatar = (props: IProps) => {

  const { address, balance, ...rest } = props;

  return (
    <div className="mi-c-user-avatar">
      <div className={`avatar-box`}>
        <Stage width={72} height={72} options={{ resolution: 1, backgroundAlpha: 0 }}>
          <Player {...rest} size={36} x={0.5} y={0.5} isPlaying={false} name={''} />
        </Stage>
      </div>

      <UserAddress address={address} account={balance + 'ETH'}/>
    </div>
  );
};

export default UserAvatar;