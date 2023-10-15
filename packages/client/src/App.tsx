import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Game from './pages/game';

export const App = () => {

  return (
    <div className="mi-app">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Game />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}