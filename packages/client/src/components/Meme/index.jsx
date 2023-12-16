import React, { useRef, useState, useEffect } from 'react';
import './styles.scss';

const Meme = (props) => {
  const [isShowAll, setIsShowAll] = useState(false);
  const [arr, setArr] = useState(new Array(10).fill(0));
  // const myLog = useRef(null);

  // const scrollToBottom = () => {
  //   myLog.current.scrollTop = myLog.current.scrollHeight;
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [logs]);

  // 50长度的空数组

  const changeShow = () => {
    if (isShowAll) {
      setArr(new Array(10).fill(0));
    } else {
      setArr(new Array(50).fill(0));
    }
    setIsShowAll(!isShowAll);
  }

  
  return (
    <div className='meme' style={{maxHeight: isShowAll ? '210px' : '70px'}}>
      <div className='bg' style={{height: isShowAll ? 'auto' : '30px'}}>
        <img src="/assets/img/meme/meme.svg" alt="" />
        <div className="btns">
          {
            arr.map((item, index) => (
              <div key={index} className='meme-item' onClick={() => props.sendMsg(index)}></div>
            ))
          }
        </div>
      </div>
      <div className='show-all' style={{transform: isShowAll ? 'rotate(0deg)' : 'rotate(180deg)'}} onClick={changeShow}>
        <img src='/assets/img/meme/arrow.svg' alt='' />
      </div>
    </div>
  );
};

export default Meme;