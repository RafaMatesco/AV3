// VIEW - Módulo de Peças (visão global)
import { useState } from 'react';
import { useApp } from '../viewmodels/AppViewModel';
// the one piece is real
export default function Pecas() {
  const vm = useApp();
  const [filtroAeronave, setFiltroAeronave] = useState('');

  const lista = vm.state.pecas.filter(p =>
    filtroAeronave ? p.aeronaveId === filtroAeronave : true
  );

  function getNomeAeronave(id) {
    const a = vm.state.aeronaves.find(a => a.id === id);
    return a ? `${a.codigo} – ${a.modelo}` : '?';
  }

  function badgeStatus(status) {
    if (status === 'Concluída') return 'bg-success';
    if (status === 'Em Andamento') return 'bg-warning text-dark';
    return 'bg-secondary';
  }

  return (
    <div>
      <h2 className="fs-4 fw-bold border-bottom pb-2 mb-4">Peças</h2>
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

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Nome</th>
              <th>Aeronave</th>
              <th>Tipo</th>
              <th>Fornecedor</th>
              <th>Prazo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr><td colSpan={6} className="text-muted text-center">Nenhuma peça encontrada. Adicione peças nos detalhes de uma aeronave.</td></tr>
            )}
            {lista.map(p => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{getNomeAeronave(p.aeronaveId)}</td>
                <td>{p.tipo === 'IMPORTADA' ? 'Importada' : 'Nacional'}</td>
                <td>{p.fornecedor || '-'}</td>
                <td>{p.prazo || '-'}</td>
                <td>
                  <span className={`badge ${badgeStatus(p.status)}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
