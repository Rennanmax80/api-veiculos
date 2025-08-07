import express from 'express';
import cors from 'cors';
import { initDb } from './src/database/database';
import veiculosRoutes from './src/routes/veiculosRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/veiculos', veiculosRoutes);

// Inicializando o banco de dados e começando o servidor
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao inicializar o banco de dados:', err);
    process.exit(1);
  });
