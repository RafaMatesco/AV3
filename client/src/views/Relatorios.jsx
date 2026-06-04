// VIEW - Módulo de Relatórios
import { useState } from 'react';
import { useApp } from '../viewmodels/AppViewModel';
// the one piece is real
export default function Relatorios() {
  const vm = useApp();
  const [aeronaveId, setAeronaveId] = useState('');
  const [cliente, setCliente] = useState('');
  const [dataRel, setDataRel] = useState(new Date().toISOString().slice(0, 10));
  const [preview, setPreview] = useState('');

  function gerarRelatorio() {
    const a = vm.state.aeronaves.find(x => x.id === aeronaveId);
    if (!a) return;

    const etapas = vm.getEtapasDaAeronave(aeronaveId);
    const pecas = vm.getPecasDaAeronave(aeronaveId);
    const testes = vm.getTestesDaAeronave(aeronaveId);
    const prog = vm.getProgresso(aeronaveId);

    const linhas = [
      '========================================',
      '   RELATÓRIO DE PRODUÇÃO - AEROCODE',
      '========================================',
      '',
      `Aeronave  : ${a.codigo} – ${a.modelo}`,
      `Cliente   : ${cliente || a.cliente || 'N/A'}`,
      `Status    : ${a.status}`,
      `Data      : ${dataRel}`,
      `Progresso : ${prog}%`,
      '',
      '--- ETAPAS ---',
      ...etapas.map(e => `  [${e.status}] ${e.nome} (${e.data})`),
      etapas.length === 0 ? '  Nenhuma etapa.' : '',
      '',
      '--- PEÇAS ---',
      ...pecas.map(p => `  [${p.status}] ${p.nome} – Fornecedor: ${p.fornecedor || 'N/A'}`),
      pecas.length === 0 ? '  Nenhuma peça.' : '',
      '',
      '--- TESTES ---',
      ...testes.map(t => `  [${t.resultado}] ${t.nome} (${t.data})`),
      testes.length === 0 ? '  Nenhum teste.' : '',
      '',
      '========================================',
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      `Operador : ${vm.state.usuarioLogado?.nome}`,
      '========================================',
    ];

    setPreview(linhas.join('\n'));
  }

  function imprimir() {
    window.print();
  }

  return (
    <div>
      <h2 className="fs-4 fw-bold border-bottom pb-2 mb-4">Relatórios</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-auto">
              <select className="form-select" value={aeronaveId} onChange={e => setAeronaveId(e.target.value)}>
                <option value="">Selecione uma aeronave...</option>
                {vm.state.aeronaves.map(a => (
                  <option key={a.id} value={a.id}>{a.codigo} – {a.modelo}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-auto">
              <input
                className="form-control"
                placeholder="Cliente (opcional)"
                value={cliente}
                onChange={e => setCliente(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-auto">
              <input
                className="form-control"
                type="date"
                value={dataRel}
                onChange={e => setDataRel(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-auto">
              <button className="btn btn-primary w-100" onClick={gerarRelatorio} disabled={!aeronaveId}>
                Gerar Relatório
              </button>
            </div>
            {preview && (
              <div className="col-12 col-md-auto">
                <button className="btn btn-outline-secondary w-100" onClick={imprimir}>🖨 Imprimir</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {preview ? (
        <div className="card shadow-sm">
          <div className="card-body bg-light text-dark font-monospace" style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
            {preview}
          </div>
        </div>
      ) : (
        <div className="text-muted small">Selecione uma aeronave e clique em "Gerar Relatório" para visualizar.</div>
      )}
    </div>
  );
}
