import React from 'react';
import './styles.scss';
import Header from './header';
import UserInfo from './userInfo';

const FFA = () => {
  return (
    <div className={'ffa-page'}>
      <Header/>

      <section className={'ffa-section'}>
        <div className="ffa-switch-wrapper">
          <h2 className={'switch-item active'}>Home</h2>
          <h2 className={'switch-item'}>Battle</h2>
        </div>
        <UserInfo/>
        <button className="mi-btn">Mint and Go</button>
      </section>
    </div>
  );
};

export default FFA;