import { TipoAeronave } from "./enums";
import Peca from "./Peca";
import Etapa from "./Etapa";
import Teste from "./Teste";
import { StatusEtapa, ResultadoTeste } from "./enums";

class Aeronave {
  public codigo: string;
  public modelo: string;
  public tipo: TipoAeronave;
  public capacidade: number;
  public alcance: number;
  public pecas: Peca[] = [];
  public etapas: Etapa[] = [];
  public testes: Teste[] = [];

  constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
    this.codigo = codigo;
    this.modelo = modelo;
    this.tipo = tipo;
    this.capacidade = capacidade;
    this.alcance = alcance;
  }

  // Retorna o progresso de conclusão da produção em porcentagem (útil para dashboards no front-end)
  get progresso(): number {
    if (this.etapas.length === 0) return 0;
    const concluidas = this.etapas.filter(e => e.status === StatusEtapa.CONCLUIDA).length;
    return Math.round((concluidas / this.etapas.length) * 100);
  }

  // Verifica se passou em todos os testes (regra para liberação da aeronave)
  get aprovada(): boolean {
    if (this.testes.length === 0) return false;
    return this.testes.every(t => t.resultado === ResultadoTeste.APROVADO);
  }
}

export default Aeronave;
