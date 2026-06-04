import { TipoTeste, ResultadoTeste } from "./enums";

class Teste {
  public id?: number;
  public tipo: TipoTeste;
  public resultado: ResultadoTeste;
  public aeronaveCodigo?: string;

  constructor(tipo: TipoTeste, resultado: ResultadoTeste, id?: number, aeronaveCodigo?: string) {
    this.tipo = tipo;
    this.resultado = resultado;
    this.id = id;
    this.aeronaveCodigo = aeronaveCodigo;
  }
}

export default Teste;
