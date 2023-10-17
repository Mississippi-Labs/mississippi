import React from 'react';
import './styles.scss';

interface IProps {
  account: string;
  address: string;
}

const UserAddress = (props: IProps) => {

  const { account, address = '' } = props;
  const addressTxt = `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <div className="user-address-wrapper">
      <div className="user-account">{account}</div>
      <div className="user-address">{addressTxt}</div>
    </div>
  );
};

export default UserAddress;