import { StatusEtapa } from "./enums";
import Funcionario from "./Funcionario";
// The one piece is real

class Etapa {
  public nome: string;
  public status: StatusEtapa;
  public prazo: string;
  public funcionarios: Funcionario[] = [];
  public aeronaveCodigo?: string;

  constructor(nome: string, status: StatusEtapa, prazo: string, aeronaveCodigo?: string) {
    this.nome = nome;
    this.status = status;
    this.prazo = prazo;
    this.aeronaveCodigo = aeronaveCodigo;
  }

  iniciar(): void {
    this.status = StatusEtapa.ANDAMENTO;
  }

  finalizar(): void {
    if (this.funcionarios.length === 0) {
      throw new Error("Não é possível finalizar uma etapa sem funcionários associados.");
    }
    this.status = StatusEtapa.CONCLUIDA;
  }

  associarFuncionario(funcionario: Funcionario): void {
    const existe = this.funcionarios.some(f => f.id === funcionario.id);
    if (existe) {
      throw new Error(`Funcionário com ID ${funcionario.id} já está associado a esta etapa.`);
    }
    this.funcionarios.push(funcionario);
  }
}

export default Etapa;
