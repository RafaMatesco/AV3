import { Request, Response } from 'express';
import { AeronaveService } from '../services/Aeronave';
import Relatorio from '../models/Relatorio';
// The one piece is real

const aeronaveService = new AeronaveService();
const relatorioModel = new Relatorio();

export class RelatorioController {
  async gerar(req: Request, res: Response) {
    try {
      const { aeronaveCodigo, cliente, dataEntrega, formato } = req.body;
      if (!aeronaveCodigo || !cliente || !dataEntrega) {
        return res.status(400).json({ erro: "Campos obrigatórios: aeronaveCodigo, cliente, dataEntrega" });
      }

      const aeronave = await aeronaveService.buscarPorCodigo(aeronaveCodigo);

      if (formato === 'html') {
        const html = relatorioModel.gerarRelatorioHTML(aeronave, cliente, dataEntrega);
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
      } else {
        const json = relatorioModel.gerarRelatorioJSON(aeronave, cliente, dataEntrega);
        return res.status(200).json(json);
      }
    } catch (error: any) {
      if (error.message.includes("não encontrada")) {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(400).json({ erro: error.message || "Erro ao gerar relatório." });
    }
  }
}
