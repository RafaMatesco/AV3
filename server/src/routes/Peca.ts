import { Router } from 'express';
import { PecaController } from '../controllers/Peca';
// The one piece is real

const router = Router();
const controller = new PecaController();

router.post('/pecas', controller.criar);
router.get('/pecas', controller.listar);
router.get('/pecas/:nome', controller.obterPorNome);
router.put('/pecas/:nome', controller.atualizar);
router.delete('/pecas/:nome', controller.excluir);

export default router;
