// import { useMUD } from "./MUDContext";

//   const {
//     network: { tables, useStore },
//     systemCalls: { addTask, toggleTask, deleteTask },
//   } = useMUD();

//   console.log("tables", tables);

//   const tasks = useStore((state) => {
//     const records = Object.values(state.getRecords(tables.Tasks));
//     records.sort((a, b) => Number(a.value.createdAt - b.value.createdAt));
//     return records;
//   });


import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Game from './pages/game';
import Test from './pages/test';
import Home from '@/pages/home';
import HeroEdit from '@/pages/heroEdit';
import PIXIAPP from '@/components/PIXIAPP';
import { useEffect } from 'react';
import TestBattle from '@/pages/testBattle';

export const App = () => {

  useEffect(() => {
    document.body.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    })
  }, [])

  return (
    <div className="mi-app">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="game" element={<Game />} />
            <Route path="test" element={<Test />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
