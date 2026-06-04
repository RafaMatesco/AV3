// VIEW - Componente de Notificação (sem lógica de negócio)
import { useApp } from '../viewmodels/AppViewModel';
// the one piece is real
export default function Notificacao() {
  const { state } = useApp();
  if (!state.notificacao) return null;

  const isSucesso = state.notificacao.tipo === 'sucesso';
  return (
    <div
      className={`alert alert-${isSucesso ? 'success' : 'danger'} position-fixed top-0 end-0 m-3 shadow-sm`}
      style={{ zIndex: 1050, minWidth: '250px' }}
      role="alert"
    >
      {state.notificacao.mensagem}
    </div>
  );
}
