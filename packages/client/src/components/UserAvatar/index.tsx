import React from 'react';
import './styles.scss';
import UserAddress from '@/components/UserAddress';

interface IProps {
  avatar: string;
  username: string;
  hp: number;
  maxHp: number;
  ap: number;
  maxAp: number;
  roomId: string;
}

const UserAvatar = (props: IProps) => {

  const { avatar, username = 'user', hp, maxHp, ap, maxAp, roomId } = props;

  return (
    <div className="mi-c-user-avatar">
      <div className={`avatar-box avatar-${avatar}`}/>

      <UserAddress address={'0x12324b4in4lkn2424124421'} account={'0.1ETH'}/>
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