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
exports.FuncionarioController = void 0;
const Funcionario_1 = require("../services/Funcionario");
const funcionarioService = new Funcionario_1.FuncionarioService();
class FuncionarioController {
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;
                const novo = yield funcionarioService.cadastrarFuncionario({
                    nome,
                    telefone,
                    endereco,
                    usuario,
                    senha,
                    nivelPermissao
                });
                return res.status(201).json(novo);
            }
            catch (error) {
                if (error.message.includes("Já existe") || error.message.includes("em uso")) {
                    return res.status(409).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao cadastrar funcionário." });
            }
        });
    }
    listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const funcionarios = yield funcionarioService.buscarTodos();
                return res.status(200).json(funcionarios);
            }
            catch (error) {
                return res.status(500).json({ erro: "Erro interno ao listar funcionários." });
            }
        });
    }
    obterPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ erro: "ID do funcionário deve ser um número válido." });
                }
                const funcionario = yield funcionarioService.buscarPorId(id);
                return res.status(200).json(funcionario);
            }
            catch (error) {
                return res.status(404).json({ erro: error.message || "Funcionário não encontrado." });
            }
        });
    }
    atualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ erro: "ID do funcionário deve ser um número válido." });
                }
                const { nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;
                const updateData = {};
                if (nome !== undefined)
                    updateData.nome = nome;
                if (telefone !== undefined)
                    updateData.telefone = telefone;
                if (endereco !== undefined)
                    updateData.endereco = endereco;
                if (usuario !== undefined)
                    updateData.usuario = usuario;
                if (senha !== undefined)
                    updateData.senha = senha;
                if (nivelPermissao !== undefined)
                    updateData.nivelPermissao = nivelPermissao;
                const atualizado = yield funcionarioService.atualizarFuncionario(id, updateData);
                return res.status(200).json(atualizado);
            }
            catch (error) {
                if (error.message.includes("não encontrado")) {
                    return res.status(404).json({ erro: error.message });
                }
                if (error.message.includes("em uso")) {
                    return res.status(409).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao atualizar funcionário." });
            }
        });
    }
    excluir(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ erro: "ID do funcionário deve ser um número válido." });
                }
                yield funcionarioService.excluirFuncionario(id);
                return res.status(204).send();
            }
            catch (error) {
                if (error.message.includes("não encontrado")) {
                    return res.status(404).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao excluir funcionário." });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { usuario, senha } = req.body;
                const funcionario = yield funcionarioService.autenticar(usuario, senha);
                return res.status(200).json(funcionario);
            }
            catch (error) {
                return res.status(401).json({ erro: error.message || "Falha na autenticação." });
            }
        });
    }
    setupRequired(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const setupReq = yield funcionarioService.verificarSetupRequired();
                return res.status(200).json({ setupRequired: setupReq });
            }
            catch (error) {
                return res.status(500).json({ erro: "Erro ao verificar status do sistema." });
            }
        });
    }
}
exports.FuncionarioController = FuncionarioController;
