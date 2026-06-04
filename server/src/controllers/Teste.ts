import { Request, Response } from 'express';
import { TesteService } from '../services/Teste';

const testeService = new TesteService();

export class TesteController {
  async criar(req: Request, res: Response) {
    try {
      const { tipo, resultado, aeronaveCodigo } = req.body;
      const novoTeste = await testeService.cadastrarTeste({
        tipo,
        resultado,
        aeronaveCodigo
      });
      return res.status(201).json(novoTeste);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message || "Erro ao cadastrar teste." });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const testes = await testeService.buscarTodos();
      return res.status(200).json(testes);
    } catch (error: any) {
      return res.status(500).json({ erro: "Erro interno ao listar testes." });
    }
  }

  async obterPorId(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ erro: "ID do teste deve ser um número válido." });
      }
      const teste = await testeService.buscarPorId(id);
      return res.status(200).json(teste);
    } catch (error: any) {
      return res.status(404).json({ erro: error.message || "Teste não encontrado." });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ erro: "ID do teste deve ser um número válido." });
      }
      const { tipo, resultado, aeronaveCodigo } = req.body;

      const updateData: any = {};
      if (tipo !== undefined) updateData.tipo = tipo;
      if (resultado !== undefined) updateData.resultado = resultado;
      if (aeronaveCodigo !== undefined) updateData.aeronaveCodigo = aeronaveCodigo;

      const testeAtualizado = await testeService.atualizarTeste(id, updateData);
      return res.status(200).json(testeAtualizado);
    } catch (error: any) {
      if (error.message.includes("não encontrado")) {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao atualizar teste." });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ erro: "ID do teste deve ser um número válido." });
      }
      await testeService.excluirTeste(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes("não encontrado")) {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao excluir teste." });
    }
  }
}
