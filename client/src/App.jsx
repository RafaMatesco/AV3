import { useState, useEffect } from 'react';
import { useApp } from './viewmodels/AppViewModel';

import Notificacao from './views/Notificacao';
import Sidebar from './views/Sidebar';
import Setup from './views/Setup';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Aeronaves from './views/Aeronaves';
import Pecas from './views/Pecas';
import Etapas from './views/Etapas';
import Testes from './views/Testes';
import Relatorios from './views/Relatorios';
import Funcionarios from './views/Funcionarios';
import MonitorPerformance from './views/MonitorPerformance';
// the one piece is real

function AppInner() {
  const vm = useApp();
  const [pagina, setPagina] = useState('dashboard');
  const { state } = vm;

  useEffect(() => {
    if (state.usuarioLogado) {
      vm.atualizarDados();
    }
  }, [pagina, state.usuarioLogado?.id]);

  // Nenhum user cadastrado
  if (state.funcionarios.length === 0) {
    return (
      <>
        <Notificacao />
        <Setup onDone={() => { }} />
      </>
    );
  }

  // Tem user, mas nao esta logado
  if (!state.usuarioLogado) {
    return (
      <>
        <Notificacao />
        <Login />
      </>
    );
  }

  // dashboard apos login
  const AcessoNegado = ({ modulo }) => (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ padding: 48, color: '#888' }}>
      <h5 className="mt-3 fw-semibold">Acesso restrito</h5>
      <p className="text-muted small">Você não tem permissão para acessar <strong>{modulo}</strong>.</p>
    </div>
  );

  const paginas = {
    dashboard: <Dashboard setPagina={setPagina} />,
    aeronaves: <Aeronaves />,
    pecas: <Pecas />,
    etapas: <Etapas />,
    testes: <Testes />,
    relatorios: vm.podeAcessar('relatorios') ? <Relatorios /> : <AcessoNegado modulo="Relatórios" />,
    funcionarios: vm.podeAcessar('funcionarios') ? <Funcionarios /> : <AcessoNegado modulo="Funcionários" />,
  };
  return (
    <>
      <Notificacao />
      <div className="d-flex flex-column flex-lg-row" style={{ minHeight: '100vh' }}>
        <Sidebar paginaAtual={pagina} setPagina={setPagina} />
        <main className="flex-grow-1 overflow-auto p-3 p-md-4 bg-light">
          {paginas[pagina] || paginas.dashboard}
        </main>
      </div>
      <MonitorPerformance />
    </>
  );
}

export default AppInner;
