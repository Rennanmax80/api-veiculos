import express from 'express';
import cors from 'cors';
import { initDb } from './database';
import veiculosRoutes from './routes/veiculosRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/veiculos', veiculosRoutes);

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('Erro ao inicializar o banco de dados:', err);
    process.exit(1);
  });
