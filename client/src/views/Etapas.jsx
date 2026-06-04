// VIEW - Módulo de Etapas (Kanban)
import { useState } from 'react';
import { useApp } from '../viewmodels/AppViewModel';
import { StatusEtapa } from '../models';
// the one piece is real
const COLUNAS = [StatusEtapa.PENDENTE, StatusEtapa.EM_ANDAMENTO, StatusEtapa.CONCLUIDA];

export default function Etapas() {
  const vm = useApp();
  const podeEscrever = vm.podeEscrever();
  const [filtroAeronave, setFiltroAeronave] = useState('');

  const etapas = vm.state.etapas.filter(e =>
    filtroAeronave ? e.aeronaveId === filtroAeronave : true
  );

  function getNomeAeronave(id) {
    const a = vm.state.aeronaves.find(a => a.id === id);
    return a ? a.codigo : '?';
  }

  function getNomeFuncionario(id) {
    if (!id) return null;
    const f = vm.state.funcionarios.find(f => f.id === id);
    return f ? f.nome : null;
  }

  function moverPara(etapaId, novoStatus) {
    vm.moverEtapa(etapaId, novoStatus);
  }

  return (
    <div>
      <h2 className="fs-4 fw-bold border-bottom pb-2 mb-4">Etapas de Produção</h2>
      <div className="row mb-3">
        <div className="col-12 col-md-auto">
          <select className="form-select" value={filtroAeronave} onChange={e => setFiltroAeronave(e.target.value)}>
            <option value="">Todas as aeronaves</option>
            {vm.state.aeronaves.map(a => (
              <option key={a.id} value={a.id}>{a.codigo} – {a.modelo}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-3">
        {COLUNAS.map(col => {
          const cards = etapas.filter(e => e.status === col);
          return (
            <div key={col} className="col-12 col-md-4">
              <div className="bg-light p-3 rounded shadow-sm h-100">
                <h5 className="border-bottom pb-2 mb-3 fw-bold fs-6">{col} ({cards.length})</h5>
                {cards.map(e => (
                  <div key={e.id} className="card shadow-sm mb-2 border-0">
                    <div className="card-body p-2">
                      <h6 className="card-title fw-bold mb-1 fs-6">{e.nome}</h6>
                      <p className="card-text small text-muted mb-1">
                        Aeronave: {getNomeAeronave(e.aeronaveId)}
                        {getNomeFuncionario(e.funcionarioId) && ` • ${getNomeFuncionario(e.funcionarioId)}`}
                      </p>
                      <p className="card-text small text-secondary mb-2">{e.data}</p>
                      <div className="d-flex gap-1 flex-wrap">
                        {podeEscrever && COLUNAS.filter(c => c !== col).map(c => (
                          <button key={c} className="btn btn-sm btn-outline-secondary py-0" style={{ fontSize: '0.75rem' }} onClick={() => moverPara(e.id, c)}>
                            → {c}
                          </button>
                        ))}
                        {podeEscrever && (
                          <button className="btn btn-sm btn-outline-danger py-0" style={{ fontSize: '0.75rem' }} onClick={() => vm.excluirEtapa(e.id)}>X</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {cards.length === 0 && (
                  <div className="text-center text-muted small mt-3">Vazio</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
