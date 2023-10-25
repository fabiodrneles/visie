// Importar as dependências
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Importe o pacote CORS

// Criar uma instância do servidor Express
const app = express();

// Configuração do servidor Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de opções do CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Especifique os métodos HTTP permitidos
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

// Use o middleware "cors" com as opções configuradas
app.use(cors(corsOptions));

// Definir a porta em que o servidor irá ouvir
const port = process.env.PORT || 3000;

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'jobs.visie.com.br', // Hostname
  user: 'fabiodorneles', // Nome de usuário
  password: 'ZmFiaW9kb3Ju', // Senha
  database: 'fabiodorneles', // Nome do banco de dados
  port: 3306 // Porta do MySQL
});

// Rota para listar todas as pessoas
app.get('/pessoas', (req, res) => {
  const query = 'SELECT * FROM pessoas';

  db.query(query, (err, rows) => {
    if (err) {
      console.error('Erro ao executar a consulta: ' + err.message);
      res.status(500).send('Erro ao buscar pessoas.');
      return;
    }

    res.json(rows);
  });
});

// Rota para criar uma nova pessoa
app.post('/pessoas', (req, res) => {
  const { nome, rg, cpf, data_nascimento, data_admissao, funcao } = req.body;
  const query = 'INSERT INTO pessoas (nome, rg, cpf, data_nascimento, data_admissao, funcao) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [nome, rg, cpf, data_nascimento, data_admissao, funcao], (err, result) => {
    if (err) {
      console.error('Erro ao executar a consulta: ' + err.message);
      res.status(500).send('Erro ao criar uma nova pessoa.');
      return;
    }

    res.json({ message: 'Pessoa criada com sucesso.', id: result.insertId });
  });
});

// Rota para atualizar dados de uma pessoa
app.put(`/pessoas/:id_pessoa`, (req, res) => {
  const id_pessoa = req.params.id_pessoa;
  const { nome, rg, cpf, data_nascimento, data_admissao, funcao } = req.body;
  const query = 'UPDATE pessoas SET nome=?, rg=?, cpf=?, data_nascimento=?, data_admissao=?, funcao=? WHERE id_pessoa=?';

  db.query(query, [nome, rg, cpf, data_nascimento, data_admissao, funcao, id_pessoa], (err, result) => {
    if (err) {
      console.error('Erro ao executar a consulta: ' + err.message);
      res.status(500).send('Erro ao atualizar a pessoa.');
      return;
    }

    res.json({ message: 'Pessoa atualizada com sucesso.' });
  });
});


// Rota para buscar os dados de uma pessoa por ID
app.get('/pessoas/:id_pessoa', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM pessoas WHERE id_pessoa = ?';

  db.query(query, [id], (err, rows) => {
    if (err) {
      console.error('Erro ao executar a consulta: ' + err.message);
      res.status(500).send('Erro ao buscar a pessoa.');
      return;
    }

    if (rows.length === 0) {
      res.status(404).send('Pessoa não encontrada.');
      return;
    }

    res.json(rows[0]);
  });
});

// Rota para excluir uma pessoa
app.delete('/pessoas/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM pessoas WHERE id_pessoa=?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao executar a consulta: ' + err.message);
      res.status(500).send('Erro ao excluir a pessoa.');
      return;
    }

    res.json({ message: 'Pessoa excluída com sucesso.' });
  });
});

// Rota para teste do banco de dados
app.get('/pessoas/:id', (req, res) => {
  const query = 'SELECT * FROM pessoas';

  db.query(query, (err, rows) => {
    if (err) {
      console.error('Erro ao executar a consulta: ' + err.message);
      res.status(500).send('Erro no teste do banco de dados.');
      return;
    }

    res.json(rows);
  });
});


// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.message);
  } else {
    console.log('Conexão ao banco de dados MySQL bem-sucedida');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor Node.js está rodando na porta ${port}`);
});