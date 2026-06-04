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
exports.TesteService = void 0;
exports.mapPrismaToTeste = mapPrismaToTeste;
const client_1 = require("@prisma/client");
const Teste_1 = __importDefault(require("../models/Teste"));
const prisma = new client_1.PrismaClient();
function mapPrismaToTeste(raw) {
    var _a;
    return new Teste_1.default(raw.tipo, raw.resultado, raw.id, (_a = raw.aeronaveCodigo) !== null && _a !== void 0 ? _a : undefined);
}
class TesteService {
    cadastrarTeste(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.tipo || !data.resultado || !data.aeronaveCodigo) {
                throw new Error("Dados incompletos. Todos os campos são obrigatórios.");
            }
            const aeronave = yield prisma.aeronave.findUnique({
                where: { codigo: data.aeronaveCodigo }
            });
            if (!aeronave) {
                throw new Error("Aeronave especificada não foi encontrada.");
            }
            const novo = yield prisma.teste.create({ data });
            return mapPrismaToTeste(novo);
        });
    }
    buscarTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawList = yield prisma.teste.findMany();
            return rawList.map(mapPrismaToTeste);
        });
    }
    buscarPorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield prisma.teste.findUnique({
                where: { id }
            });
            if (!raw) {
                throw new Error("Teste não encontrado.");
            }
            return mapPrismaToTeste(raw);
        });
    }
    atualizarTeste(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existe = yield prisma.teste.findUnique({
                where: { id }
            });
            if (!existe) {
                throw new Error("Teste não encontrado para atualização.");
            }
            if (data.aeronaveCodigo) {
                const aeronave = yield prisma.aeronave.findUnique({
                    where: { codigo: data.aeronaveCodigo }
                });
                if (!aeronave) {
                    throw new Error("Aeronave especificada não foi encontrada.");
                }
            }
            const atualizado = yield prisma.teste.update({
                where: { id },
                data
            });
            return mapPrismaToTeste(atualizado);
        });
    }
    excluirTeste(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existe = yield prisma.teste.findUnique({
                where: { id }
            });
            if (!existe) {
                throw new Error("Teste não encontrado para exclusão.");
            }
            yield prisma.teste.delete({
                where: { id }
            });
        });
    }
}
exports.TesteService = TesteService;
