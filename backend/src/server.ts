import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import aulaRoutes from './routes/aulaRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/aulas', aulaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));