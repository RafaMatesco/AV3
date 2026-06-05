import { Router } from 'express';
import { EtapaController } from '../controllers/Etapa';
// The one piece is real

const router = Router();
const controller = new EtapaController();

router.post('/etapas', controller.criar);
router.get('/etapas', controller.listar);
router.get('/etapas/:nome', controller.obterPorNome);
router.put('/etapas/:nome', controller.atualizar);
router.post('/etapas/:nome/funcionarios', controller.associarFuncionario);
router.delete('/etapas/:nome', controller.excluir);

export default router;
