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
exports.EtapaController = void 0;
const Etapa_1 = require("../services/Etapa");
const etapaService = new Etapa_1.EtapaService();
class EtapaController {
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, status, prazo, aeronaveCodigo } = req.body;
                const novaEtapa = yield etapaService.cadastrarEtapa({
                    nome,
                    status,
                    prazo,
                    aeronaveCodigo
                });
                return res.status(201).json(novaEtapa);
            }
            catch (error) {
                if (error.message.includes("Já existe")) {
                    return res.status(409).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao cadastrar etapa." });
            }
        });
    }
    listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const etapas = yield etapaService.buscarTodas();
                return res.status(200).json(etapas);
            }
            catch (error) {
                return res.status(500).json({ erro: "Erro interno ao listar etapas." });
            }
        });
    }
    obterPorNome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome } = req.params;
                const etapa = yield etapaService.buscarPorNome(nome);
                return res.status(200).json(etapa);
            }
            catch (error) {
                return res.status(404).json({ erro: error.message || "Etapa não encontrada." });
            }
        });
    }
    atualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome } = req.params;
                const { status, prazo, aeronaveCodigo } = req.body;
                const updateData = {};
                if (status !== undefined)
                    updateData.status = status;
                if (prazo !== undefined)
                    updateData.prazo = prazo;
                if (aeronaveCodigo !== undefined)
                    updateData.aeronaveCodigo = aeronaveCodigo;
                const etapaAtualizada = yield etapaService.atualizarEtapa(nome, updateData);
                return res.status(200).json(etapaAtualizada);
            }
            catch (error) {
                if (error.message.includes("não encontrada")) {
                    return res.status(404).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao atualizar etapa." });
            }
        });
    }
    associarFuncionario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome } = req.params;
                const { funcionarioId } = req.body;
                const etapaAtualizada = yield etapaService.associarFuncionario(nome, Number(funcionarioId));
                return res.status(200).json(etapaAtualizada);
            }
            catch (error) {
                if (error.message.includes("não encontrada") || error.message.includes("não encontrado")) {
                    return res.status(404).json({ erro: error.message });
                }
                if (error.message.includes("já está associado")) {
                    return res.status(409).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao associar funcionário à etapa." });
            }
        });
    }
    excluir(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome } = req.params;
                yield etapaService.excluirEtapa(nome);
                return res.status(204).send();
            }
            catch (error) {
                if (error.message.includes("não encontrada")) {
                    return res.status(404).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao excluir etapa." });
            }
        });
    }
}
exports.EtapaController = EtapaController;
