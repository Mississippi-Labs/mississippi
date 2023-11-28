import React, { useState, useEffect } from 'react';

function Typewriter({ text, typingSpeed, step, name }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (text && (currentIndex < text.length)) {
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
    console.log(1)
    setDisplayText('');
    setCurrentIndex(0);
  }, [step]);

  return <div style={{width: '100%', height: '100%', position: 'relative'}} dangerouslySetInnerHTML={{ __html: displayText }}>
  </div>;
}

export default Typewriter;