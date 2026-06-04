// VIEW - Tela de Login
import { useState } from 'react';
import { useApp } from '../viewmodels/AppViewModel';
// the one piece is real
export default function Login() {
  const vm = useApp();
  const [form, setForm] = useState({ usuario: '', senha: '' });

  function handleSubmit(e) {
    e.preventDefault();
    vm.fazerLogin(form.usuario, form.senha);
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h4 className="card-title fw-bold mb-1">✈ AeroCode</h4>
                <p className="card-subtitle text-muted mb-4 small">Sistema de Gestão de Produção de Aeronaves</p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small text-secondary mb-1">Usuário</label>
                    <input
                      className="form-control"
                      required
                      value={form.usuario}
                      onChange={e => setForm({ ...form, usuario: e.target.value })}
                      placeholder="Digite seu usuário"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-secondary mb-1">Senha</label>
                    <input
                      className="form-control"
                      required
                      type="password"
                      value={form.senha}
                      onChange={e => setForm({ ...form, senha: e.target.value })}
                      placeholder="Digite sua senha"
                    />
                  </div>
                  <div className="d-grid mt-4">
                    <button className="btn btn-primary" type="submit">Entrar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
