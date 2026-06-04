// VIEW - Módulo de Aeronaves (com tabs: Peças, Etapas, Testes)
import { useState } from 'react';
import { useApp } from '../viewmodels/AppViewModel';
import Modal from './Modal';
// the one piece is real
function FormAeronave({ inicial, onSalvar, onCancelar }) {
  const [form, setForm] = useState(inicial || { codigo: '', modelo: '', tipo: 'COMERCIAL', capacidade: '', alcance: '', cliente: '', status: 'Em Produção' });
  return (
    <form onSubmit={e => { e.preventDefault(); onSalvar(form); }}>
      <div className="mb-3">
        <label className="form-label">Código</label>
        <input className="form-control" required disabled={!!inicial} value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Modelo</label>
        <input className="form-control" required value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <select className="form-select" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
          <option value="COMERCIAL">Comercial</option>
          <option value="MILITAR">Militar</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Capacidade (Passageiros)</label>
        <input className="form-control" type="number" required value={form.capacidade} onChange={e => setForm({ ...form, capacidade: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Alcance (km)</label>
        <input className="form-control" type="number" required value={form.alcance} onChange={e => setForm({ ...form, alcance: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Cliente</label>
        <input className="form-control" value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Status</label>
        <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option>Em Produção</option>
          <option>Concluída</option>
          <option>Suspensa</option>
        </select>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button className="btn btn-secondary" type="button" onClick={onCancelar}>Cancelar</button>
        <button className="btn btn-primary" type="submit">Salvar</button>
      </div>
    </form>
  );
}

export default function Aeronaves() {
  const vm = useApp();
  const podeEscrever = vm.podeEscrever();
  const [modal, setModal] = useState(null); // null | 'novo' | 'editar'
  const [selecionada, setSelecionada] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const lista = vm.state.aeronaves.filter(a =>
    a.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
    a.modelo.toLowerCase().includes(filtro.toLowerCase())
  );

  function salvar(dados) {
    if (modal === 'novo') {
      vm.adicionarAeronave(dados);
    } else {
      vm.atualizarAeronave({ ...selecionada, ...dados });
    }
    setModal(null);
    setSelecionada(null);
  }

  function excluir(id) {
    vm.excluirAeronave(id);
    if (selecionada?.id === id) setSelecionada(null);
    setConfirmDelete(null);
  }

  return (
    <div>
      <h2 className="fs-4 fw-bold border-bottom pb-2 mb-4">Aeronaves</h2>

      <div className="row g-2 justify-content-between mb-3">
        <div className="col-12 col-md-auto">
          <input
            className="form-control"
            placeholder="Filtrar por código ou modelo..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
        </div>
        {podeEscrever && (
          <div className="col-12 col-md-auto">
            <button className="btn btn-primary w-100 text-nowrap" onClick={() => { setModal('novo'); setSelecionada(null); }}>
              + Nova Aeronave
            </button>
          </div>
        )}
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Código</th>
              <th>Modelo</th>
              <th>Tipo</th>
              <th>Capacidade</th>
              <th>Alcance</th>
              <th>Status</th>
              <th>Progresso</th>
              {podeEscrever && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr><td colSpan={8} className="text-center text-muted">Nenhuma aeronave encontrada.</td></tr>
            )}
            {lista.map(a => {
              const prog = vm.getProgresso(a.id);
              return (
                <tr key={a.id}>
                  <td>{a.codigo}</td>
                  <td>{a.modelo}</td>
                  <td>{a.tipo === 'MILITAR' ? 'Militar' : 'Comercial'}</td>
                  <td>{a.capacidade} passageiros</td>
                  <td>{a.alcance} km</td>
                  <td>{a.status}</td>
                  <td style={{ minWidth: 100 }}>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{ height: '8px' }}>
                        <div className="progress-bar bg-success" style={{ width: prog + '%' }} />
                      </div>
                      <span className="small">{prog}%</span>
                    </div>
                  </td>
                  {podeEscrever && (
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelecionada(selecionada?.id === a.id ? null : a)}>Detalhes</button>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => { setModal('editar'); setSelecionada(a); }}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirmDelete(a.id)}>Excluir</button>
                      </div>
                    </td>
                  )}
                  {!podeEscrever && (
                    <td>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelecionada(selecionada?.id === a.id ? null : a)}>Detalhes</button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Painel de detalhes */}
      {selecionada && modal !== 'editar' && (
        <Modal titulo={`Detalhes da Aeronave: ${selecionada.codigo} – ${selecionada.modelo}`} onClose={() => setSelecionada(null)} size="modal-xl">
          <DetalheAeronave aeronave={selecionada} />
        </Modal>
      )}

      {/* Modal Novo/Editar */}
      {(modal === 'novo' || modal === 'editar') && (
        <Modal titulo={modal === 'novo' ? 'Nova Aeronave' : 'Editar Aeronave'} onClose={() => setModal(null)}>
          <FormAeronave
            inicial={modal === 'editar' ? selecionada : null}
            onSalvar={salvar}
            onCancelar={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Confirmação de exclusão */}
      {confirmDelete && (
        <Modal titulo="Confirmar Exclusão" onClose={() => setConfirmDelete(null)}>
          <p className="mb-3 text-muted small">Tem certeza que deseja excluir esta aeronave? Esta ação removerá o registro permanentemente.</p>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={() => excluir(confirmDelete)}>Excluir</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DetalheAeronave({ aeronave }) {
  const vm = useApp();
  const podeEscrever = vm.podeEscrever();
  const [tab, setTab] = useState('pecas');
  const [modalAdd, setModalAdd] = useState(null);
  const [formPeca, setFormPeca] = useState({ nome: '', tipo: 'NACIONAL', fornecedor: '', prazo: '' });
  const [formEtapa, setFormEtapa] = useState({ nome: '', funcionarioId: '', prazo: '' });
  const [formTeste, setFormTeste] = useState({ tipo: 'ELETRICO', resultado: 'APROVADO' });

  const pecas = vm.getPecasDaAeronave(aeronave.id);
  const etapas = vm.getEtapasDaAeronave(aeronave.id);
  const testes = vm.getTestesDaAeronave(aeronave.id);

  function getNomeFuncionario(id) {
    if (!id) return null;
    const f = vm.state.funcionarios.find(f => f.id === id);
    return f ? f.nome : null;
  }

  return (
    <div>
        <ul className="nav nav-tabs flex-column flex-sm-row mb-3 gap-1">
          {['pecas', 'etapas', 'testes'].map(t => (
            <li className="nav-item flex-sm-fill text-sm-center" key={t}>
              <button
                className={`nav-link w-100 ${tab === t ? 'active bg-primary text-white border-primary' : 'text-dark'}`}
                onClick={() => setTab(t)}
                style={{ cursor: 'pointer' }}
              >
                {t === 'pecas' ? 'Peças' : t === 'etapas' ? 'Etapas' : 'Testes'}
              </button>
            </li>
          ))}
        </ul>

        {/* Tab Peças */}
        {tab === 'pecas' && (
          <div>
            {podeEscrever && (
              <div className="mb-3">
                <button className="btn btn-sm btn-primary" onClick={() => setModalAdd('peca')}>+ Adicionar Peça</button>
              </div>
            )}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light"><tr><th>Nome</th><th>Tipo</th><th>Fornecedor</th><th>Prazo</th><th>Status</th>{podeEscrever && <th>Ação</th>}</tr></thead>
                <tbody>
                  {pecas.length === 0 && <tr><td colSpan={6} className="text-muted text-center">Nenhuma peça.</td></tr>}
                  {pecas.map(p => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td>{p.tipo === 'IMPORTADA' ? 'Importada' : 'Nacional'}</td>
                      <td>{p.fornecedor || '-'}</td>
                      <td>{p.prazo || '-'}</td>
                      <td>
                        {/* Todos os perfis podem alterar o status da peça */}
                        <select
                          className="form-select form-select-sm w-auto"
                          value={p.status}
                          onChange={e => vm.atualizarPeca({ ...p, status: e.target.value })}
                        >
                          <option>Pendente</option>
                          <option>Em Andamento</option>
                          <option>Concluída</option>
                        </select>
                      </td>
                      {podeEscrever && (
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => vm.excluirPeca(p.id)}>Excluir</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Etapas */}
        {tab === 'etapas' && (
          <div>
            {podeEscrever && (
              <div className="mb-3">
                <button className="btn btn-sm btn-primary" onClick={() => setModalAdd('etapa')}>+ Adicionar Etapa</button>
              </div>
            )}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light"><tr><th>Nome</th><th>Responsável</th><th>Status</th><th>Prazo</th>{podeEscrever && <th>Ação</th>}</tr></thead>
                <tbody>
                  {etapas.length === 0 && <tr><td colSpan={podeEscrever ? 5 : 4} className="text-muted text-center">Nenhuma etapa.</td></tr>}
                  {etapas.map(e => (
                    <tr key={e.id}>
                      <td>{e.nome}</td>
                      <td>{getNomeFuncionario(e.funcionarioId) || '-'}</td>
                      <td>
                        {podeEscrever ? (
                          <select
                            className="form-select form-select-sm w-auto"
                            value={e.status}
                            onChange={ev => vm.moverEtapa(e.id, ev.target.value)}
                          >
                            <option>Pendente</option>
                            <option>Em Andamento</option>
                            <option>Concluída</option>
                          </select>
                        ) : (
                          <span className="badge bg-secondary">{e.status}</span>
                        )}
                      </td>
                      <td>{e.data || '-'}</td>
                      {podeEscrever && (
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => vm.excluirEtapa(e.id)}>Excluir</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Testes */}
        {tab === 'testes' && (
          <div>
            {podeEscrever && (
              <div className="mb-3">
                <button className="btn btn-sm btn-primary" onClick={() => setModalAdd('teste')}>+ Novo Teste</button>
              </div>
            )}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light"><tr><th>ID</th><th>Tipo de Teste</th><th>Resultado</th></tr></thead>
                <tbody>
                  {testes.length === 0 && <tr><td colSpan={3} className="text-muted text-center">Nenhum teste.</td></tr>}
                  {testes.map(t => (
                    <tr key={t.id}>
                      <td>#{t.id}</td>
                      <td>{t.nome}</td>
                      <td>
                        {podeEscrever ? (
                          <select
                            className="form-select form-select-sm w-auto"
                            value={t.resultado}
                            onChange={ev => vm.atualizarTeste({ ...t, resultado: ev.target.value })}
                          >
                            <option value="Aprovado">Aprovado</option>
                            <option value="Reprovado">Reprovado</option>
                          </select>
                        ) : (
                          <span className={`badge ${t.resultado === 'Aprovado' ? 'bg-success' : 'bg-danger'}`}>{t.resultado}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modais de adição */}
        {modalAdd === 'peca' && (
          <Modal titulo="Adicionar Peça" onClose={() => setModalAdd(null)}>
            <form onSubmit={e => {
              e.preventDefault();
              vm.adicionarPeca({ ...formPeca, aeronaveId: aeronave.id });
              setFormPeca({ nome: '', tipo: 'NACIONAL', fornecedor: '', prazo: '' });
              setModalAdd(null);
            }}>
              <div className="mb-3"><label className="form-label">Nome</label><input className="form-control" required value={formPeca.nome} onChange={e => setFormPeca({ ...formPeca, nome: e.target.value })} /></div>
              <div className="mb-3">
                <label className="form-label">Tipo</label>
                <select className="form-select" value={formPeca.tipo} onChange={e => setFormPeca({ ...formPeca, tipo: e.target.value })}>
                  <option value="NACIONAL">Nacional</option>
                  <option value="IMPORTADA">Importada</option>
                </select>
              </div>
              <div className="mb-3"><label className="form-label">Fornecedor</label><input className="form-control" value={formPeca.fornecedor} onChange={e => setFormPeca({ ...formPeca, fornecedor: e.target.value })} /></div>
              <div className="mb-3"><label className="form-label">Prazo</label><input className="form-control" type="date" value={formPeca.prazo} onChange={e => setFormPeca({ ...formPeca, prazo: e.target.value })} /></div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button className="btn btn-secondary" type="button" onClick={() => setModalAdd(null)}>Cancelar</button>
                <button className="btn btn-primary" type="submit">Salvar</button>
              </div>
            </form>
          </Modal>
        )}

        {modalAdd === 'etapa' && (
          <Modal titulo="Adicionar Etapa" onClose={() => setModalAdd(null)}>
            <form onSubmit={e => {
              e.preventDefault();
              vm.adicionarEtapa({ ...formEtapa, aeronaveId: aeronave.id });
              setFormEtapa({ nome: '', funcionarioId: '', prazo: '' });
              setModalAdd(null);
            }}>
              <div className="mb-3"><label className="form-label">Nome da Etapa</label><input className="form-control" required value={formEtapa.nome} onChange={e => setFormEtapa({ ...formEtapa, nome: e.target.value })} /></div>
              <div className="mb-3">
                <label className="form-label">Funcionário Responsável</label>
                <select className="form-select" value={formEtapa.funcionarioId} onChange={e => setFormEtapa({ ...formEtapa, funcionarioId: e.target.value })}>
                  <option value="">-- Nenhum --</option>
                  {vm.state.funcionarios.filter(f => f.ativo).map(f => (
                    <option key={f.id} value={f.id}>{f.nome}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3"><label className="form-label">Prazo</label><input className="form-control" type="date" value={formEtapa.prazo} onChange={e => setFormEtapa({ ...formEtapa, prazo: e.target.value })} /></div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button className="btn btn-secondary" type="button" onClick={() => setModalAdd(null)}>Cancelar</button>
                <button className="btn btn-primary" type="submit">Salvar</button>
              </div>
            </form>
          </Modal>
        )}

        {modalAdd === 'teste' && (
          <Modal titulo="Novo Teste" onClose={() => setModalAdd(null)}>
            <form onSubmit={e => {
              e.preventDefault();
              vm.adicionarTeste({ ...formTeste, aeronaveId: aeronave.id });
              setFormTeste({ tipo: 'ELETRICO', resultado: 'APROVADO' });
              setModalAdd(null);
            }}>
              <div className="mb-3">
                <label className="form-label">Tipo de Teste</label>
                <select className="form-select" value={formTeste.tipo} onChange={e => setFormTeste({ ...formTeste, tipo: e.target.value })}>
                  <option value="ELETRICO">Elétrico</option>
                  <option value="HIDRAULICO">Hidráulico</option>
                  <option value="AERODINAMICO">Aerodinâmico</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Resultado</label>
                <select className="form-select" value={formTeste.resultado} onChange={e => setFormTeste({ ...formTeste, resultado: e.target.value })}>
                  <option value="APROVADO">Aprovado</option>
                  <option value="REPROVADO">Reprovado</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button className="btn btn-secondary" type="button" onClick={() => setModalAdd(null)}>Cancelar</button>
                <button className="btn btn-primary" type="submit">Salvar</button>
              </div>
            </form>
          </Modal>
        )}
    </div>
  );
}
