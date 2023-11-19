import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Game from './pages/game';
import Test from './pages/test';
import Home from '@/pages/home';
import HeroEdit from '@/pages/heroEdit';
import PIXIAPP from '@/components/PIXIAPP';

export const App = () => {

  return (
    <div className="mi-app">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            {/*<Route index element={<Game />} />*/}
            <Route index element={<Home />} />
            <Route path="game" element={<Game />} />
            <Route path="test" element={<Test />} />
            <Route path="heroEdit" element={<HeroEdit />} />
            <Route path="app" element={<PIXIAPP />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
