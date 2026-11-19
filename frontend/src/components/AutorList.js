import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { autorService } from '../services/api';

function AutorList() {
  const [autores, setAutores] = useState([]);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const carregar = () => {
    autorService.listar()
      .then((res) => setAutores(res.data))
      .catch(() => setErro('Erro ao carregar autores.'));
  };

  useEffect(carregar, []);

  const excluir = (id) => {
    if (!window.confirm('Deseja excluir este autor?')) return;
    autorService.deletar(id)
      .then(carregar)
      .catch((e) => setErro(e.response?.data?.erro || 'Erro ao excluir autor.'));
  };

  return (
    <div>
      <h2>Autores</h2>
      <Link className="botao" to="/autores/novo">+ Novo Autor</Link>
      {erro && <p className="erro">{erro}</p>}
      <table style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nacionalidade</th>
            <th>Data de nascimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {autores.map((a) => (
            <tr key={a.id}>
              <td>{a.nome}</td>
              <td>{a.nacionalidade}</td>
              <td>{a.dataNascimento}</td>
              <td>
                <button className="secundario" onClick={() => navigate(`/autores/editar/${a.id}`)}>Editar</button>
                <button className="perigo" onClick={() => excluir(a.id)}>Excluir</button>
              </td>
            </tr>
          ))}
          {autores.length === 0 && (
            <tr><td colSpan="4">Nenhum autor cadastrado.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AutorList;
