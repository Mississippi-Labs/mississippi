import React, { useRef, useEffect, useState } from 'react';
import { Container, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';

const ProgressBar = ({ width, height = 10, borderColor = '#000', fillColor = '#f00', duration = 1000, animate = false }) => {
  const progressBarRef = useRef();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (animate) {
      const increment = 60 / (duration / PIXI.Ticker.shared.deltaMS);
      const tickerCallback = () => {
        if (progress < 100) {
          setProgress(prev => prev + increment);
        }
      };
      PIXI.Ticker.shared.add(tickerCallback);
      return () => PIXI.Ticker.shared.remove(tickerCallback);
    }
  }, [animate, duration, progress]);

  useEffect(() => {
    progressBarRef.current.clear();
    progressBarRef.current.beginFill(fillColor);
    progressBarRef.current.drawRect(0, 1, progress / 100 * (width - 1), height - 1);
    progressBarRef.current.endFill();
  }, [progress, fillColor, height]);


  return (
    <Container width={width} height={height}>
      <Graphics
        draw={g => {
          g.clear();
          g.lineStyle(1, borderColor, 1);
          g.drawRect(0, 0, width, height);
        }}
      />
      <Graphics ref={progressBarRef} />
    </Container>
  );
};

export default ProgressBar;
