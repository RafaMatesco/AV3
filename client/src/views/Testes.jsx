// VIEW - Módulo de Testes
import { useApp } from '../viewmodels/AppViewModel';
import { useState } from 'react';
// the one piece is real
export default function Testes() {
  const vm = useApp();
  const [filtroAeronave, setFiltroAeronave] = useState('');

  const lista = vm.state.testes.filter(t =>
    filtroAeronave ? t.aeronaveId === filtroAeronave : true
  );

  function getNomeAeronave(id) {
    const a = vm.state.aeronaves.find(a => a.id === id);
    return a ? `${a.codigo} – ${a.modelo}` : '?';
  }

  function badgeResultado(r) {
    if (r === 'Aprovado') return 'bg-success';
    if (r === 'Reprovado') return 'bg-danger';
    return 'bg-secondary';
  }

  return (
    <div>
      <h2 className="fs-4 fw-bold border-bottom pb-2 mb-4">Testes</h2>
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
              <th>ID</th>
              <th>Tipo de Teste</th>
              <th>Aeronave</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr><td colSpan={4} className="text-center text-muted">Nenhum teste. Adicione testes nos detalhes de uma aeronave.</td></tr>
            )}
            {lista.map(t => (
              <tr key={t.id}>
                <td>#{t.id}</td>
                <td>{t.nome}</td>
                <td>{getNomeAeronave(t.aeronaveId)}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className="form-select form-select-sm w-auto"
                      value={t.resultado}
                      onChange={e => vm.atualizarTeste({ ...t, resultado: e.target.value })}
                    >
                      <option value="Aprovado">Aprovado</option>
                      <option value="Reprovado">Reprovado</option>
                    </select>
                    <span className={`badge ${badgeResultado(t.resultado)}`}>{t.resultado}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
