import { Router } from 'express';
import { FuncionarioController } from '../controllers/Funcionario';

const router = Router();
const controller = new FuncionarioController();

router.post('/funcionarios', controller.criar);
router.get('/funcionarios', controller.listar);
router.get('/funcionarios/setup-required', controller.setupRequired);
router.post('/funcionarios/login', controller.login);
router.get('/funcionarios/:id', controller.obterPorId);
router.put('/funcionarios/:id', controller.atualizar);
router.delete('/funcionarios/:id', controller.excluir);

export default router;
