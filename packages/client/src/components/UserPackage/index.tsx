import React from 'react';
import gemImg from '@/assets/img/gem.png';
import './styles.scss';

interface IProps {
  title: string;
  gem: number;
}


const UserPackage = (props: IProps) => {
  const arr = new Array(10).fill(0);

  arr[0] = props.gem;

  return (
    <div className="mi-user-package">
      <h3>{props.title}</h3>
      <div className="package-items-wrapper">
      {
        arr.map((count, index) => {
          return (
            <div className='package-item' key={index}>
              {
                count > 0 && (<>
                  <img src={gemImg} alt="" className={'package-item-gem'}/>
                  <div className={'package-item-count'}>{count}</div>
                </>)
              }
            </div>
          )
        })
      }
      </div>
    </div>
  );
};

export default UserPackage;