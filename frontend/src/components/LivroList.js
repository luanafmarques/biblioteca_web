import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { livroService } from '../services/api';

function LivroList() {
  const [livros, setLivros] = useState([]);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const carregar = () => {
    livroService.listar()
      .then((res) => setLivros(res.data))
      .catch(() => setErro('Erro ao carregar livros.'));
  };

  useEffect(carregar, []);

  const excluir = (id) => {
    if (!window.confirm('Deseja excluir este livro?')) return;
    livroService.deletar(id)
      .then(carregar)
      .catch(() => setErro('Erro ao excluir livro.'));
  };

  return (
    <div>
      <h2>Livros</h2>
      <Link className="botao" to="/livros/novo">+ Novo Livro</Link>
      {erro && <p className="erro">{erro}</p>}
      <table style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>ISBN</th>
            <th>Ano</th>
            <th>Gênero</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {livros.map((l) => (
            <tr key={l.id}>
              <td>{l.titulo}</td>
              <td>{l.autor ? l.autor.nome : '-'}</td>
              <td>{l.isbn}</td>
              <td>{l.anoPublicacao}</td>
              <td>{l.genero}</td>
              <td>
                <button className="secundario" onClick={() => navigate(`/livros/editar/${l.id}`)}>Editar</button>
                <button className="perigo" onClick={() => excluir(l.id)}>Excluir</button>
              </td>
            </tr>
          ))}
          {livros.length === 0 && (
            <tr><td colSpan="6">Nenhum livro cadastrado.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LivroList;
