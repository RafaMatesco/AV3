import { PrismaClient } from '@prisma/client';
import EtapaModel from '../models/Etapa';
import { mapPrismaToFuncionario } from './Funcionario';

const prisma = new PrismaClient();

export function mapPrismaToEtapa(raw: any): EtapaModel {
  const etapa = new EtapaModel(
    raw.nome,
    raw.status,
    raw.prazo ?? "",
    raw.aeronaveCodigo ?? undefined
  );
  if (raw.funcionarios) {
    etapa.funcionarios = raw.funcionarios.map(mapPrismaToFuncionario);
  }
  return etapa;
}

export class EtapaService {
  async cadastrarEtapa(data: {
    nome: string;
    status: any;
    prazo?: string;
    aeronaveCodigo: string;
  }) {
    if (!data.nome || !data.status || !data.aeronaveCodigo) {
      throw new Error("Dados incompletos. Campos obrigatórios: Nome, Status e Código da Aeronave.");
    }

    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: data.aeronaveCodigo },
      include: { etapas: true }
    });
    if (!aeronave) {
      throw new Error("Aeronave especificada não foi encontrada.");
    }

    const existe = await prisma.etapa.findUnique({
      where: { nome: data.nome }
    });
    if (existe) {
      throw new Error("Já existe uma etapa cadastrada com este nome.");
    }

    // Se a nova etapa já for criada como CONCLUIDA
    if (data.status === 'CONCLUIDA') {
      throw new Error("Não é possível criar uma etapa diretamente como CONCLUIDA sem funcionários associados.");
    }

    const nova = await prisma.etapa.create({
      data,
      include: { funcionarios: true }
    });
    return mapPrismaToEtapa(nova);
  }

  async buscarTodas() {
    const rawList = await prisma.etapa.findMany({
      include: { funcionarios: true }
    });
    return rawList.map(mapPrismaToEtapa);
  }

  async buscarPorNome(nome: string) {
    const raw = await prisma.etapa.findUnique({
      where: { nome },
      include: { funcionarios: true }
    });
    if (!raw) {
      throw new Error("Etapa não encontrada.");
    }
    return mapPrismaToEtapa(raw);
  }

  async atualizarEtapa(nome: string, data: {
    status?: any;
    prazo?: string;
    aeronaveCodigo?: string;
  }) {
    const existe = await prisma.etapa.findUnique({
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
      const etapasAeronave = await prisma.etapa.findMany({
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

    const atualizada = await prisma.etapa.update({
      where: { nome },
      data,
      include: { funcionarios: true }
    });
    return mapPrismaToEtapa(atualizada);
  }

  async associarFuncionario(nomeEtapa: string, funcionarioId: number) {
    const etapa = await prisma.etapa.findUnique({
      where: { nome: nomeEtapa },
      include: { funcionarios: true }
    });
    if (!etapa) {
      throw new Error("Etapa não encontrada.");
    }

    const funcionario = await prisma.funcionario.findUnique({
      where: { id: funcionarioId }
    });
    if (!funcionario) {
      throw new Error("Funcionário não encontrado.");
    }

    const jaAssociado = etapa.funcionarios.some(f => f.id === funcionarioId);
    if (jaAssociado) {
      throw new Error(`Funcionário já está associado a esta etapa.`);
    }

    const atualizada = await prisma.etapa.update({
      where: { nome: nomeEtapa },
      data: {
        funcionarios: {
          connect: { id: funcionarioId }
        }
      },
      include: { funcionarios: true }
    });

    return mapPrismaToEtapa(atualizada);
  }

  async excluirEtapa(nome: string) {
    const existe = await prisma.etapa.findUnique({
      where: { nome }
    });
    if (!existe) {
      throw new Error("Etapa não encontrada para exclusão.");
    }
    await prisma.etapa.delete({
      where: { nome }
    });
  }
}
