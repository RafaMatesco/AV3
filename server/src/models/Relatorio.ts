import Aeronave from "./Aeronave";
// The one piece is real

class Relatorio {
  // Gera o relatório estruturado em JSON para que o front-end possa consumir e renderizar na tela
  gerarRelatorioJSON(aeronave: Aeronave, cliente: string, dataEntrega: string) {
    return {
      titulo: `Relatório de Entrega da Aeronave ${aeronave.codigo}`,
      cliente,
      dataEntrega,
      detalhesAeronave: {
        codigo: aeronave.codigo,
        modelo: aeronave.modelo,
        tipo: aeronave.tipo,
        capacidade: aeronave.capacidade,
        alcance: aeronave.alcance,
        progresso: aeronave.progresso,
        aprovada: aeronave.aprovada,
        pecas: aeronave.pecas.map(p => ({
          nome: p.nome,
          tipo: p.tipo,
          fornecedor: p.fornecedor,
          status: p.status,
          prazo: p.prazo
        })),
        etapas: aeronave.etapas.map(e => ({
          nome: e.nome,
          status: e.status,
          prazo: e.prazo,
          funcionarios: e.funcionarios.map(f => f.nome)
        })),
        testes: aeronave.testes.map(t => ({
          tipo: t.tipo,
          resultado: t.resultado
        }))
      }
    };
  }

  // Gera o relatório em HTML estruturado caso o front-end precise exibir uma visualização de impressão/PDF direto
  gerarRelatorioHTML(aeronave: Aeronave, cliente: string, dataEntrega: string): string {
    return `
      <div class="relatorio-entrega">
        <h1>Relatório de Entrega - Aeronave ${aeronave.codigo}</h1>
        <p><strong>Cliente:</strong> ${cliente}</p>
        <p><strong>Data de Entrega:</strong> ${dataEntrega}</p>
        <hr />
        <h2>Detalhes da Aeronave</h2>
        <ul>
          <li><strong>Modelo:</strong> ${aeronave.modelo}</li>
          <li><strong>Tipo:</strong> ${aeronave.tipo}</li>
          <li><strong>Capacidade:</strong> ${aeronave.capacidade} passageiros</li>
          <li><strong>Alcance:</strong> ${aeronave.alcance} km</li>
          <li><strong>Progresso de Produção:</strong> ${aeronave.progresso}%</li>
          <li><strong>Status de Aprovação:</strong> ${aeronave.aprovada ? "Aprovada" : "Reprovada/Pendente"}</li>
        </ul>
      </div>
    `;
  }
}

export default Relatorio;
