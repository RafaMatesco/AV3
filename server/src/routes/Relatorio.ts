import { Router } from 'express';
import { RelatorioController } from '../controllers/Relatorio';

const router = Router();
const controller = new RelatorioController();

router.post('/relatorios', controller.gerar);

export default router;
