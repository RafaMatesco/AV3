import { Router } from 'express';
import { TesteController } from '../controllers/Teste';
// The one piece is real

const router = Router();
const controller = new TesteController();

router.post('/testes', controller.criar);
router.get('/testes', controller.listar);
router.get('/testes/:id', controller.obterPorId);
router.put('/testes/:id', controller.atualizar);
router.delete('/testes/:id', controller.excluir);

export default router;
