# 📚 Biblioteca Web

Sistema web para cadastro de **Autores** e **Livros** (CRUD completo dos dois).
Cada livro é escrito por **um** autor e um autor pode ter **vários** livros: relacionamento **1 : N**
(`autor_id` é chave estrangeira na tabela `livros`).

Projeto feito no laboratório de Engenharia de Software (Prof. Sandro Laudares) repetindo o fluxo do projeto **Agenda Web**.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | Java 17 + Spring Boot 3.2 (Web, Data JPA, Validation, Lombok) + Maven |
| Frontend | React 18 + React Router 6 + Axios (react-scripts 5) • Node.js 20 + npm |
| Banco de dados | PostgreSQL 15 (desenvolvimento) • H2 em memória (perfil `test`) |
| Testes | JUnit 5 + Mockito (`@WebMvcTest`, `@MockBean`, MockMvc) • `@SpringBootTest` • Jest |
| Versão / CI / Containers | Git + GitHub • GitHub Actions • Docker + Docker Compose |

## Modelo de dados

```
AUTORES (1) ──── escreve ────< (N) LIVROS
id, nome, nacionalidade,          id, titulo, isbn, ano_publicacao,
data_nascimento, criado_em        genero, autor_id (FK), criado_em
```

## Estrutura de pastas

```
biblioteca-web/
├── backend/
│   ├── pom.xml e Dockerfile
│   └── src/
│       ├── main/java/com/biblioteca/{model, repository, controller}
│       ├── main/resources/application.properties
│       └── test/  (AutorControllerTest, LivroControllerTest, IntegracaoTest)
├── frontend/
│   ├── package.json, Dockerfile, nginx.conf, public/
│   └── src/{components, services}
├── docker-compose.yml
├── .github/workflows/ci-cd.yml
└── README.md
```

## Endpoints

| Verbo | URL | Ação | Status |
|---|---|---|---|
| POST | `/api/autores` | Cria autor | 201 |
| GET | `/api/autores` | Lista (ordem: nome) | 200 |
| GET | `/api/autores/{id}` | Busca | 200 / 404 |
| PUT | `/api/autores/{id}` | Atualiza | 200 / 404 |
| DELETE | `/api/autores/{id}` | Remove (409 se tiver livros) | 200 / 404 / 409 |
| POST | `/api/livros` | Cria livro ligado a um autor | 201 |
| GET | `/api/livros` | Lista (ordem: título) | 200 |
| GET | `/api/livros/{id}` | Busca | 200 / 404 |
| PUT | `/api/livros/{id}` | Atualiza (inclusive o autor) | 200 / 404 |
| DELETE | `/api/livros/{id}` | Remove | 200 / 404 |
| GET | `/api/livros/autor/{autorId}` | Livros de um autor | 200 |

Exemplo para criar um livro:

```json
{ "titulo": "Dom Casmurro", "isbn": "978-8535910667", "anoPublicacao": 1899,
  "genero": "Romance", "autor": { "id": 1 } }
```

## Como executar

### Tudo com Docker

```bash
docker-compose up -d --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api/autores
- Swagger: http://localhost:8080/swagger-ui.html

### Em desenvolvimento

```bash
docker-compose up -d postgres        # só o banco (biblioteca_db, postgres/postgres)

cd backend && mvn spring-boot:run    # porta 8080

cd frontend && npm install && npm start   # porta 3000
```

### Testes de aceitação (curl)

```bash
curl -X POST http://localhost:8080/api/autores -H "Content-Type: application/json" \
  -d '{"nome":"Machado de Assis","nacionalidade":"Brasileira","dataNascimento":"1839-06-21"}'

curl -X POST http://localhost:8080/api/livros -H "Content-Type: application/json" \
  -d '{"titulo":"Dom Casmurro","anoPublicacao":1899,"genero":"Romance","autor":{"id":1}}'
```

## Como rodar os testes

```bash
cd backend
mvn test                              # todos
mvn test -Dtest="*ControllerTest"     # unitários
mvn test -Dtest="IntegracaoTest"      # integração (H2)

cd frontend
npm test -- --watchAll=false
```

## Divisão de trabalho

| Integrante | Responsabilidade | Branch |
|---|---|---|
| Aluno(a) 1 – DEV 1 | CRUD de Autores: `Autor.java`, `AutorRepository`, `AutorController`, `AutorControllerTest`, `AutorList.js`, `AutorForm.js` | `feature/autores` |
| Aluno(a) 2 – DEV 2 | CRUD de Livros: `Livro.java`, `LivroRepository`, `LivroController`, `LivroControllerTest`, `LivroList.js`, `LivroForm.js` | `feature/livros` |

Arquivos comuns (`api.js`, `App.js`, `docker-compose.yml`, CI, README) divididos entre os dois.
Cada integrante revisou o Pull Request do outro.

> O desenvolvimento foi feito em conjunto pela dupla no mesmo computador (de Luana), por isso todos os commits aparecem com a conta `luanafmarques`.
