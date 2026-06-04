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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PecaController = void 0;
const Peca_1 = require("../services/Peca");
const pecaService = new Peca_1.PecaService();
class PecaController {
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, tipo, prazo, fornecedor, status, aeronaveCodigo } = req.body;
                const novaPeca = yield pecaService.cadastrarPeca({
                    nome,
                    tipo,
                    prazo,
                    fornecedor,
                    status,
                    aeronaveCodigo
                });
                return res.status(201).json(novaPeca);
            }
            catch (error) {
                if (error.message.includes("Já existe")) {
                    return res.status(409).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao cadastrar peça." });
            }
        });
    }
    listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pecas = yield pecaService.buscarTodas();
                return res.status(200).json(pecas);
            }
            catch (error) {
                return res.status(500).json({ erro: "Erro interno ao listar peças." });
            }
        });
    }
    obterPorNome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome } = req.params;
                const peca = yield pecaService.buscarPorNome(nome);
                return res.status(200).json(peca);
            }
            catch (error) {
                return res.status(404).json({ erro: error.message || "Peça não encontrada." });
            }
        });
    }
    atualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome } = req.params;
                const { tipo, prazo, fornecedor, status, aeronaveCodigo } = req.body;
                const updateData = {};
                if (tipo !== undefined)
                    updateData.tipo = tipo;
                if (prazo !== undefined)
                    updateData.prazo = prazo;
                if (fornecedor !== undefined)
                    updateData.fornecedor = fornecedor;
                if (status !== undefined)
                    updateData.status = status;
                if (aeronaveCodigo !== undefined)
                    updateData.aeronaveCodigo = aeronaveCodigo;
                const pecaAtualizada = yield pecaService.atualizarPeca(nome, updateData);
                return res.status(200).json(pecaAtualizada);
            }
            catch (error) {
                if (error.message.includes("não encontrada")) {
                    return res.status(404).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao atualizar peça." });
            }
        });
    }
    excluir(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome } = req.params;
                yield pecaService.excluirPeca(nome);
                return res.status(204).send();
            }
            catch (error) {
                if (error.message.includes("não encontrada")) {
                    return res.status(404).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao excluir peça." });
            }
        });
    }
}
exports.PecaController = PecaController;
