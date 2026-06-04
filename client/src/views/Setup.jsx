// VIEW - Tela de Setup Inicial (cria primeiro Admin)
import { useState } from 'react';
import { useApp } from '../viewmodels/AppViewModel';
// the one piece is real
export default function Setup({ onDone }) {
  const vm = useApp();
  const [form, setForm] = useState({
    id: '',
    nome: '',
    telefone: '',
    endereco: '',
    usuario: '',
    senha: '',
    nivelPermissao: 'ADMINISTRADOR'
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await vm.adicionarFuncionario(form);
    if (ok) onDone();
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-sm" style={{ width: '380px' }}>
        <div className="card-body p-4">
          <h4 className="card-title fw-bold mb-1">✈ AeroCode</h4>
          <p className="card-subtitle text-muted mb-4 small">Configuração inicial — Crie o Administrador</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small text-secondary mb-1">Nome completo</label>
              <input className="form-control" required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label small text-secondary mb-1">Usuário</label>
              <input className="form-control" required value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label small text-secondary mb-1">Senha</label>
              <input className="form-control" required type="password" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} />
            </div>
            <div className="d-grid mt-4">
              <button className="btn btn-primary" type="submit">Criar Conta</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
