import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Game from './pages/game';
import Test from './pages/test';
import Home from '@/pages/home';

export const App = () => {

  return (
    <div className="mi-app">
      <BrowserRouter>
        <Routes>
          <Route path="/">
<<<<<<< HEAD
=======
            {/*<Route index element={<Game />} />*/}
>>>>>>> 79480b45a422439a77d4380ef42b0c72297f51a7
            <Route index element={<Home />} />
            <Route path="game" element={<Game />} />
            <Route path="test" element={<Test />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}