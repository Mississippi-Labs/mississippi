import React from 'react';
import './styles.scss';

const arr = new Array(7).fill(0);

interface IProps {
  percent: number;
}

const Loading = (props: IProps) => {

  return (
    <div className="mi-loading-wrap">
      <div className='loading'>
        {
          arr.map((_, index) => <div className="loading__square" key={index}/>)
        }
      </div>

      <div className="loading-percent">{props.percent} %</div>
    </div>
  );
};

export default Loading;