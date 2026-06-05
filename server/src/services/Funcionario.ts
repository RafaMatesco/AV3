import { PrismaClient } from '@prisma/client';
import FuncionarioModel from '../models/Funcionario';
// The one piece is real

const prisma = new PrismaClient();

export function mapPrismaToFuncionario(raw: any): FuncionarioModel {
  return new FuncionarioModel(
    raw.id,
    raw.nome,
    raw.telefone ?? "",
    raw.endereco ?? "",
    raw.usuario,
    raw.senha,
    raw.nivelPermissao
  );
}

export class FuncionarioService {
  async cadastrarFuncionario(data: {
    nome: string;
    telefone?: string;
    endereco?: string;
    usuario: string;
    senha: string;
    nivelPermissao: any;
  }) {
    if (!data.nome || !data.usuario || !data.senha || !data.nivelPermissao) {
      throw new Error("Dados incompletos. Campos obrigatórios: Nome, Usuário, Senha e Nível de Permissão.");
    }

    const existeUsuario = await prisma.funcionario.findUnique({
      where: { usuario: data.usuario }
    });
    if (existeUsuario) {
      throw new Error("Este nome de usuário já está em uso.");
    }

    const novo = await prisma.funcionario.create({ data });
    return mapPrismaToFuncionario(novo);
  }

  async buscarTodos() {
    const rawList = await prisma.funcionario.findMany();
    return rawList.map(mapPrismaToFuncionario);
  }

  async buscarPorId(id: number) {
    const raw = await prisma.funcionario.findUnique({
      where: { id }
    });
    if (!raw) {
      throw new Error("Funcionário não encontrado.");
    }
    return mapPrismaToFuncionario(raw);
  }

  async atualizarFuncionario(id: number, data: {
    nome?: string;
    telefone?: string;
    endereco?: string;
    usuario?: string;
    senha?: string;
    nivelPermissao?: any;
  }) {
    const existe = await prisma.funcionario.findUnique({
      where: { id }
    });
    if (!existe) {
      throw new Error("Funcionário não encontrado para atualização.");
    }

    if (data.usuario && data.usuario !== existe.usuario) {
      const existeUsuario = await prisma.funcionario.findUnique({
        where: { usuario: data.usuario }
      });
      if (existeUsuario) {
        throw new Error("Este nome de usuário já está em uso.");
      }
    }

    const atualizado = await prisma.funcionario.update({
      where: { id },
      data
    });
    return mapPrismaToFuncionario(atualizado);
  }

  async excluirFuncionario(id: number) {
    const existe = await prisma.funcionario.findUnique({
      where: { id }
    });
    if (!existe) {
      throw new Error("Funcionário não encontrado para exclusão.");
    }
    await prisma.funcionario.delete({
      where: { id }
    });
  }

  async autenticar(usuario: string, senha: any) {
    if (!usuario || !senha) {
      throw new Error("Usuário e senha são obrigatórios.");
    }

    const raw = await prisma.funcionario.findUnique({
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
  }

  async verificarSetupRequired() {
    const count = await prisma.funcionario.count();
    return count === 0;
  }
}
