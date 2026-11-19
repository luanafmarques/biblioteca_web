import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { autorService, livroService } from '../services/api';

const vazio = { titulo: '', isbn: '', anoPublicacao: '', genero: '', autorId: '' };

function LivroForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livro, setLivro] = useState(vazio);
  const [autores, setAutores] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    autorService.listar().then((res) => setAutores(res.data));
    if (id) {
      livroService.buscar(id)
        .then((res) => {
          const l = res.data;
          setLivro({
            titulo: l.titulo || '',
            isbn: l.isbn || '',
            anoPublicacao: l.anoPublicacao ?? '',
            genero: l.genero || '',
            autorId: l.autor ? String(l.autor.id) : '',
          });
        })
        .catch(() => setErro('Livro não encontrado.'));
    }
  }, [id]);

  const alterar = (e) => setLivro({ ...livro, [e.target.name]: e.target.value });

  const salvar = (e) => {
    e.preventDefault();
    // o autor vai só com o id: "autor": { "id": 1 }
    const dados = {
      titulo: livro.titulo,
      isbn: livro.isbn,
      anoPublicacao: livro.anoPublicacao ? Number(livro.anoPublicacao) : null,
      genero: livro.genero,
      autor: livro.autorId ? { id: Number(livro.autorId) } : null,
    };
    const req = id ? livroService.atualizar(id, dados) : livroService.criar(dados);
    req.then(() => navigate('/livros'))
      .catch(() => setErro('Erro ao salvar livro. Verifique os campos e o autor.'));
  };

  return (
    <div>
      <h2>{id ? 'Editar Livro' : 'Novo Livro'}</h2>
      {erro && <p className="erro">{erro}</p>}
      <form onSubmit={salvar}>
        <label>Título *</label>
        <input name="titulo" value={livro.titulo} onChange={alterar} maxLength={200} required />

        <label>Autor *</label>
        <select name="autorId" value={livro.autorId} onChange={alterar} required>
          <option value="">Selecione um autor</option>
          {autores.map((a) => (
            <option key={a.id} value={a.id}>{a.nome}</option>
          ))}
        </select>

        <label>ISBN</label>
        <input name="isbn" value={livro.isbn} onChange={alterar} maxLength={20} />

        <label>Ano de publicação</label>
        <input type="number" name="anoPublicacao" value={livro.anoPublicacao} onChange={alterar} />

        <label>Gênero</label>
        <input name="genero" value={livro.genero} onChange={alterar} maxLength={50} />

        <div className="acoes">
          <button type="submit">Salvar</button>
          <button type="button" className="secundario" onClick={() => navigate('/livros')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default LivroForm;
