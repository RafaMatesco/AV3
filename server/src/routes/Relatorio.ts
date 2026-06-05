import { Router } from 'express';
import { RelatorioController } from '../controllers/Relatorio';
// The one piece is real

const router = Router();
const controller = new RelatorioController();

router.post('/relatorios', controller.gerar);

export default router;
