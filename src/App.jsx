import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Aquí importas las rutas de React Router
import Game from './pages/Game';
import Lobby from './pages/Lobby';

function App() {
  return (
    <Router>  {/* Envuelves todo en BrowserRouter para gestionar las rutas */}
      <Routes>
        <Route path="/game" element={<Game />} /> {/* Ruta para el juego */}
        <Route path="/lobby" element={<Lobby />} /> {/* Ruta para el lobby */}
        <Route path="/" element={<Lobby />} /> {/* Ruta por defecto (landing page) */}
      </Routes>
    </Router>
  );
}

export default App;