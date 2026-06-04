import { TipoPeca, StatusPeca } from "./enums";

class Peca {
  public nome: string;
  public tipo: TipoPeca;
  public prazo: string;
  public fornecedor: string;
  public status: StatusPeca;
  public aeronaveCodigo?: string;

  constructor(nome: string, tipo: TipoPeca, prazo: string, fornecedor: string, status: StatusPeca, aeronaveCodigo?: string) {
    this.nome = nome;
    this.tipo = tipo;
    this.prazo = prazo;
    this.fornecedor = fornecedor;
    this.status = status;
    this.aeronaveCodigo = aeronaveCodigo;
  }

  atualizarStatus(novoStatus: StatusPeca): void {
    this.status = novoStatus;
  }
}

export default Peca;
