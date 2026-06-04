import { Router } from 'express';
import { AeronaveController } from '../controllers/Aeronave';

const router = Router();
const controller = new AeronaveController();

// Rotas do CRUD de Aeronave
router.post('/aeronaves', controller.criar);
router.get('/aeronaves', controller.listar);
router.get('/aeronaves/:codigo', controller.obterPorCodigo);
router.put('/aeronaves/:codigo', controller.atualizar);
router.delete('/aeronaves/:codigo', controller.excluir);

export default router;