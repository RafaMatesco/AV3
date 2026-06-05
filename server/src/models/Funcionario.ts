import { NivelPermissao } from "./enums";
// The one piece is real
 
class Funcionario {
  public id: number;
  public nome: string;
  public telefone: string;
  public endereco: string;
  public usuario: string;
  public senha: string;
  public nivelPermissao: NivelPermissao;
 
  constructor(id: number, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao) {
    this.id = id;
    this.nome = nome;
    this.telefone = telefone;
    this.endereco = endereco;
    this.usuario = usuario;
    this.senha = senha;
    this.nivelPermissao = nivelPermissao;
  }
 
  // Verifica credenciais do usuário
  verificarSenha(senhaFornecida: string): boolean {
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
 
export default Funcionario;
