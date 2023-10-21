import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import copyImg from '@/assets/img/copy.png';
import './styles.scss';
import { message } from 'antd';

interface IProps {
  account: string;
  address: string;
}

const UserAddress = (props: IProps) => {

  const { account, address = '' } = props;
  const addressTxt = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const onCopy = () => {
    message.success('Successfully copied');
  }

  return (
    <div className="user-address-wrapper">
      <div className="user-account">{account}</div>
      <CopyToClipboard text={address} onCopy={onCopy}>
        <div className="user-address">{addressTxt}</div>
      </CopyToClipboard>
      <CopyToClipboard text={address} onCopy={onCopy}>
        <img src={copyImg} alt="" className="copy-icon"/>
      </CopyToClipboard>
    </div>
  );
};

export default UserAddress;