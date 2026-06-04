import { PrismaClient } from '@prisma/client';
import PecaModel from '../models/Peca';

const prisma = new PrismaClient();

export function mapPrismaToPeca(raw: any): PecaModel {
  return new PecaModel(
    raw.nome,
    raw.tipo,
    raw.prazo ?? "",
    raw.fornecedor ?? "",
    raw.status,
    raw.aeronaveCodigo ?? undefined
  );
}

export class PecaService {
  async cadastrarPeca(data: {
    nome: string;
    tipo: any;
    prazo?: string;
    fornecedor?: string;
    status: any;
    aeronaveCodigo: string;
  }) {
    if (!data.nome || !data.tipo || !data.status || !data.aeronaveCodigo) {
      throw new Error("Dados incompletos. Campos obrigatórios: Nome, Tipo, Status e Código da Aeronave.");
    }

    // Verificar se aeronave existe
    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: data.aeronaveCodigo }
    });
    if (!aeronave) {
      throw new Error("Aeronave especificada não foi encontrada.");
    }

    // Verificar se peça com mesmo nome já existe
    const existe = await prisma.peca.findUnique({
      where: { nome: data.nome }
    });
    if (existe) {
      throw new Error("Já existe uma peça cadastrada com este nome.");
    }

    const nova = await prisma.peca.create({ data });
    return mapPrismaToPeca(nova);
  }

  async buscarTodas() {
    const rawList = await prisma.peca.findMany();
    return rawList.map(mapPrismaToPeca);
  }

  async buscarPorNome(nome: string) {
    const raw = await prisma.peca.findUnique({
      where: { nome }
    });
    if (!raw) {
      throw new Error("Peça não encontrada.");
    }
    return mapPrismaToPeca(raw);
  }

  async atualizarPeca(nome: string, data: {
    tipo?: any;
    prazo?: string;
    fornecedor?: string;
    status?: any;
    aeronaveCodigo?: string;
  }) {
    const existe = await prisma.peca.findUnique({
      where: { nome }
    });
    if (!existe) {
      throw new Error("Peça não encontrada para atualização.");
    }

    if (data.aeronaveCodigo) {
      const aeronave = await prisma.aeronave.findUnique({
        where: { codigo: data.aeronaveCodigo }
      });
      if (!aeronave) {
        throw new Error("Aeronave especificada não foi encontrada.");
      }
    }

    const atualizada = await prisma.peca.update({
      where: { nome },
      data
    });
    return mapPrismaToPeca(atualizada);
  }

  async excluirPeca(nome: string) {
    const existe = await prisma.peca.findUnique({
      where: { nome }
    });
    if (!existe) {
      throw new Error("Peça não encontrada para exclusão.");
    }
    await prisma.peca.delete({
      where: { nome }
    });
  }
}
