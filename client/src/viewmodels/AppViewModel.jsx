import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import {
  podeAcessarModulo, podeEscrever, calcularProgresso, Permissao, StatusEtapa, ResultadoTeste
} from '../models';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const estadoInicial = {
  usuarioLogado: null,
  notificacao: null,
  funcionarios: [],
  aeronaves: [],
  pecas: [],
  etapas: [],
  testes: [],
  metricasPerformance: {
    last: null,
    history: []
  }
};

// Mapeadores de Banco de Dados -> Front-end
function mapFuncionarioDbToFe(f) {
  return {
    id: f.id,
    nome: f.nome,
    usuario: f.usuario,
    senha: f.senha,
    permissao: f.nivelPermissao === 'ADMINISTRADOR' ? Permissao.ADMIN : f.nivelPermissao === 'ENGENHEIRO' ? Permissao.ENGENHEIRO : Permissao.TECNICO,
    telefone: f.telefone || '',
    endereco: f.endereco || '',
    ativo: true
  };
}

function mapAeronaveDbToFe(a) {
  return {
    id: a.codigo,
    codigo: a.codigo,
    modelo: a.modelo,
    tipo: a.tipo,
    capacidade: a.capacidade,
    alcance: a.alcance,
    cliente: '',
    status: a.progresso === 100 ? 'Concluída' : 'Em Produção'
  };
}

function mapPecaDbToFe(p) {
  return {
    id: p.nome,
    nome: p.nome,
    tipo: p.tipo,
    fornecedor: p.fornecedor,
    prazo: p.prazo,
    aeronaveId: p.aeronaveCodigo,
    status: p.status === 'PRONTA' ? 'Concluída' : p.status === 'EM_TRANSPORTE' ? 'Em Andamento' : 'Pendente'
  };
}

function mapEtapaDbToFe(e) {
  return {
    id: e.nome,
    nome: e.nome,
    aeronaveId: e.aeronaveCodigo,
    funcionarioId: e.funcionarios && e.funcionarios.length > 0 ? e.funcionarios[0].id : null,
    status: e.status === 'CONCLUIDA' ? 'Concluída' : e.status === 'ANDAMENTO' ? 'Em Andamento' : 'Pendente',
    data: e.prazo
  };
}

function mapTesteDbToFe(t) {
  return {
    id: String(t.id),
    aeronaveId: t.aeronaveCodigo,
    tipo: t.tipo,
    nome: t.tipo === 'ELETRICO' ? 'Teste Elétrico' : t.tipo === 'HIDRAULICO' ? 'Teste Hidráulico' : 'Teste Aerodinâmico',
    resultado: t.resultado === 'APROVADO' ? 'Aprovado' : t.resultado === 'REPROVADO' ? 'Reprovado' : 'Pendente',
    data: ''
  };
}

function updateDados(state, action) {
  switch (action.type) {
    case 'SET_NOTIFICACAO':
      return { ...state, notificacao: action.payload };
    case 'CLEAR_NOTIFICACAO':
      return { ...state, notificacao: null };
    case 'LOGIN':
      return { ...state, usuarioLogado: action.payload };
    case 'LOGOUT':
      return { ...state, usuarioLogado: null };

    case 'SET_INITIAL_DATA':
      return {
        ...state,
        aeronaves: action.payload.aeronaves,
        funcionarios: action.payload.funcionarios,
        pecas: action.payload.pecas,
        etapas: action.payload.etapas,
        testes: action.payload.testes
      };

    // Funcionários
    case 'ADD_FUNCIONARIO':
      return { ...state, funcionarios: [...state.funcionarios, action.payload] };
    case 'UPDATE_FUNCIONARIO':
      return { ...state, funcionarios: state.funcionarios.map(f => f.id === action.payload.id ? action.payload : f) };
    case 'TOGGLE_FUNCIONARIO':
      return { ...state, funcionarios: state.funcionarios.map(f => f.id === action.payload ? { ...f, ativo: !f.ativo } : f) };

    // Aeronaves
    case 'ADD_AERONAVE':
      return { ...state, aeronaves: [...state.aeronaves, action.payload] };
    case 'UPDATE_AERONAVE':
      return { ...state, aeronaves: state.aeronaves.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'DELETE_AERONAVE':
      return { ...state, aeronaves: state.aeronaves.filter(a => a.id !== action.payload) };

    // Peças
    case 'ADD_PECA':
      return { ...state, pecas: [...state.pecas, action.payload] };
    case 'UPDATE_PECA':
      return { ...state, pecas: state.pecas.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PECA':
      return { ...state, pecas: state.pecas.filter(p => p.id !== action.payload) };

    // Etapas
    case 'ADD_ETAPA':
      return { ...state, etapas: [...state.etapas, action.payload] };
    case 'UPDATE_ETAPA':
      return { ...state, etapas: state.etapas.map(e => e.id === action.payload.id ? action.payload : e) };
    case 'DELETE_ETAPA':
      return { ...state, etapas: state.etapas.filter(e => e.id !== action.payload) };

    // Testes
    case 'ADD_TESTE':
      return { ...state, testes: [...state.testes, action.payload] };
    case 'UPDATE_TESTE':
      return { ...state, testes: state.testes.map(t => t.id === action.payload.id ? action.payload : t) };

    // Métricas
    case 'ADD_METRICA':
      return {
        ...state,
        metricasPerformance: {
          last: action.payload,
          history: [action.payload, ...state.metricasPerformance.history].slice(0, 50)
        }
      };
    case 'CLEAR_METRICAS':
      return {
        ...state,
        metricasPerformance: {
          last: null,
          history: []
        }
      };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useReducer(updateDados, estadoInicial);

  const notificar = useCallback((tipo, mensagem) => {
    setState({ type: 'SET_NOTIFICACAO', payload: { tipo, mensagem } });
    setTimeout(() => setState({ type: 'CLEAR_NOTIFICACAO' }), 3500);
  }, []);

  // Fetch inicial
  const atualizarDados = useCallback(async () => {
    try {
      const timedFetch = async (endpoint) => {
        const start = performance.now();
        const res = await fetch(`${API_URL}/${endpoint}`);
        const end = performance.now();
        const responseTime = end - start;
        const processingTime = Number(res.headers.get('x-processing-time')) || 0;
        const latency = Math.max(0, responseTime - processingTime);
        
        setState({
          type: 'ADD_METRICA',
          payload: {
            route: endpoint,
            method: 'GET',
            latency,
            processing: processingTime,
            response: responseTime,
            timestamp: Date.now()
          }
        });
        return res.json();
      };

      const [rawAeronaves, rawFuncionarios, rawPecas, rawEtapas, rawTestes] = await Promise.all([
        timedFetch('aeronaves'),
        timedFetch('funcionarios'),
        timedFetch('pecas'),
        timedFetch('etapas'),
        timedFetch('testes')
      ]);

      const aeronaves = rawAeronaves.map(mapAeronaveDbToFe);
      const funcionarios = rawFuncionarios.map(mapFuncionarioDbToFe);
      const pecas = rawPecas.map(mapPecaDbToFe);
      const etapas = rawEtapas.map(mapEtapaDbToFe);
      const testes = rawTestes.map(mapTesteDbToFe);

      setState({
        type: 'SET_INITIAL_DATA',
        payload: { aeronaves, funcionarios, pecas, etapas, testes }
      });
    } catch (error) {
      console.error("Erro ao carregar dados do servidor:", error);
    }
  }, []);

  useEffect(() => {
    atualizarDados();
  }, [atualizarDados]);

  // Função padrão para requisições
  async function requisicao_default(route, method, body, msgExito) {
    const startTime = performance.now();
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (body) {
        options.body = JSON.stringify(body);
      }

      const res = await fetch(`${API_URL}/${route}`, options);

      const endTime = performance.now();
      const responseTime = endTime - startTime;
      const processingTime = Number(res.headers.get('x-processing-time')) || 0;
      const latency = Math.max(0, responseTime - processingTime);

      setState({
        type: 'ADD_METRICA',
        payload: {
          route,
          method: method || 'GET',
          latency,
          processing: processingTime,
          response: responseTime,
          timestamp: Date.now()
        }
      });

      // 200 = GET ou PUT
      // 201 = POST
      // 204 = DELETE
      if (res.status === 200 || res.status === 201) {
        const data = await res.json();
        if (msgExito) notificar('sucesso', msgExito);
        return data;
      } else if (res.status === 204) {
        if (msgExito) notificar('sucesso', msgExito);
        return 'ok';
      } else {
        const errorData = await res.json();
        notificar('erro', errorData.erro || 'Ocorreu um erro.');
        return null;
      }
    } catch (e) {
      notificar('erro', 'Erro de conexão com o servidor.');
      return null;
    }
  }

  const vm = {
    state,
    atualizarDados,
    limparMetricasPerformance() {
      setState({ type: 'CLEAR_METRICAS' });
    },

    async fazerLogin(usuario, senha) {
      const data = await requisicao_default('funcionarios/login', 'POST', { usuario, senha });
      if (data) {
        setState({ type: 'LOGIN', payload: mapFuncionarioDbToFe(data) });
        return 'ok';
      }
      return 'erro';
    },

    fazerLogout() {
      setState({ type: 'LOGOUT' });
    },

    podeAcessar: (modulo) => podeAcessarModulo(state.usuarioLogado, modulo),
    podeEscrever: () => podeEscrever(state.usuarioLogado),

    async adicionarFuncionario(dados) {
      const permissao = dados.permissao || dados.nivelPermissao;
      const body = {
        nome: dados.nome,
        telefone: (dados.telefone && dados.telefone.trim() !== '') ? dados.telefone : null,
        endereco: (dados.endereco && dados.endereco.trim() !== '') ? dados.endereco : null,
        usuario: dados.usuario,
        senha: dados.senha,
        nivelPermissao: (permissao === Permissao.ADMIN || permissao === 'ADMINISTRADOR') ? 'ADMINISTRADOR' : (permissao === Permissao.ENGENHEIRO || permissao === 'ENGENHEIRO') ? 'ENGENHEIRO' : 'OPERADOR'
      };
      const res = await requisicao_default('funcionarios', 'POST', body, 'Funcionário cadastrado.');
      if (res) {
        setState({ type: 'ADD_FUNCIONARIO', payload: mapFuncionarioDbToFe(res) });
        return true;
      }
      return false;
    },

    async atualizarFuncionario(f) {
      const permissao = f.permissao || f.nivelPermissao;
      const body = {
        nome: f.nome,
        usuario: f.usuario,
        senha: f.senha,
        telefone: (f.telefone && f.telefone.trim() !== '') ? f.telefone : null,
        endereco: (f.endereco && f.endereco.trim() !== '') ? f.endereco : null,
        nivelPermissao: (permissao === Permissao.ADMIN || permissao === 'ADMINISTRADOR') ? 'ADMINISTRADOR' : (permissao === Permissao.ENGENHEIRO || permissao === 'ENGENHEIRO') ? 'ENGENHEIRO' : 'OPERADOR'
      };
      const res = await requisicao_default(`funcionarios/${f.id}`, 'PUT', body, 'Funcionário atualizado.');
      if (res) {
        setState({ type: 'UPDATE_FUNCIONARIO', payload: mapFuncionarioDbToFe(res) });
        return true;
      }
      return false;
    },

    toggleFuncionario(id) {
      setState({ type: 'TOGGLE_FUNCIONARIO', payload: id });
    },

    // Aeronaves
    async adicionarAeronave(dados) {
      const body = {
        codigo: dados.codigo,
        modelo: dados.modelo,
        tipo: dados.tipo === 'Militar' || dados.tipo === 'MILITAR' ? 'MILITAR' : 'COMERCIAL',
        capacidade: Number(dados.capacidade || 100),
        alcance: Number(dados.alcance || 2000)
      };
      const res = await requisicao_default('aeronaves', 'POST', body, 'Aeronave cadastrada.');
      if (res) {
        setState({ type: 'ADD_AERONAVE', payload: mapAeronaveDbToFe(res) });
        return true;
      }
      return false;
    },

    async atualizarAeronave(a) {
      const body = {
        modelo: a.modelo,
        tipo: a.tipo === 'Militar' || a.tipo === 'MILITAR' ? 'MILITAR' : 'COMERCIAL',
        capacidade: Number(a.capacidade || 100),
        alcance: Number(a.alcance || 2000)
      };
      const res = await requisicao_default(`aeronaves/${a.codigo}`, 'PUT', body, 'Aeronave atualizada.');
      if (res) {
        setState({ type: 'UPDATE_AERONAVE', payload: mapAeronaveDbToFe(res) });
        return true;
      }
      return false;
    },

    async excluirAeronave(id) {
      const res = await requisicao_default(`aeronaves/${id}`, 'DELETE', null, 'Aeronave excluída.');
      if (res) {
        setState({ type: 'DELETE_AERONAVE', payload: id });
        return true;
      }
      return false;
    },

    // Peças
    async adicionarPeca(dados) {
      const body = {
        nome: dados.nome,
        tipo: dados.tipo === 'Importada' || dados.tipo === 'IMPORTADA' ? 'IMPORTADA' : 'NACIONAL',
        prazo: (dados.prazo && dados.prazo.trim() !== '') ? dados.prazo : null,
        fornecedor: (dados.fornecedor && dados.fornecedor.trim() !== '') ? dados.fornecedor : null,
        status: dados.status === 'Concluída' ? 'PRONTA' : dados.status === 'Em Andamento' ? 'EM_TRANSPORTE' : 'EM_PRODUCAO',
        aeronaveCodigo: dados.aeronaveId
      };
      const res = await requisicao_default('pecas', 'POST', body, 'Peça cadastrada.');
      if (res) {
        setState({ type: 'ADD_PECA', payload: mapPecaDbToFe(res) });
        return true;
      }
      return false;
    },

    async atualizarPeca(p) {
      const body = {
        tipo: p.tipo === 'Importada' || p.tipo === 'IMPORTADA' ? 'IMPORTADA' : 'NACIONAL',
        prazo: (p.prazo && p.prazo.trim() !== '') ? p.prazo : null,
        fornecedor: (p.fornecedor && p.fornecedor.trim() !== '') ? p.fornecedor : null,
        status: p.status === 'Concluída' ? 'PRONTA' : p.status === 'Em Andamento' ? 'EM_TRANSPORTE' : 'EM_PRODUCAO',
        aeronaveCodigo: p.aeronaveId
      };
      const res = await requisicao_default(`pecas/${encodeURIComponent(p.nome)}`, 'PUT', body, 'Peça atualizada.');
      if (res) {
        setState({ type: 'UPDATE_PECA', payload: mapPecaDbToFe(res) });
        return true;
      }
      return false;
    },

    async excluirPeca(id) {
      const res = await requisicao_default(`pecas/${encodeURIComponent(id)}`, 'DELETE', null, 'Peça excluída.');
      if (res) {
        setState({ type: 'DELETE_PECA', payload: id });
        return true;
      }
      return false;
    },

    // Etapas
    async adicionarEtapa(dados) {
      const body = {
        nome: dados.nome,
        status: dados.status === 'Concluída' ? 'CONCLUIDA' : dados.status === 'Em Andamento' ? 'ANDAMENTO' : 'PENDENTE',
        prazo: (dados.prazo && dados.prazo.trim() !== '') ? dados.prazo : null,
        aeronaveCodigo: dados.aeronaveId
      };
      const res = await requisicao_default('etapas', 'POST', body, 'Etapa adicionada.');
      if (res) {
        let finalEtapa = mapEtapaDbToFe(res);
        if (dados.funcionarioId) {
          const assocRes = await requisicao_default(`etapas/${encodeURIComponent(dados.nome)}/funcionarios`, 'POST', { funcionarioId: dados.funcionarioId });
          if (assocRes) {
            finalEtapa = mapEtapaDbToFe(assocRes);
          }
        }
        setState({ type: 'ADD_ETAPA', payload: finalEtapa });
        return true;
      }
      return false;
    },

    async atualizarEtapa(e) {
      const body = {
        status: e.status === 'Concluída' ? 'CONCLUIDA' : e.status === 'Em Andamento' ? 'ANDAMENTO' : 'PENDENTE',
        prazo: (e.data && e.data.trim() !== '') ? e.data : (e.prazo && e.prazo.trim() !== '') ? e.prazo : null,
        aeronaveCodigo: e.aeronaveId
      };
      const res = await requisicao_default(`etapas/${encodeURIComponent(e.nome)}`, 'PUT', body, 'Etapa atualizada.');
      if (res) {
        setState({ type: 'UPDATE_ETAPA', payload: mapEtapaDbToFe(res) });
        return true;
      }
      return false;
    },

    async moverEtapa(id, novoStatus) {
      const etapa = state.etapas.find(e => e.id === id);
      if (etapa) {
        const body = {
          status: novoStatus === 'Concluída' ? 'CONCLUIDA' : novoStatus === 'Em Andamento' ? 'ANDAMENTO' : 'PENDENTE',
          prazo: (etapa.data && etapa.data.trim() !== '') ? etapa.data : (etapa.prazo && etapa.prazo.trim() !== '') ? etapa.prazo : null,
          aeronaveCodigo: etapa.aeronaveId
        };
        const res = await requisicao_default(`etapas/${encodeURIComponent(id)}`, 'PUT', body, 'Etapa atualizada.');
        if (res) {
          setState({ type: 'UPDATE_ETAPA', payload: mapEtapaDbToFe(res) });
          return true;
        }
      }
      return false;
    },

    async excluirEtapa(id) {
      const res = await requisicao_default(`etapas/${encodeURIComponent(id)}`, 'DELETE', null, 'Etapa excluída.');
      if (res) {
        setState({ type: 'DELETE_ETAPA', payload: id });
        return true;
      }
      return false;
    },

    // Testes
    async adicionarTeste(dados) {
      const body = {
        tipo: dados.tipo || (dados.nome && dados.nome.includes('Elétrico') ? 'ELETRICO' : dados.nome && dados.nome.includes('Hidráulico') ? 'HIDRAULICO' : 'AERODINAMICO'),
        resultado: dados.resultado === 'Aprovado' || dados.resultado === 'APROVADO' ? 'APROVADO' : 'REPROVADO',
        aeronaveCodigo: dados.aeronaveId
      };
      const res = await requisicao_default('testes', 'POST', body, 'Teste cadastrado.');
      if (res) {
        setState({ type: 'ADD_TESTE', payload: mapTesteDbToFe(res) });
        return true;
      }
      return false;
    },

    async atualizarTeste(t) {
      const body = {
        tipo: t.tipo || (t.nome && t.nome.includes('Elétrico') ? 'ELETRICO' : t.nome && t.nome.includes('Hidráulico') ? 'HIDRAULICO' : 'AERODINAMICO'),
        resultado: t.resultado === 'Aprovado' || t.resultado === 'APROVADO' ? 'APROVADO' : 'REPROVADO',
        aeronaveCodigo: t.aeronaveId
      };
      const res = await requisicao_default(`testes/${t.id}`, 'PUT', body, 'Resultado registrado.');
      if (res) {
        setState({ type: 'UPDATE_TESTE', payload: mapTesteDbToFe(res) });
        return true;
      }
      return false;
    },

    // Dados calculados (ViewModel processa para View)
    getProgresso: (aeronaveId) => calcularProgresso(state.etapas, aeronaveId),
    getEtapasDaAeronave: (aeronaveId) => state.etapas.filter(e => e.aeronaveId === aeronaveId),
    getPecasDaAeronave: (aeronaveId) => state.pecas.filter(p => p.aeronaveId === aeronaveId),
    getTestesDaAeronave: (aeronaveId) => state.testes.filter(t => t.aeronaveId === aeronaveId),

    // Dashboard
    getMetricas() {
      return {
        totalAeronaves: state.aeronaves.length,
        pecasPendentes: state.pecas.filter(p => p.status === 'Pendente').length,
        etapasAndamento: state.etapas.filter(e => e.status === StatusEtapa.EM_ANDAMENTO).length,
        testesReprovados: state.testes.filter(t => t.resultado === 'Reprovado').length,
        totalFuncionarios: state.funcionarios.filter(f => f.ativo).length,
      };
    },
  };

  return <AppContext.Provider value={vm}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
