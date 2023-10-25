import React from 'react';
import './styles.scss';
import userImg from '@/assets/img/duck_default.png';
import { PlayerToward } from '@/components/Player';

interface IProps {
  head?: string;
  clothes?: string;
  handheld?: string;
  toward?: PlayerToward;
}

const Appearance = (props: IProps) => {

  const { handheld, head, clothes, toward } = props;

  return (
    <div className={`mi-appearance-wrapper ${toward === 'Right' ? 'appearance-right' : ''}`}>
      <img src={'/src/assets/img/duck_default.png'} alt="" className={'user-appearance'}/>
      {
        clothes && <img src={`/src/assets/img/duck/Clothes/${clothes}.png`} alt=""/>
      }
      {
        handheld && <img src={`/src/assets/img/duck/Handheld/${handheld}.png`} alt=""/>
      }
      {
        head && <img src={`/src/assets/img/duck/Head/${head}.png`} alt=""/>
      }
    </div>
  );
};

export default Appearance;