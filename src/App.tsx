import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClassicGame, TimeGame } from '@/pages/Games';
import { Menu } from '@/pages/Menu';
import { Statistics } from '@/pages/Statistics';
import { Quest } from '@/pages/Quest';

const App = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={ '/' } element={ <Menu/> }/>
          <Route path={ '/classicGame' } element={ <ClassicGame/> }/>
          <Route path={ '/timeGame' } element={ <TimeGame/> }/>
          <Route path={ '/quest' } element={ <Quest/> }/>
          <Route path={ '/statistics' } element={ <Statistics/> }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};


export default App;