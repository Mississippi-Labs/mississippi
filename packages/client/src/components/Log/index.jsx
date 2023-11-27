import React, { useRef, useState, useEffect } from 'react';
import './styles.scss';
import eventEmitter from '../../utils/eventEmitter';

console.log('eventEmitter', eventEmitter);

const Log = () => {
  const [logs, setLogs] = useState([]);
  const myLog = useRef(null);

  const scrollToBottom = () => {
    myLog.current.scrollTop = myLog.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    function addLogCb(e) {
      let index = logs.findIndex(log => log.time === e.time);
      if (index > -1) {
        logs[index] = e;
      } else {
        logs.push(e);
      }
      setLogs([...logs]);
    }
    try {
      eventEmitter?.on('log', addLogCb);
    } catch (error) {
      console.log('eventEmitter.on error', error);
    }
  }, []);

  return (
    <div style={{ fontFamily: 'MISS', height: '200px', position: 'fixed', bottom: '40px', left: '18px', zIndex: '99', width: '250px' }}>
      <div className="title" style={{ width: '249px', height: '32px', color: '#FFF', fontSize: '18px' }}>Log</div>
      <div className='log-content' ref={myLog} style={{height: '168px',overflow: 'auto', width: '250px'}}>
        {
          logs.map((log, index) => (
            <div key={index} style={{ color: log?.type == 'error' ? '#F00' : log.block ? '#FFF' : '#FFE303', fontSize: '10px', lineHeight: '1.4', marginBottom: '10px' }}>{log?.type == 'error' ? 'Error' : log.block || 'waiting'} {log.msg}</div>
          ))
        }
      </div>
      
    </div>
  );
};

export default Log;