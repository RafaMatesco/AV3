// VIEW - Dashboard (Hub Central)
import { useApp } from '../viewmodels/AppViewModel';
// the one piece is real
export default function Dashboard({ setPagina }) {
  const vm = useApp();
  const m = vm.getMetricas();

  const cards = [
    { label: 'Aeronaves', value: m.totalAeronaves, pagina: 'aeronaves' },
    { label: 'Peças Pendentes', value: m.pecasPendentes, pagina: 'pecas' },
    { label: 'Etapas Ativas', value: m.etapasAndamento, pagina: 'etapas' },
    { label: 'Testes Reprovados', value: m.testesReprovados, pagina: 'testes' },
    { label: 'Funcionários', value: m.totalFuncionarios, pagina: 'funcionarios' },
  ];

  return (
    <div>
      <h2 className="fs-4 fw-bold border-bottom pb-2 mb-4">Dashboard</h2>

      {/* Cards de métricas */}
      <div className="row g-3 mb-4">
        {cards.map(c => (
          <div key={c.label} className="col-sm-6 col-md-4 col-lg">
            <div
              className="card h-100 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => setPagina(c.pagina)}
            >
              <div className="card-body">
                <h3 className="card-title fw-bold fs-2 mb-1">{c.value}</h3>
                <p className="card-text small text-muted mb-0">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ações rápidas */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3 fs-6">Ações Rápidas</h5>
          <div className="row g-2">
            <div className="col-12 col-sm-auto">
              <button className="btn btn-primary w-100" onClick={() => setPagina('aeronaves')}>+ Nova Aeronave</button>
            </div>
            <div className="col-12 col-sm-auto">
              <button className="btn btn-outline-secondary w-100" onClick={() => setPagina('relatorios')}>Gerar Relatório</button>
            </div>
            <div className="col-12 col-sm-auto">
              <button className="btn btn-outline-secondary w-100" onClick={() => setPagina('etapas')}>Ver Etapas</button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de aeronaves com progresso */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3 fs-6">Aeronaves em Produção</h5>
          {vm.state.aeronaves.length === 0 ? (
            <p className="text-muted small mb-0">
              Nenhuma aeronave cadastrada.{' '}
              <button className="btn btn-sm btn-primary ms-2" onClick={() => setPagina('aeronaves')}>Cadastrar</button>
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Código</th>
                    <th>Modelo</th>
                    <th>Status</th>
                    <th>Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {vm.state.aeronaves.map(a => {
                    const prog = vm.getProgresso(a.id);
                    return (
                      <tr key={a.id}>
                        <td>{a.codigo}</td>
                        <td>{a.modelo}</td>
                        <td>{a.status}</td>
                        <td style={{ minWidth: 120 }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{ height: '8px' }}>
                              <div className="progress-bar bg-success" style={{ width: prog + '%' }} />
                            </div>
                            <span className="small">{prog}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
