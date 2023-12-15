import React, { useRef, useState, useEffect } from 'react';
import './styles.scss';

const Meme = (props) => {
  const [isShowAll, setIsShowAll] = useState(false);
  // const myLog = useRef(null);

  // const scrollToBottom = () => {
  //   myLog.current.scrollTop = myLog.current.scrollHeight;
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [logs]);

  // 50长度的空数组
  const arr = new Array(50).fill(0);

  
  return (
    <div className='meme' style={{maxHeight: isShowAll ? '210px' : '70px'}}>
      {
        arr.map((item, index) => (
          <div key={index} className='meme-item' onClick={() => props.sendMsg(index)}>
            {
              isShowAll ? (
                <img src={`/assets/img/meme/E${index + 1}.svg`} alt='' />
              ) : index < 10 ? (
                <img src={`/assets/img/meme/E${index + 1}.svg`} alt='' />
              ) : ''
            }
          </div>
        ))
      }
      <div className='show-all' style={{transform: isShowAll ? 'rotate(180deg)' : 'rotate(0deg)'}} onClick={() => setIsShowAll(!isShowAll)}>
        <img src='/assets/img/meme/arrow.svg' alt='' />
      </div>
    </div>
  );
};

export default Meme;