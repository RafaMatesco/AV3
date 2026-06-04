"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const perf_hooks_1 = require("perf_hooks");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerSpec_1 = require("./swaggerSpec");
const Aeronave_1 = __importDefault(require("./routes/Aeronave"));
const Funcionario_1 = __importDefault(require("./routes/Funcionario"));
const Peca_1 = __importDefault(require("./routes/Peca"));
const Etapa_1 = __importDefault(require("./routes/Etapa"));
const Teste_1 = __importDefault(require("./routes/Teste"));
const Relatorio_1 = __importDefault(require("./routes/Relatorio"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    exposedHeaders: ['x-processing-time']
}));
app.use(express_1.default.json());
// Middleware para medir tempo de processamento no servidor
app.use((req, res, next) => {
    const start = perf_hooks_1.performance.now();
    const originalSend = res.send;
    res.send = function (body) {
        const duration = perf_hooks_1.performance.now() - start;
        res.setHeader('x-processing-time', duration.toFixed(2));
        return originalSend.call(this, body);
    };
    next();
});
// =-= ROTAS =-=
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec_1.swaggerDocument));
app.use(Aeronave_1.default);
app.use(Funcionario_1.default);
app.use(Peca_1.default);
app.use(Etapa_1.default);
app.use(Teste_1.default);
app.use(Relatorio_1.default);
app.listen(PORT, () => {
    console.log(`Servidor rodando no endereço: http://localhost:${PORT}`);
    console.log(`Documentação da API: http://localhost:${PORT}/api-docs/`);
});
