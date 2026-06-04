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
exports.FuncionarioService = void 0;
exports.mapPrismaToFuncionario = mapPrismaToFuncionario;
const client_1 = require("@prisma/client");
const Funcionario_1 = __importDefault(require("../models/Funcionario"));
const prisma = new client_1.PrismaClient();
function mapPrismaToFuncionario(raw) {
    var _a, _b;
    return new Funcionario_1.default(raw.id, raw.nome, (_a = raw.telefone) !== null && _a !== void 0 ? _a : "", (_b = raw.endereco) !== null && _b !== void 0 ? _b : "", raw.usuario, raw.senha, raw.nivelPermissao);
}
class FuncionarioService {
    cadastrarFuncionario(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.nome || !data.usuario || !data.senha || !data.nivelPermissao) {
                throw new Error("Dados incompletos. Campos obrigatórios: Nome, Usuário, Senha e Nível de Permissão.");
            }
            const existeUsuario = yield prisma.funcionario.findUnique({
                where: { usuario: data.usuario }
            });
            if (existeUsuario) {
                throw new Error("Este nome de usuário já está em uso.");
            }
            const novo = yield prisma.funcionario.create({ data });
            return mapPrismaToFuncionario(novo);
        });
    }
    buscarTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawList = yield prisma.funcionario.findMany();
            return rawList.map(mapPrismaToFuncionario);
        });
    }
    buscarPorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield prisma.funcionario.findUnique({
                where: { id }
            });
            if (!raw) {
                throw new Error("Funcionário não encontrado.");
            }
            return mapPrismaToFuncionario(raw);
        });
    }
    atualizarFuncionario(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existe = yield prisma.funcionario.findUnique({
                where: { id }
            });
            if (!existe) {
                throw new Error("Funcionário não encontrado para atualização.");
            }
            if (data.usuario && data.usuario !== existe.usuario) {
                const existeUsuario = yield prisma.funcionario.findUnique({
                    where: { usuario: data.usuario }
                });
                if (existeUsuario) {
                    throw new Error("Este nome de usuário já está em uso.");
                }
            }
            const atualizado = yield prisma.funcionario.update({
                where: { id },
                data
            });
            return mapPrismaToFuncionario(atualizado);
        });
    }
    excluirFuncionario(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existe = yield prisma.funcionario.findUnique({
                where: { id }
            });
            if (!existe) {
                throw new Error("Funcionário não encontrado para exclusão.");
            }
            yield prisma.funcionario.delete({
                where: { id }
            });
        });
    }
    autenticar(usuario, senha) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!usuario || !senha) {
                throw new Error("Usuário e senha são obrigatórios.");
            }
            const raw = yield prisma.funcionario.findUnique({
                where: { usuario }
            });
            if (!raw) {
                throw new Error("Usuário ou senha incorretos.");
            }
            const funcionario = mapPrismaToFuncionario(raw);
            if (!funcionario.verificarSenha(senha)) {
                throw new Error("Usuário ou senha incorretos.");
            }
            return funcionario;
        });
    }
    verificarSetupRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield prisma.funcionario.count();
            return count === 0;
        });
    }
}
exports.FuncionarioService = FuncionarioService;
