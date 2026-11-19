import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import AutorList from './components/AutorList';
import AutorForm from './components/AutorForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <header className="menu">
        <h1>📚 Biblioteca Web</h1>
        <nav>
          <NavLink to="/autores">Autores</NavLink>
        </nav>
      </header>
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Navigate to="/autores" />} />
          <Route path="/autores" element={<AutorList />} />
          <Route path="/autores/novo" element={<AutorForm />} />
          <Route path="/autores/editar/:id" element={<AutorForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
