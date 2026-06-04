import { Request, Response } from 'express';
import { PecaService } from '../services/Peca';

const pecaService = new PecaService();

export class PecaController {
  async criar(req: Request, res: Response) {
    try {
      const { nome, tipo, prazo, fornecedor, status, aeronaveCodigo } = req.body;
      const novaPeca = await pecaService.cadastrarPeca({
        nome,
        tipo,
        prazo,
        fornecedor,
        status,
        aeronaveCodigo
      });
      return res.status(201).json(novaPeca);
    } catch (error: any) {
      if (error.message.includes("Já existe")) {
        return res.status(409).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao cadastrar peça." });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const pecas = await pecaService.buscarTodas();
      return res.status(200).json(pecas);
    } catch (error: any) {
      return res.status(500).json({ erro: "Erro interno ao listar peças." });
    }
  }

  async obterPorNome(req: Request, res: Response) {
    try {
      const { nome } = req.params;
      const peca = await pecaService.buscarPorNome(nome as string);
      return res.status(200).json(peca);
    } catch (error: any) {
      return res.status(404).json({ erro: error.message || "Peça não encontrada." });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { nome } = req.params;
      const { tipo, prazo, fornecedor, status, aeronaveCodigo } = req.body;

      const updateData: any = {};
      if (tipo !== undefined) updateData.tipo = tipo;
      if (prazo !== undefined) updateData.prazo = prazo;
      if (fornecedor !== undefined) updateData.fornecedor = fornecedor;
      if (status !== undefined) updateData.status = status;
      if (aeronaveCodigo !== undefined) updateData.aeronaveCodigo = aeronaveCodigo;

      const pecaAtualizada = await pecaService.atualizarPeca(nome as string, updateData);
      return res.status(200).json(pecaAtualizada);
    } catch (error: any) {
      if (error.message.includes("não encontrada")) {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao atualizar peça." });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { nome } = req.params;
      await pecaService.excluirPeca(nome as string);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes("não encontrada")) {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao excluir peça." });
    }
  }
}
