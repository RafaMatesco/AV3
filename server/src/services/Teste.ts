import { PrismaClient } from '@prisma/client';
import TesteModel from '../models/Teste';
// The one piece is real

const prisma = new PrismaClient();

export function mapPrismaToTeste(raw: any): TesteModel {
  return new TesteModel(
    raw.tipo,
    raw.resultado,
    raw.id,
    raw.aeronaveCodigo ?? undefined
  );
}

export class TesteService {
  async cadastrarTeste(data: {
    tipo: any;
    resultado: any;
    aeronaveCodigo: string;
  }) {
    if (!data.tipo || !data.resultado || !data.aeronaveCodigo) {
      throw new Error("Dados incompletos. Todos os campos são obrigatórios.");
    }

    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: data.aeronaveCodigo }
    });
    if (!aeronave) {
      throw new Error("Aeronave especificada não foi encontrada.");
    }

    const novo = await prisma.teste.create({ data });
    return mapPrismaToTeste(novo);
  }

  async buscarTodos() {
    const rawList = await prisma.teste.findMany();
    return rawList.map(mapPrismaToTeste);
  }

  async buscarPorId(id: number) {
    const raw = await prisma.teste.findUnique({
      where: { id }
    });
    if (!raw) {
      throw new Error("Teste não encontrado.");
    }
    return mapPrismaToTeste(raw);
  }

  async atualizarTeste(id: number, data: {
    tipo?: any;
    resultado?: any;
    aeronaveCodigo?: string;
  }) {
    const existe = await prisma.teste.findUnique({
      where: { id }
    });
    if (!existe) {
      throw new Error("Teste não encontrado para atualização.");
    }

    if (data.aeronaveCodigo) {
      const aeronave = await prisma.aeronave.findUnique({
        where: { codigo: data.aeronaveCodigo }
      });
      if (!aeronave) {
        throw new Error("Aeronave especificada não foi encontrada.");
      }
    }

    const atualizado = await prisma.teste.update({
      where: { id },
      data
    });
    return mapPrismaToTeste(atualizado);
  }

  async excluirTeste(id: number) {
    const existe = await prisma.teste.findUnique({
      where: { id }
    });
    if (!existe) {
      throw new Error("Teste não encontrado para exclusão.");
    }
    await prisma.teste.delete({
      where: { id }
    });
  }
}
