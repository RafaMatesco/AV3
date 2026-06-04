"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioController = void 0;
const Aeronave_1 = require("../services/Aeronave");
const Relatorio_1 = __importDefault(require("../models/Relatorio"));
const aeronaveService = new Aeronave_1.AeronaveService();
const relatorioModel = new Relatorio_1.default();
class RelatorioController {
    gerar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { aeronaveCodigo, cliente, dataEntrega, formato } = req.body;
                if (!aeronaveCodigo || !cliente || !dataEntrega) {
                    return res.status(400).json({ erro: "Campos obrigatórios: aeronaveCodigo, cliente, dataEntrega" });
                }
                const aeronave = yield aeronaveService.buscarPorCodigo(aeronaveCodigo);
                if (formato === 'html') {
                    const html = relatorioModel.gerarRelatorioHTML(aeronave, cliente, dataEntrega);
                    res.setHeader('Content-Type', 'text/html');
                    return res.status(200).send(html);
                }
                else {
                    const json = relatorioModel.gerarRelatorioJSON(aeronave, cliente, dataEntrega);
                    return res.status(200).json(json);
                }
            }
            catch (error) {
                if (error.message.includes("não encontrada")) {
                    return res.status(404).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao gerar relatório." });
            }
        });
    }
}
exports.RelatorioController = RelatorioController;
