import { PrismaClient } from '@prisma/client';
import AeronaveModel from '../models/Aeronave';
import PecaModel from '../models/Peca';
import EtapaModel from '../models/Etapa';
import TesteModel from '../models/Teste';
import FuncionarioModel from '../models/Funcionario';

const prisma = new PrismaClient();

export function mapPrismaToAeronave(raw: any): AeronaveModel {
  const aeronave = new AeronaveModel(
    raw.codigo,
    raw.modelo,
    raw.tipo,
    raw.capacidade,
    raw.alcance
  );

  if (raw.pecas) {
    aeronave.pecas = raw.pecas.map((p: any) => new PecaModel(
      p.nome, p.tipo, p.prazo, p.fornecedor, p.status, p.aeronaveCodigo ?? undefined
    ));
  }

  if (raw.etapas) {
    aeronave.etapas = raw.etapas.map((e: any) => {
      const etapa = new EtapaModel(e.nome, e.status, e.prazo, e.aeronaveCodigo ?? undefined);
      if (e.funcionarios) {
        etapa.funcionarios = e.funcionarios.map((f: any) => new FuncionarioModel(
          f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivelPermissao
        ));
      }
      return etapa;
    });
  }

  if (raw.testes) {
    aeronave.testes = raw.testes.map((t: any) => new TesteModel(
      t.tipo, t.resultado, t.id, t.aeronaveCodigo ?? undefined
    ));
  }

  return aeronave;
}

export class AeronaveService {
  async cadastrarAeronave(data: { codigo: string; modelo: string; tipo: any; capacidade: number; alcance: number }) {
    if (!data.codigo || !data.modelo || !data.tipo || data.capacidade === undefined || data.alcance === undefined) {
      throw new Error("Dados incompletos. Todos os campos são obrigatórios.");
    }

    const existe = await prisma.aeronave.findUnique({
      where: { codigo: data.codigo }
    });

    if (existe) {
      throw new Error("Já existe uma aeronave cadastrada com este código.");
    }

    const nova = await prisma.aeronave.create({ data });
    return mapPrismaToAeronave(nova);
  }

  async buscarTodas() {
    const rawList = await prisma.aeronave.findMany({
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
  }

  async buscarPorCodigo(codigo: string) {
    const raw = await prisma.aeronave.findUnique({
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
  }

  async atualizarAeronave(codigo: string, data: { modelo?: string; tipo?: any; capacidade?: number; alcance?: number }) {
    const existe = await prisma.aeronave.findUnique({
      where: { codigo }
    });

    if (!existe) {
      throw new Error("Aeronave não encontrada para atualização.");
    }

    const atualizada = await prisma.aeronave.update({
      where: { codigo },
      data
    });

    return mapPrismaToAeronave(atualizada);
  }

  async excluirAeronave(codigo: string) {
    const existe = await prisma.aeronave.findUnique({
      where: { codigo }
    });

    if (!existe) {
      throw new Error("Aeronave não encontrada para exclusão.");
    }

    await prisma.aeronave.delete({
      where: { codigo }
    });
  }
}