import React from 'react';
import './styles.scss';
import UserAddress from '@/components/UserAddress';
import Player from '@/components/Player';
import Appearance from '@/components/Appearance';

interface IProps {
  avatar: string;
  username: string;
  hp: number;
  maxHp: number;
  ap: number;
  maxAp: number;
  roomId: string;
  address: string;
  balance: string;
}

const UserAvatar = (props: IProps) => {

  const { avatar, username = 'user', hp, maxHp, ap, maxAp, roomId, address, balance } = props;

  return (
    <div className="mi-c-user-avatar">
      <div className={`avatar-box`}>
        <Appearance {...props}/>
      </div>

      <UserAddress address={address} account={balance + 'ETH'}/>
      {/*<div className="hp-wrapper">*/}
      {/*  <div className="hp" style={{ width: `${hp / maxHp * 100}%` }}/>*/}
      {/*</div>*/}
      {/*<div className="ap-wrapper">*/}
      {/*  <div className="ap" style={{ width: `${ap / maxAp * 100}%` }}/>*/}
      {/*</div>*/}
      <div className="username">{username}</div>
      {/*<div className="room-id">Room ID: {roomId}</div>*/}
    </div>
  );
};

export default UserAvatar;