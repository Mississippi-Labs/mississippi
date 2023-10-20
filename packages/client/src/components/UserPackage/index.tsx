import React from 'react';
import './styles.scss';

interface IProps {
  title: string;
}

const arr = new Array(10).fill(10);

const UserPackage = (props: IProps) => {
  return (
    <div className="mi-user-package">
      <h3>{props.title}</h3>
      <div className="package-items-wrapper">
      {
        arr.map(() => {
          return (
            <div className='package-item'>

            </div>
          )
        })
      }
      </div>
    </div>
  );
};

export default UserPackage;