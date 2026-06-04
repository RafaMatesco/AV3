import { Request, Response } from 'express';
import { AeronaveService } from '../services/Aeronave';

const aeronaveService = new AeronaveService();

export class AeronaveController {
  async criar(req: Request, res: Response) {
    try {
      const { codigo, modelo, tipo, capacidade, alcance } = req.body;
      const novaAeronave = await aeronaveService.cadastrarAeronave({
        codigo,
        modelo,
        tipo,
        capacidade: capacidade !== undefined ? Number(capacidade) : undefined as any,
        alcance: alcance !== undefined ? Number(alcance) : undefined as any
      });
      return res.status(201).json(novaAeronave);
    } catch (error: any) {
      if (error.message.includes("Já existe")) {
        return res.status(409).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao cadastrar aeronave." });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const aeronaves = await aeronaveService.buscarTodas();
      return res.status(200).json(aeronaves);
    } catch (error: any) {
      return res.status(500).json({ erro: "Erro interno ao listar aeronaves." });
    }
  }

  async obterPorCodigo(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const aeronave = await aeronaveService.buscarPorCodigo(codigo as string);
      return res.status(200).json(aeronave);
    } catch (error: any) {
      return res.status(404).json({ erro: error.message || "Aeronave não encontrada." });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const { modelo, tipo, capacidade, alcance } = req.body;

      const updateData: any = {};
      if (modelo !== undefined) updateData.modelo = modelo;
      if (tipo !== undefined) updateData.tipo = tipo;
      if (capacidade !== undefined) updateData.capacidade = Number(capacidade);
      if (alcance !== undefined) updateData.alcance = Number(alcance);

      const aeronaveAtualizada = await aeronaveService.atualizarAeronave(codigo as string, updateData);
      return res.status(200).json(aeronaveAtualizada);
    } catch (error: any) {
      if (error.message.includes("não encontrada")) {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao atualizar aeronave." });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      await aeronaveService.excluirAeronave(codigo as string);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes("não encontrada")) {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao excluir aeronave." });
    }
  }
}