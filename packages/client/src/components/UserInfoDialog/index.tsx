import React from 'react';
import UserInfo, { IUserInfo } from '@/components/UserInfo';
import './styles.scss';

interface IProps extends IUserInfo {
  visible: boolean;
  onClose: () => void;
}

const UserInfoDialog = (props: IProps) => {

  const { visible, onClose, ...rest } = props;

  return (
    <div className={`mi-userinfo-dialog ${visible ? '' : 'hidden'}`}>
      <UserInfo {...rest} player={rest} />
      <button className="mi-btn close-btn" onClick={onClose}>OK</button>
    </div>
  );
};

export default UserInfoDialog;