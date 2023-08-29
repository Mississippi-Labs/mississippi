import { loadMapData } from './utils';
import { useEffect, useState } from 'react';
import Map from './components/Map';
import { MapConfig } from './config';
import './App.scss';

export const App = () => {

  const vertexCoordinate = {
    x: 0,
    y: 0
  };

  const [renderMapData, setRenderMapData] = useState([]);

  useEffect(() => {
    loadMapData().then((csv) => {
      setRenderMapData(csv);
    })
  }, [])

  return (
    <div className="mi-app">
      <Map
        width={MapConfig.visualWidth}
        height={MapConfig.visualHeight}
        players={[]}
        data={renderMapData}
        vertexCoordinate={vertexCoordinate}
      />
    </div>
  )
}