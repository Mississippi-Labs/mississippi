import React from 'react';
import './styles.scss';

const Loading = () => {

  const arr = new Array(7).fill(0);

  return (
    <div className='loading'>
      {
        arr.map((_, index) => <div className="loading__square" key={index}/>)
      }
    </div>
  );
};

export default Loading;