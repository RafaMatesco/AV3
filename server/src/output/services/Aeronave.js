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
exports.AeronaveService = void 0;
exports.mapPrismaToAeronave = mapPrismaToAeronave;
const client_1 = require("@prisma/client");
const Aeronave_1 = __importDefault(require("../models/Aeronave"));
const Peca_1 = __importDefault(require("../models/Peca"));
const Etapa_1 = __importDefault(require("../models/Etapa"));
const Teste_1 = __importDefault(require("../models/Teste"));
const Funcionario_1 = __importDefault(require("../models/Funcionario"));
const prisma = new client_1.PrismaClient();
function mapPrismaToAeronave(raw) {
    const aeronave = new Aeronave_1.default(raw.codigo, raw.modelo, raw.tipo, raw.capacidade, raw.alcance);
    if (raw.pecas) {
        aeronave.pecas = raw.pecas.map((p) => {
            var _a;
            return new Peca_1.default(p.nome, p.tipo, p.prazo, p.fornecedor, p.status, (_a = p.aeronaveCodigo) !== null && _a !== void 0 ? _a : undefined);
        });
    }
    if (raw.etapas) {
        aeronave.etapas = raw.etapas.map((e) => {
            var _a;
            const etapa = new Etapa_1.default(e.nome, e.status, e.prazo, (_a = e.aeronaveCodigo) !== null && _a !== void 0 ? _a : undefined);
            if (e.funcionarios) {
                etapa.funcionarios = e.funcionarios.map((f) => new Funcionario_1.default(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao));
            }
            return etapa;
        });
    }
    if (raw.testes) {
        aeronave.testes = raw.testes.map((t) => {
            var _a;
            return new Teste_1.default(t.tipo, t.resultado, t.id, (_a = t.aeronaveCodigo) !== null && _a !== void 0 ? _a : undefined);
        });
    }
    return aeronave;
}
class AeronaveService {
    cadastrarAeronave(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.codigo || !data.modelo || !data.tipo || data.capacidade === undefined || data.alcance === undefined) {
                throw new Error("Dados incompletos. Todos os campos são obrigatórios.");
            }
            const existe = yield prisma.aeronave.findUnique({
                where: { codigo: data.codigo }
            });
            if (existe) {
                throw new Error("Já existe uma aeronave cadastrada com este código.");
            }
            const nova = yield prisma.aeronave.create({ data });
            return mapPrismaToAeronave(nova);
        });
    }
    buscarTodas() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawList = yield prisma.aeronave.findMany({
                include: {
                    pecas: true,
                    etapas: {
                        include: {
                            funcionarios: true
                        }
                    },
                    testes: true
                }
            });
            return rawList.map(mapPrismaToAeronave);
        });
    }
    buscarPorCodigo(codigo) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield prisma.aeronave.findUnique({
                where: { codigo },
                include: {
                    pecas: true,
                    etapas: {
                        include: {
                            funcionarios: true
                        }
                    },
                    testes: true
                }
            });
            if (!raw) {
                throw new Error("Aeronave não encontrada.");
            }
            return mapPrismaToAeronave(raw);
        });
    }
    atualizarAeronave(codigo, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existe = yield prisma.aeronave.findUnique({
                where: { codigo }
            });
            if (!existe) {
                throw new Error("Aeronave não encontrada para atualização.");
            }
            const atualizada = yield prisma.aeronave.update({
                where: { codigo },
                data
            });
            return mapPrismaToAeronave(atualizada);
        });
    }
    excluirAeronave(codigo) {
        return __awaiter(this, void 0, void 0, function* () {
            const existe = yield prisma.aeronave.findUnique({
                where: { codigo }
            });
            if (!existe) {
                throw new Error("Aeronave não encontrada para exclusão.");
            }
            yield prisma.aeronave.delete({
                where: { codigo }
            });
        });
    }
}
exports.AeronaveService = AeronaveService;
