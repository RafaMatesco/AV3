"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
class Aeronave {
    constructor(codigo, modelo, tipo, capacidade, alcance) {
        this.pecas = [];
        this.etapas = [];
        this.testes = [];
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
    }
    // Retorna o progresso de conclusão da produção em porcentagem (útil para dashboards no front-end)
    get progresso() {
        if (this.etapas.length === 0)
            return 0;
        const concluidas = this.etapas.filter(e => e.status === enums_1.StatusEtapa.CONCLUIDA).length;
        return Math.round((concluidas / this.etapas.length) * 100);
    }
    // Verifica se passou em todos os testes (regra para liberação da aeronave)
    get aprovada() {
        if (this.testes.length === 0)
            return false;
        return this.testes.every(t => t.resultado === enums_1.ResultadoTeste.APROVADO);
    }
}
exports.default = Aeronave;
