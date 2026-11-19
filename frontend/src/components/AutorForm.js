import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { autorService } from '../services/api';

const vazio = { nome: '', nacionalidade: '', dataNascimento: '' };

function AutorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [autor, setAutor] = useState(vazio);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (id) {
      autorService.buscar(id)
        .then((res) => setAutor({ ...vazio, ...res.data, dataNascimento: res.data.dataNascimento || '' }))
        .catch(() => setErro('Autor não encontrado.'));
    }
  }, [id]);

  const alterar = (e) => setAutor({ ...autor, [e.target.name]: e.target.value });

  const salvar = (e) => {
    e.preventDefault();
    const dados = { ...autor, dataNascimento: autor.dataNascimento || null };
    const req = id ? autorService.atualizar(id, dados) : autorService.criar(dados);
    req.then(() => navigate('/autores'))
      .catch(() => setErro('Erro ao salvar autor. Verifique os campos.'));
  };

  return (
    <div>
      <h2>{id ? 'Editar Autor' : 'Novo Autor'}</h2>
      {erro && <p className="erro">{erro}</p>}
      <form onSubmit={salvar}>
        <label>Nome *</label>
        <input name="nome" value={autor.nome} onChange={alterar} maxLength={100} required />

        <label>Nacionalidade</label>
        <input name="nacionalidade" value={autor.nacionalidade || ''} onChange={alterar} maxLength={50} />

        <label>Data de nascimento</label>
        <input type="date" name="dataNascimento" value={autor.dataNascimento} onChange={alterar} />

        <div className="acoes">
          <button type="submit">Salvar</button>
          <button type="button" className="secundario" onClick={() => navigate('/autores')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default AutorForm;
