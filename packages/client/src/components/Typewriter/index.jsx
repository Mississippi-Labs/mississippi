import React, { useState, useEffect } from 'react';

function Typewriter({ text, typingSpeed, step, name }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => {
      clearInterval(interval);
    };
  }, [text, typingSpeed, currentIndex]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [step]);

  return <div style={{width: '100%', height: '100%', position: 'relative'}}>
    <div className='name' style={{marginBottom: '18px'}}>{name || 'Mistery Duck'}:</div>
    {displayText}
    <div style={{position: 'absolute', bottom: '0px', right: '0px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.80)'}}>Click any button to continue</div>
  </div>;
}

export default Typewriter;