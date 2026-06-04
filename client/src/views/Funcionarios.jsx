// VIEW - Módulo de Funcionários (Admin only)
import { useState } from 'react';
import { useApp } from '../viewmodels/AppViewModel';
import { Permissao } from '../models';
import Modal from './Modal';
// the one piece is real
function FormFuncionario({ inicial, onSalvar, onCancelar }) {
  const [form, setForm] = useState(inicial || { nome: '', usuario: '', senha: '', permissao: Permissao.TECNICO, telefone: '', endereco: '' });
  return (
    <form onSubmit={e => { e.preventDefault(); onSalvar(form); }}>
      <div className="mb-3">
        <label className="form-label">Nome</label>
        <input className="form-control" required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Telefone</label>
        <input className="form-control" value={form.telefone || ''} onChange={e => setForm({ ...form, telefone: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Endereço</label>
        <input className="form-control" value={form.endereco || ''} onChange={e => setForm({ ...form, endereco: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Usuário</label>
        <input className="form-control" required value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Senha</label>
        <input className="form-control" required={!inicial} type="password" placeholder={inicial ? '(deixe em branco para manter)' : ''} value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Permissão</label>
        <select className="form-select" value={form.permissao} onChange={e => setForm({ ...form, permissao: e.target.value })}>
          {Object.values(Permissao).map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button className="btn btn-secondary" type="button" onClick={onCancelar}>Cancelar</button>
        <button className="btn btn-primary" type="submit">Salvar</button>
      </div>
    </form>
  );
}

export default function Funcionarios() {
  const vm = useApp();
  const [modal, setModal] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const [filtroPerm, setFiltroPerm] = useState('');

  const lista = vm.state.funcionarios.filter(f =>
    filtroPerm ? f.permissao === filtroPerm : true
  );

  function salvar(dados) {
    if (modal === 'novo') {
      vm.adicionarFuncionario(dados);
    } else {
      const atualizado = { ...selecionado, ...dados };
      if (!dados.senha) atualizado.senha = selecionado.senha;
      vm.atualizarFuncionario(atualizado);
    }
    setModal(null);
    setSelecionado(null);
  }

  function badgeAtivo(ativo) {
    return ativo ? <span className="badge bg-success">Ativo</span> : <span className="badge bg-secondary">Inativo</span>;
  }

  return (
    <div>
      <h2 className="fs-4 fw-bold border-bottom pb-2 mb-4">Funcionários</h2>

      <div className="row g-2 justify-content-between mb-3">
        <div className="col-12 col-md-auto">
          <select className="form-select" value={filtroPerm} onChange={e => setFiltroPerm(e.target.value)}>
            <option value="">Todas as permissões</option>
            {Object.values(Permissao).map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-auto">
          <button className="btn btn-primary w-100 text-nowrap" onClick={() => { setModal('novo'); setSelecionado(null); }}>
            + Novo Funcionário
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Nome</th>
              <th>Usuário</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Permissão</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr><td colSpan={7} className="text-center text-muted">Nenhum funcionário.</td></tr>
            )}
            {lista.map(f => (
              <tr key={f.id}>
                <td>
                  <div>{f.nome}</div>
                  <small className="text-muted font-monospace">{f.id}</small>
                </td>
                <td>{f.usuario}</td>
                <td>{f.telefone || '-'}</td>
                <td>{f.endereco || '-'}</td>
                <td>{f.permissao}</td>
                <td>{badgeAtivo(f.ativo)}</td>
                <td>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => { setModal('editar'); setSelecionado(f); }}>Editar</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => vm.toggleFuncionario(f.id)}>
                      {f.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === 'novo' || modal === 'editar') && (
        <Modal titulo={modal === 'novo' ? 'Novo Funcionário' : 'Editar Funcionário'} onClose={() => setModal(null)}>
          <FormFuncionario
            inicial={modal === 'editar' ? selecionado : null}
            onSalvar={salvar}
            onCancelar={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
