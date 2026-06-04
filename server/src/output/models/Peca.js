"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Peca {
    constructor(nome, tipo, prazo, fornecedor, status, aeronaveCodigo) {
        this.nome = nome;
        this.tipo = tipo;
        this.prazo = prazo;
        this.fornecedor = fornecedor;
        this.status = status;
        this.aeronaveCodigo = aeronaveCodigo;
    }
    atualizarStatus(novoStatus) {
        this.status = novoStatus;
    }
}
exports.default = Peca;
