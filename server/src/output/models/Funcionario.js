"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Funcionario {
    constructor(id, nome, telefone, endereco, usuario, senha, nivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }
    // Verifica credenciais do usuário
    verificarSenha(senhaFornecida) {
        return this.senha === senhaFornecida;
    }
    // Oculta a senha na serialização JSON para segurança da API (não expõe a senha ao front-end)
    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            telefone: this.telefone,
            endereco: this.endereco,
            usuario: this.usuario,
            nivelPermissao: this.nivelPermissao
        };
    }
}
exports.default = Funcionario;
