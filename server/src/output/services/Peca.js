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
exports.PecaService = void 0;
exports.mapPrismaToPeca = mapPrismaToPeca;
const client_1 = require("@prisma/client");
const Peca_1 = __importDefault(require("../models/Peca"));
const prisma = new client_1.PrismaClient();
function mapPrismaToPeca(raw) {
    var _a, _b, _c;
    return new Peca_1.default(raw.nome, raw.tipo, (_a = raw.prazo) !== null && _a !== void 0 ? _a : "", (_b = raw.fornecedor) !== null && _b !== void 0 ? _b : "", raw.status, (_c = raw.aeronaveCodigo) !== null && _c !== void 0 ? _c : undefined);
}
class PecaService {
    cadastrarPeca(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.nome || !data.tipo || !data.status || !data.aeronaveCodigo) {
                throw new Error("Dados incompletos. Campos obrigatórios: Nome, Tipo, Status e Código da Aeronave.");
            }
            // Verificar se aeronave existe
            const aeronave = yield prisma.aeronave.findUnique({
                where: { codigo: data.aeronaveCodigo }
            });
            if (!aeronave) {
                throw new Error("Aeronave especificada não foi encontrada.");
            }
            // Verificar se peça com mesmo nome já existe
            const existe = yield prisma.peca.findUnique({
                where: { nome: data.nome }
            });
            if (existe) {
                throw new Error("Já existe uma peça cadastrada com este nome.");
            }
            const nova = yield prisma.peca.create({ data });
            return mapPrismaToPeca(nova);
        });
    }
    buscarTodas() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawList = yield prisma.peca.findMany();
            return rawList.map(mapPrismaToPeca);
        });
    }
    buscarPorNome(nome) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield prisma.peca.findUnique({
                where: { nome }
            });
            if (!raw) {
                throw new Error("Peça não encontrada.");
            }
            return mapPrismaToPeca(raw);
        });
    }
    atualizarPeca(nome, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existe = yield prisma.peca.findUnique({
                where: { nome }
            });
            if (!existe) {
                throw new Error("Peça não encontrada para atualização.");
            }
            if (data.aeronaveCodigo) {
                const aeronave = yield prisma.aeronave.findUnique({
                    where: { codigo: data.aeronaveCodigo }
                });
                if (!aeronave) {
                    throw new Error("Aeronave especificada não foi encontrada.");
                }
            }
            const atualizada = yield prisma.peca.update({
                where: { nome },
                data
            });
            return mapPrismaToPeca(atualizada);
        });
    }
    excluirPeca(nome) {
        return __awaiter(this, void 0, void 0, function* () {
            const existe = yield prisma.peca.findUnique({
                where: { nome }
            });
            if (!existe) {
                throw new Error("Peça não encontrada para exclusão.");
            }
            yield prisma.peca.delete({
                where: { nome }
            });
        });
    }
}
exports.PecaService = PecaService;
