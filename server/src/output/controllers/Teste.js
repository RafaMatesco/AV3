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
exports.TesteController = void 0;
const Teste_1 = require("../services/Teste");
const testeService = new Teste_1.TesteService();
class TesteController {
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tipo, resultado, aeronaveCodigo } = req.body;
                const novoTeste = yield testeService.cadastrarTeste({
                    tipo,
                    resultado,
                    aeronaveCodigo
                });
                return res.status(201).json(novoTeste);
            }
            catch (error) {
                return res.status(400).json({ erro: error.message || "Erro ao cadastrar teste." });
            }
        });
    }
    listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const testes = yield testeService.buscarTodos();
                return res.status(200).json(testes);
            }
            catch (error) {
                return res.status(500).json({ erro: "Erro interno ao listar testes." });
            }
        });
    }
    obterPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ erro: "ID do teste deve ser um número válido." });
                }
                const teste = yield testeService.buscarPorId(id);
                return res.status(200).json(teste);
            }
            catch (error) {
                return res.status(404).json({ erro: error.message || "Teste não encontrado." });
            }
        });
    }
    atualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ erro: "ID do teste deve ser um número válido." });
                }
                const { tipo, resultado, aeronaveCodigo } = req.body;
                const updateData = {};
                if (tipo !== undefined)
                    updateData.tipo = tipo;
                if (resultado !== undefined)
                    updateData.resultado = resultado;
                if (aeronaveCodigo !== undefined)
                    updateData.aeronaveCodigo = aeronaveCodigo;
                const testeAtualizado = yield testeService.atualizarTeste(id, updateData);
                return res.status(200).json(testeAtualizado);
            }
            catch (error) {
                if (error.message.includes("não encontrado")) {
                    return res.status(404).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao atualizar teste." });
            }
        });
    }
    excluir(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ erro: "ID do teste deve ser um número válido." });
                }
                yield testeService.excluirTeste(id);
                return res.status(204).send();
            }
            catch (error) {
                if (error.message.includes("não encontrado")) {
                    return res.status(404).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao excluir teste." });
            }
        });
    }
}
exports.TesteController = TesteController;
