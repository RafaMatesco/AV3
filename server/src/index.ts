import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { performance } from 'perf_hooks';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swaggerSpec';
import aeronaveRoutes from './routes/Aeronave';
import funcionarioRoutes from './routes/Funcionario';
import pecaRoutes from './routes/Peca';
import etapaRoutes from './routes/Etapa';
import testeRoutes from './routes/Teste';
import relatorioRoutes from './routes/Relatorio';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
  exposedHeaders: ['x-processing-time']
}));
app.use(express.json());

// Middleware para medir tempo de processamento no servidor
app.use((req, res, next) => {
  const start = performance.now();
  const originalSend = res.send;
  res.send = function (body) {
    const duration = performance.now() - start;
    res.setHeader('x-processing-time', duration.toFixed(2));
    return originalSend.call(this, body);
  };
  next();
});

// =-= ROTAS =-=
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(aeronaveRoutes);
app.use(funcionarioRoutes);
app.use(pecaRoutes);
app.use(etapaRoutes);
app.use(testeRoutes);
app.use(relatorioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando no endereço: http://localhost:${PORT}`);
    console.log(`Documentação da API: http://localhost:${PORT}/api-docs/`);

});
