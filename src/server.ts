import 'dotenv/config';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import fileupload from 'express-fileupload';
import sequelize from './config/database';
import Routes from './routes/index';
require('./models/index');

const app = express();
const port = process.env.API_PORT || 3000;

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../access.log'),
  { flags: 'a' },
);

const corsOptions = {
  origin(origin: any, callback: any) {
    callback(null, true);
  },
  methods: 'GET,PUT,PATCH,POST,DELETE',
  credentials: true,
};

// Configurações do Express
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true, limit: '50mb' }));
app.use(fileupload({ createParentPath: true }));
app.use(cors(corsOptions));
app.use(morgan('combined', { stream: accessLogStream }));
app.use('/public', express.static('public'));

// Rotas
Routes(app);

// Rota padrão
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Testando a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});