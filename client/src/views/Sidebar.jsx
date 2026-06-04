// VIEW - Sidebar de navegação
import { useApp } from '../viewmodels/AppViewModel';
// the one piece is real
const modulos = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'aeronaves', label: 'Aeronaves' },
  { key: 'relatorios', label: 'Relatórios' },
  { key: 'funcionarios', label: 'Funcionários' },
];

const modulosAeronaves = [
  { key: 'pecas', label: 'Peças' },
  { key: 'etapas', label: 'Etapas' },
  { key: 'testes', label: 'Testes' },
];

export default function Sidebar({ paginaAtual, setPagina }) {
  const vm = useApp();
  const usuario = vm.state.usuarioLogado;

  function fecharOffcanvas() {
    const el = document.getElementById('sidebarOffcanvas');
    const instance = window.bootstrap?.Offcanvas?.getInstance(el);
    instance?.hide();
  }

  function navegar(key) {
    setPagina(key);
    fecharOffcanvas();
  }

  const NavItems = () => (
    <ul className="nav nav-pills flex-column mb-auto gap-1">
      {modulos.map(m => {
        if (m.key === 'funcionarios' && !vm.podeAcessar('funcionarios')) return null;
        if (m.key === 'relatorios' && !vm.podeAcessar('relatorios')) return null;

        if (m.key === 'aeronaves') {
          const isAtivo = paginaAtual === m.key || modulosAeronaves.some(a => a.key === paginaAtual);
          return (
            <li className="nav-item dropdown" key={m.key}>
              <button
                className={`nav-link dropdown-toggle text-start w-100 ${isAtivo ? 'active' : 'text-white'}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {m.label}
              </button>
              <ul className="dropdown-menu dropdown-menu-dark shadow w-100">
                <li>
                  <a
                    className={`dropdown-item ${paginaAtual === m.key ? 'active' : ''}`}
                    href="#"
                    onClick={e => { e.preventDefault(); navegar(m.key); }}
                  >
                    Visão Geral
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                {modulosAeronaves.map(a => (
                  <li key={a.key}>
                    <a
                      className={`dropdown-item ${paginaAtual === a.key ? 'active' : ''}`}
                      href="#"
                      onClick={e => { e.preventDefault(); navegar(a.key); }}
                    >
                      {a.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          );
        }

        return (
          <li className="nav-item" key={m.key}>
            <button
              className={`nav-link text-start w-100 ${paginaAtual === m.key ? 'active' : 'text-white'}`}
              onClick={() => navegar(m.key)}
            >
              {m.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const UserInfo = () => (
    <div>
      <div className="mb-2 lh-sm">
        <strong>{usuario?.nome}</strong><br />
        <small className="text-light opacity-75">{usuario?.permissao}</small>
      </div>
      <button className="btn btn-danger w-100" onClick={() => { vm.fazerLogout(); fecharOffcanvas(); }}>
        Sair
      </button>
    </div>
  );

  return (
    <>
      {/* ── Topbar mobile (visível só em telas < lg) ── */}
      <nav className="navbar navbar-dark bg-dark d-lg-none px-3 py-2 sticky-top">
        <span className="navbar-brand fw-bold mb-0">✈ AeroCode</span>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarOffcanvas"
          aria-controls="sidebarOffcanvas"
          aria-label="Abrir menu"
        >
          <span className="navbar-toggler-icon" />
        </button>
      </nav>

      {/* ── Offcanvas (mobile) ── */}
      <div
        className="offcanvas offcanvas-start text-white bg-dark"
        tabIndex="-1"
        id="sidebarOffcanvas"
        aria-labelledby="sidebarOffcanvasLabel"
        style={{ width: '260px' }}
      >
        <div className="offcanvas-header border-bottom border-secondary">
          <span className="offcanvas-title fw-bold fs-5" id="sidebarOffcanvasLabel">✈ AeroCode</span>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Fechar" />
        </div>
        <div className="offcanvas-body d-flex flex-column p-3">
          <NavItems />
          <hr />
          <UserInfo />
        </div>
      </div>

      {/* ── Sidebar desktop (visível só em lg+) ── */}
      <div
        className="d-none d-lg-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100"
        style={{ width: '240px' }}
      >
        <a
          href="/"
          className="d-flex align-items-center mb-3 text-white text-decoration-none"
          onClick={e => e.preventDefault()}
        >
          <span className="fs-5 fw-bold">✈ AeroCode</span>
        </a>
        <hr />
        <NavItems />
        <hr />
        <UserInfo />
      </div>
    </>
  );
}
