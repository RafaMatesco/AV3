import { Request, Response } from 'express';
import { FuncionarioService } from '../services/Funcionario';
// The one piece is real

const funcionarioService = new FuncionarioService();

export class FuncionarioController {
  async criar(req: Request, res: Response) {
    try {
      const { nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;
      const novo = await funcionarioService.cadastrarFuncionario({
        nome,
        telefone,
        endereco,
        usuario,
        senha,
        nivelPermissao
      });
      return res.status(201).json(novo);
    } catch (error: any) {
      if (error.message.includes("Já existe") || error.message.includes("em uso")) {
        return res.status(409).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao cadastrar funcionário." });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const funcionarios = await funcionarioService.buscarTodos();
      return res.status(200).json(funcionarios);
    } catch (error: any) {
      return res.status(500).json({ erro: "Erro interno ao listar funcionários." });
    }
  }

  async obterPorId(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ erro: "ID do funcionário deve ser um número válido." });
      }
      const funcionario = await funcionarioService.buscarPorId(id);
      return res.status(200).json(funcionario);
    } catch (error: any) {
      return res.status(404).json({ erro: error.message || "Funcionário não encontrado." });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ erro: "ID do funcionário deve ser um número válido." });
      }
      const { nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;

      const updateData: any = {};
      if (nome !== undefined) updateData.nome = nome;
      if (telefone !== undefined) updateData.telefone = telefone;
      if (endereco !== undefined) updateData.endereco = endereco;
      if (usuario !== undefined) updateData.usuario = usuario;
      if (senha !== undefined) updateData.senha = senha;
      if (nivelPermissao !== undefined) updateData.nivelPermissao = nivelPermissao;

      const atualizado = await funcionarioService.atualizarFuncionario(id, updateData);
      return res.status(200).json(atualizado);
    } catch (error: any) {
      if (error.message.includes("não encontrado")) {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message.includes("em uso")) {
        return res.status(409).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao atualizar funcionário." });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ erro: "ID do funcionário deve ser um número válido." });
      }
      await funcionarioService.excluirFuncionario(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes("não encontrado")) {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao excluir funcionário." });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { usuario, senha } = req.body;
      const funcionario = await funcionarioService.autenticar(usuario, senha);
      return res.status(200).json(funcionario);
    } catch (error: any) {
      return res.status(401).json({ erro: error.message || "Falha na autenticação." });
    }
  }

  async setupRequired(req: Request, res: Response) {
    try {
      const setupReq = await funcionarioService.verificarSetupRequired();
      return res.status(200).json({ setupRequired: setupReq });
    } catch (error: any) {
      return res.status(500).json({ erro: "Erro ao verificar status do sistema." });
    }
  }
}
