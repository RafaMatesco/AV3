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
exports.EtapaService = void 0;
exports.mapPrismaToEtapa = mapPrismaToEtapa;
const client_1 = require("@prisma/client");
const Etapa_1 = __importDefault(require("../models/Etapa"));
const Funcionario_1 = require("./Funcionario");
const prisma = new client_1.PrismaClient();
function mapPrismaToEtapa(raw) {
    var _a, _b;
    const etapa = new Etapa_1.default(raw.nome, raw.status, (_a = raw.prazo) !== null && _a !== void 0 ? _a : "", (_b = raw.aeronaveCodigo) !== null && _b !== void 0 ? _b : undefined);
    if (raw.funcionarios) {
        etapa.funcionarios = raw.funcionarios.map(Funcionario_1.mapPrismaToFuncionario);
    }
    return etapa;
}
class EtapaService {
    cadastrarEtapa(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.nome || !data.status || !data.aeronaveCodigo) {
                throw new Error("Dados incompletos. Campos obrigatórios: Nome, Status e Código da Aeronave.");
            }
            const aeronave = yield prisma.aeronave.findUnique({
                where: { codigo: data.aeronaveCodigo },
                include: { etapas: true }
            });
            if (!aeronave) {
                throw new Error("Aeronave especificada não foi encontrada.");
            }
            const existe = yield prisma.etapa.findUnique({
                where: { nome: data.nome }
            });
            if (existe) {
                throw new Error("Já existe uma etapa cadastrada com este nome.");
            }
            // Se a nova etapa já for criada como CONCLUIDA
            if (data.status === 'CONCLUIDA') {
                throw new Error("Não é possível criar uma etapa diretamente como CONCLUIDA sem funcionários associados.");
            }
            const nova = yield prisma.etapa.create({
                data,
                include: { funcionarios: true }
            });
            return mapPrismaToEtapa(nova);
        });
    }
    buscarTodas() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawList = yield prisma.etapa.findMany({
                include: { funcionarios: true }
            });
            return rawList.map(mapPrismaToEtapa);
        });
    }
    buscarPorNome(nome) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield prisma.etapa.findUnique({
                where: { nome },
                include: { funcionarios: true }
            });
            if (!raw) {
                throw new Error("Etapa não encontrada.");
            }
            return mapPrismaToEtapa(raw);
        });
    }
    atualizarEtapa(nome, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existe = yield prisma.etapa.findUnique({
                where: { nome },
                include: { funcionarios: true }
            });
            if (!existe) {
                throw new Error("Etapa não encontrada para atualização.");
            }
            const aeronaveCodigo = data.aeronaveCodigo || existe.aeronaveCodigo;
            if (!aeronaveCodigo) {
                throw new Error("Etapa não está associada a nenhuma aeronave.");
            }
            // Se estivermos mudando o status para CONCLUIDA
            if (data.status === 'CONCLUIDA') {
                // 1. Verificar se tem pelo menos um funcionário
                if (existe.funcionarios.length === 0) {
                    throw new Error("Não é possível finalizar uma etapa sem funcionários associados.");
                }
                // 2. Verificar regra de ordem de etapas da aeronave
                const etapasAeronave = yield prisma.etapa.findMany({
                    where: { aeronaveCodigo },
                    include: { funcionarios: true }
                });
                // Ordena por prazo tratando possíveis valores nulos
                etapasAeronave.sort((a, b) => (a.prazo || "").localeCompare(b.prazo || ""));
                const index = etapasAeronave.findIndex(e => e.nome === nome);
                if (index > 0) {
                    const anterior = etapasAeronave[index - 1];
                    if (anterior.status !== 'CONCLUIDA') {
                        throw new Error("Não é possível concluir esta etapa pois a etapa anterior não está concluída.");
                    }
                }
            }
            const atualizada = yield prisma.etapa.update({
                where: { nome },
                data,
                include: { funcionarios: true }
            });
            return mapPrismaToEtapa(atualizada);
        });
    }
    associarFuncionario(nomeEtapa, funcionarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const etapa = yield prisma.etapa.findUnique({
                where: { nome: nomeEtapa },
                include: { funcionarios: true }
            });
            if (!etapa) {
                throw new Error("Etapa não encontrada.");
            }
            const funcionario = yield prisma.funcionario.findUnique({
                where: { id: funcionarioId }
            });
            if (!funcionario) {
                throw new Error("Funcionário não encontrado.");
            }
            const jaAssociado = etapa.funcionarios.some(f => f.id === funcionarioId);
            if (jaAssociado) {
                throw new Error(`Funcionário já está associado a esta etapa.`);
            }
            const atualizada = yield prisma.etapa.update({
                where: { nome: nomeEtapa },
                data: {
                    funcionarios: {
                        connect: { id: funcionarioId }
                    }
                },
                include: { funcionarios: true }
            });
            return mapPrismaToEtapa(atualizada);
        });
    }
    excluirEtapa(nome) {
        return __awaiter(this, void 0, void 0, function* () {
            const existe = yield prisma.etapa.findUnique({
                where: { nome }
            });
            if (!existe) {
                throw new Error("Etapa não encontrada para exclusão.");
            }
            yield prisma.etapa.delete({
                where: { nome }
            });
        });
    }
}
exports.EtapaService = EtapaService;
