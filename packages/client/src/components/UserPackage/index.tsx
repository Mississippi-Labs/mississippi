import React from 'react';
import gemImg from '@/assets/img/gem.png';
import './styles.scss';
import Equipment, { IEquipment } from '@/components/Equipment';

interface IProps {
  title: string;
  gem: number;
  items?: IEquipment[];
}


const UserPackage = (props: IProps) => {
  const { items = [], gem = 0 } = props;
  const arr = new Array(10).fill(0);

  arr[0] = props.gem;

  return (
    <div className="mi-user-package">
      <h3>{props.title}</h3>
      <div className="package-items-wrapper">
        {
          gem > 0 && (
            <div className='package-item' key={0}>
              <img src={gemImg} alt="" className={'package-item-gem'}/>
              <div className={'package-item-count'}>{gem}</div>
            </div>
          )
        }
      {
        items.map((item, index) => {
          return (
            <div className='package-item' key={index}>
              <Equipment name={item.name} type={item.type}/>
            </div>
          )
        })
      }
      </div>
    </div>
  );
};

export default UserPackage;