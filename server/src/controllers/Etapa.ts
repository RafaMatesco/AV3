import { Request, Response } from 'express';
import { EtapaService } from '../services/Etapa';

const etapaService = new EtapaService();

export class EtapaController {
  async criar(req: Request, res: Response) {
    try {
      const { nome, status, prazo, aeronaveCodigo } = req.body;
      const novaEtapa = await etapaService.cadastrarEtapa({
        nome,
        status,
        prazo,
        aeronaveCodigo
      });
      return res.status(201).json(novaEtapa);
    } catch (error: any) {
      if (error.message.includes("Já existe")) {
        return res.status(409).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao cadastrar etapa." });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const etapas = await etapaService.buscarTodas();
      return res.status(200).json(etapas);
    } catch (error: any) {
      return res.status(500).json({ erro: "Erro interno ao listar etapas." });
    }
  }

  async obterPorNome(req: Request, res: Response) {
    try {
      const { nome } = req.params;
      const etapa = await etapaService.buscarPorNome(nome as string);
      return res.status(200).json(etapa);
    } catch (error: any) {
      return res.status(404).json({ erro: error.message || "Etapa não encontrada." });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { nome } = req.params;
      const { status, prazo, aeronaveCodigo } = req.body;

      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (prazo !== undefined) updateData.prazo = prazo;
      if (aeronaveCodigo !== undefined) updateData.aeronaveCodigo = aeronaveCodigo;

      const etapaAtualizada = await etapaService.atualizarEtapa(nome as string, updateData);
      return res.status(200).json(etapaAtualizada);
    } catch (error: any) {
      if (error.message.includes("não encontrada")) {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao atualizar etapa." });
    }
  }

  async associarFuncionario(req: Request, res: Response) {
    try {
      const { nome } = req.params;
      const { funcionarioId } = req.body;
 
      const etapaAtualizada = await etapaService.associarFuncionario(nome as string, Number(funcionarioId));
      return res.status(200).json(etapaAtualizada);
    } catch (error: any) {
      if (error.message.includes("não encontrada") || error.message.includes("não encontrado")) {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message.includes("já está associado")) {
        return res.status(409).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao associar funcionário à etapa." });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { nome } = req.params;
      await etapaService.excluirEtapa(nome as string);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes("não encontrada")) {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao excluir etapa." });
    }
  }
}
