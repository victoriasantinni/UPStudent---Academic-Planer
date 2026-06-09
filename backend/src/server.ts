import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import aulaRoutes from './routes/aulaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes); 
app.use('/days', aulaRoutes); 

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor do UPStudent rodando perfeitamente!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});