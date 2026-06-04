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
exports.AeronaveController = void 0;
const Aeronave_1 = require("../services/Aeronave");
const aeronaveService = new Aeronave_1.AeronaveService();
class AeronaveController {
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { codigo, modelo, tipo, capacidade, alcance } = req.body;
                const novaAeronave = yield aeronaveService.cadastrarAeronave({
                    codigo,
                    modelo,
                    tipo,
                    capacidade: capacidade !== undefined ? Number(capacidade) : undefined,
                    alcance: alcance !== undefined ? Number(alcance) : undefined
                });
                return res.status(201).json(novaAeronave);
            }
            catch (error) {
                if (error.message.includes("Já existe")) {
                    return res.status(409).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao cadastrar aeronave." });
            }
        });
    }
    listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aeronaves = yield aeronaveService.buscarTodas();
                return res.status(200).json(aeronaves);
            }
            catch (error) {
                return res.status(500).json({ erro: "Erro interno ao listar aeronaves." });
            }
        });
    }
    obterPorCodigo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { codigo } = req.params;
                const aeronave = yield aeronaveService.buscarPorCodigo(codigo);
                return res.status(200).json(aeronave);
            }
            catch (error) {
                return res.status(404).json({ erro: error.message || "Aeronave não encontrada." });
            }
        });
    }
    atualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { codigo } = req.params;
                const { modelo, tipo, capacidade, alcance } = req.body;
                const updateData = {};
                if (modelo !== undefined)
                    updateData.modelo = modelo;
                if (tipo !== undefined)
                    updateData.tipo = tipo;
                if (capacidade !== undefined)
                    updateData.capacidade = Number(capacidade);
                if (alcance !== undefined)
                    updateData.alcance = Number(alcance);
                const aeronaveAtualizada = yield aeronaveService.atualizarAeronave(codigo, updateData);
                return res.status(200).json(aeronaveAtualizada);
            }
            catch (error) {
                if (error.message.includes("não encontrada")) {
                    return res.status(404).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao atualizar aeronave." });
            }
        });
    }
    excluir(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { codigo } = req.params;
                yield aeronaveService.excluirAeronave(codigo);
                return res.status(204).send();
            }
            catch (error) {
                if (error.message.includes("não encontrada")) {
                    return res.status(404).json({ erro: error.message });
                }
                return res.status(400).json({ erro: error.message || "Erro ao excluir aeronave." });
            }
        });
    }
}
exports.AeronaveController = AeronaveController;
