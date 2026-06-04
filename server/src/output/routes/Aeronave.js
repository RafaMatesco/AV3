"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Aeronave_1 = require("../controllers/Aeronave");
const router = (0, express_1.Router)();
const controller = new Aeronave_1.AeronaveController();
// Rotas do CRUD de Aeronave
router.post('/aeronaves', controller.criar);
router.get('/aeronaves', controller.listar);
router.get('/aeronaves/:codigo', controller.obterPorCodigo);
router.put('/aeronaves/:codigo', controller.atualizar);
router.delete('/aeronaves/:codigo', controller.excluir);
exports.default = router;
