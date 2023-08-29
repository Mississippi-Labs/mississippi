import { loadMapData } from './utils';
import { useEffect } from 'react';
import Map from './components/Map';
import { MapConfig } from './config';
import './App.scss';

export const App = () => {

  useEffect(() => {
    loadMapData().then((csv) => {
      console.log(csv);
    })
  }, [])

  return (
    <div className="mi-app">
      <Map width={MapConfig.visualWidth} height={MapConfig.visualHeight} players={[]}/>
    </div>
  )
}