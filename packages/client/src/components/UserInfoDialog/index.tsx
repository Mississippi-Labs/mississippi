import React from 'react';
import UserInfo, { IUserInfo } from '@/components/UserInfo';
import './styles.scss';

interface IProps extends IUserInfo {
  visible: boolean;
  oneself: boolean;
  onClose: () => void;
}

const UserInfoDialog = (props: IProps) => {

  const { visible, onClose, oneself, ...rest } = props;

  return (
    <div className={`mi-userinfo-dialog ${visible ? '' : 'hidden'}`}>
      <UserInfo {...rest} player={rest} />
      <button className="mi-btn close-btn" onClick={onClose}>{props.state == 1 ? 'Join The Game' : (props.x == 4 && props.y == 5 && oneself) ? 'Waiting' : 'Ok'}</button>
    </div>
  );
};

export default UserInfoDialog;