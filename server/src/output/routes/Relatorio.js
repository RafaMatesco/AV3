"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Relatorio_1 = require("../controllers/Relatorio");
const router = (0, express_1.Router)();
const controller = new Relatorio_1.RelatorioController();
router.post('/relatorios', controller.gerar);
exports.default = router;
