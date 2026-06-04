"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultadoTeste = exports.TipoTeste = exports.NivelPermissao = exports.StatusEtapa = exports.StatusPeca = exports.TipoPeca = exports.TipoAeronave = void 0;
var TipoAeronave;
(function (TipoAeronave) {
    TipoAeronave["COMERCIAL"] = "COMERCIAL";
    TipoAeronave["MILITAR"] = "MILITAR";
})(TipoAeronave || (exports.TipoAeronave = TipoAeronave = {}));
var TipoPeca;
(function (TipoPeca) {
    TipoPeca["NACIONAL"] = "NACIONAL";
    TipoPeca["IMPORTADA"] = "IMPORTADA";
})(TipoPeca || (exports.TipoPeca = TipoPeca = {}));
var StatusPeca;
(function (StatusPeca) {
    StatusPeca["EM_PRODUCAO"] = "EM_PRODUCAO";
    StatusPeca["EM_TRANSPORTE"] = "EM_TRANSPORTE";
    StatusPeca["PRONTA"] = "PRONTA";
})(StatusPeca || (exports.StatusPeca = StatusPeca = {}));
var StatusEtapa;
(function (StatusEtapa) {
    StatusEtapa["PENDENTE"] = "PENDENTE";
    StatusEtapa["ANDAMENTO"] = "ANDAMENTO";
    StatusEtapa["CONCLUIDA"] = "CONCLUIDA";
})(StatusEtapa || (exports.StatusEtapa = StatusEtapa = {}));
var NivelPermissao;
(function (NivelPermissao) {
    NivelPermissao["ADMINISTRADOR"] = "ADMINISTRADOR";
    NivelPermissao["ENGENHEIRO"] = "ENGENHEIRO";
    NivelPermissao["OPERADOR"] = "OPERADOR";
})(NivelPermissao || (exports.NivelPermissao = NivelPermissao = {}));
var TipoTeste;
(function (TipoTeste) {
    TipoTeste["ELETRICO"] = "ELETRICO";
    TipoTeste["HIDRAULICO"] = "HIDRAULICO";
    TipoTeste["AERODINAMICO"] = "AERODINAMICO";
})(TipoTeste || (exports.TipoTeste = TipoTeste = {}));
var ResultadoTeste;
(function (ResultadoTeste) {
    ResultadoTeste["APROVADO"] = "APROVADO";
    ResultadoTeste["REPROVADO"] = "REPROVADO";
})(ResultadoTeste || (exports.ResultadoTeste = ResultadoTeste = {}));
