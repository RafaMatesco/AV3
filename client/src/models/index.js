// --- Enums / Constantes ---
// the one piece is real
export const Permissao = {
  ADMIN: 'Administrador',
  ENGENHEIRO: 'Engenheiro',
  TECNICO: 'Técnico',
};

export const StatusEtapa = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em Andamento',
  CONCLUIDA: 'Concluída',
};

export const ResultadoTeste = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
};


let _idCounter = 1;
const nextId = () => String(_idCounter++);

export function criarFuncionario({ nome, usuario, senha, permissao }) {
  if (!nome || !usuario || !senha) throw new Error('Campos obrigatórios faltando.');
  return { id: nextId(), nome, usuario, senha, permissao: permissao || Permissao.TECNICO, ativo: true };
}

export function criarAeronave({ codigo, modelo, cliente }) {
  if (!codigo || !modelo) throw new Error('Código e modelo são obrigatórios.');
  return { id: nextId(), codigo, modelo, cliente: cliente || '', status: 'Em Produção' };
}

export function criarPeca({ nome, fornecedor, prazo, aeronaveId }) {
  if (!nome || !aeronaveId) throw new Error('Nome e aeronave são obrigatórios.');
  return { id: nextId(), nome, fornecedor: fornecedor || '', prazo: prazo || '', status: 'Pendente', aeronaveId };
}

export function criarEtapa({ nome, aeronaveId, funcionarioId }) {
  if (!nome || !aeronaveId) throw new Error('Nome e aeronave são obrigatórios.');
  return { id: nextId(), nome, aeronaveId, funcionarioId: funcionarioId || null, status: StatusEtapa.PENDENTE, data: new Date().toISOString().slice(0, 10) };
}

export function criarTeste({ nome, aeronaveId }) {
  if (!nome || !aeronaveId) throw new Error('Nome e aeronave são obrigatórios.');
  return { id: nextId(), nome, aeronaveId, resultado: ResultadoTeste.PENDENTE, data: new Date().toISOString().slice(0, 10) };
}


export function calcularProgresso(etapas, aeronaveId) {
  const etapasDaAeronave = etapas.filter(e => e.aeronaveId === aeronaveId);
  if (etapasDaAeronave.length === 0) return 0;
  const concluidas = etapasDaAeronave.filter(e => e.status === StatusEtapa.CONCLUIDA).length;
  return Math.round((concluidas / etapasDaAeronave.length) * 100);
}

export function autenticar(funcionarios, usuario, senha) {
  return funcionarios.find(f => f.usuario === usuario && f.senha === senha && f.ativo) || null;
}

const ACESSO_MODULO = {
  funcionarios: [Permissao.ADMIN],
  relatorios: [Permissao.ADMIN],
};

export function podeAcessarModulo(funcionario, modulo) {
  if (!funcionario) return false;
  const permitidos = ACESSO_MODULO[modulo];
  if (!permitidos) return true;
  return permitidos.includes(funcionario.permissao);
}

export function podeEscrever(funcionario) {
  if (!funcionario) return false;
  return funcionario.permissao === Permissao.ADMIN || funcionario.permissao === Permissao.ENGENHEIRO;
}
