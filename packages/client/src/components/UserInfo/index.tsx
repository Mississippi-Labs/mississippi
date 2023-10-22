import React, { useEffect, useState } from 'react';
import './styles.scss';
import UserPackage from '@/components/UserPackage';
import Appearance from '@/components/Appearance';

export interface IUserInfo {
  head: string;
  clothes: string;
  handheld: string;
  minting?: boolean;
  gem: number;
}

const UserInfo = (props: IUserInfo) => {

  const { handheld, head, clothes, minting = false, gem } = props;

  return (
    <div className={'mi-userinfo-wrapper'}>
      <div className="left-main-content">
        <h3>User info</h3>
        <div className="user-detail-wrapper">
          <div className="user-appearance-wrapper">
            <div className="user-appearance-box">
              <Appearance clothes={clothes} handheld={handheld} head={head}/>
            </div>
          </div>
          <div className={`loot-wrapper ${minting ? '' : 'loaded'}`}>
            <div className="loot-detail">

            </div>
            <div className="loot-detail">

            </div>
          </div>
          <div className={`user-attr-wrapper ${minting ? '' : 'loaded'}`}>
            <dl>
              <dt>HP</dt>
              <dd><span className="base-attr">{minting ? 0 : 100}</span><span className="extra-attr">100</span></dd>
            </dl>
            <dl>
              <dt>Attack</dt>
              <dd><span className="base-attr">{minting ? 0 : 20}</span><span className="extra-attr">1</span></dd>
            </dl>
            <dl>
              <dt>AttackRange</dt>
              <dd><span className="base-attr">{minting ? 0 : 5}</span><span className="extra-attr">1</span></dd>
            </dl>
            <dl>
              <dt>Speed</dt>
              <dd><span className="base-attr">{minting ? 0 : 2}</span><span className="extra-attr">2</span></dd>
            </dl>
            <dl>
              <dt>Strength</dt>
              <dd><span className="base-attr">{minting ? 0 : 20}</span><span className="extra-attr">1</span></dd>
            </dl>
            <dl>
              <dt>Space</dt>
              <dd><span className="base-attr">{minting ? 0 : 10}</span><span className="extra-attr">1</span></dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="right-main-content">
        <UserPackage
          gem={gem}
          title={'User Package'}
        />
        <UserPackage
          title={'Season Package'}
        />
      </div>
    </div>
  );
};

export default UserInfo;