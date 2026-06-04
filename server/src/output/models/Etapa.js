"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
class Etapa {
    constructor(nome, status, prazo, aeronaveCodigo) {
        this.funcionarios = [];
        this.nome = nome;
        this.status = status;
        this.prazo = prazo;
        this.aeronaveCodigo = aeronaveCodigo;
    }
    iniciar() {
        this.status = enums_1.StatusEtapa.ANDAMENTO;
    }
    finalizar() {
        if (this.funcionarios.length === 0) {
            throw new Error("Não é possível finalizar uma etapa sem funcionários associados.");
        }
        this.status = enums_1.StatusEtapa.CONCLUIDA;
    }
    associarFuncionario(funcionario) {
        const existe = this.funcionarios.some(f => f.id === funcionario.id);
        if (existe) {
            throw new Error(`Funcionário com ID ${funcionario.id} já está associado a esta etapa.`);
        }
        this.funcionarios.push(funcionario);
    }
}
exports.default = Etapa;
