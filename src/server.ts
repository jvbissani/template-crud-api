import express from 'express';
import { json, urlencoded } from 'body-parser';
import dotenv from 'dotenv';
import sequelize from './config/database';
import userRoutes from './routes/userRoute';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configurações do Express
app.use(json());
app.use(urlencoded({ extended: true }));

// Rotas
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello Mo!');
});

// Testando a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});