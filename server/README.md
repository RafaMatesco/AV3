# 🚀 Aerocode - AV3 Backend

Este é o back-end da aplicação **Aerocode (AV3)**, desenvolvido em **Node.js** com **TypeScript** e utilizando **Prisma ORM** integrado a um banco de dados **MySQL**.

Siga o passo a passo abaixo para configurar e rodar o projeto localmente após clonar o repositório.

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
* [MySQL Server](https://www.mysql.com/) ativo e rodando localmente

---

## 🛠️ Passo a Passo para Execução

### 1. Entrar na pasta do servidor
Após clonar o repositório, abra o terminal e navegue até a pasta `server`:
```bash
cd AV3/server
```

### 2. Instalar as dependências
Instale todas as dependências necessárias do projeto (incluindo TypeScript, Prisma e Dotenv):
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Na raiz da pasta `server`, crie ou edite o arquivo `.env` para apontar para a sua instância do banco de dados MySQL. 

O arquivo deve conter a variável `DATABASE_URL` seguindo o formato:
```env
DATABASE_URL="mysql://<usuario>:<senha>@<host>:<porta>/<nome_do_banco>"
```

**Exemplo padrão (utilizando usuário `root` e senha `root`):**
```env
DATABASE_URL="mysql://root:root@localhost:3306/av3"
```
*(Nota: Certifique-se de que o banco de dados `av3` ou o nome que definiu exista no seu MySQL, ou que o usuário tenha permissão para criá-lo).*

### 4. Sincronizar o Banco de Dados com o Prisma
Com a URL de conexão configurada, execute o comando abaixo para criar fisicamente as tabelas e relacionamentos definidos no arquivo `schema.prisma` diretamente no seu banco de dados MySQL:
```bash
npx prisma db push
```

Em seguida, gere o cliente do Prisma para garantir que as tipagens automáticas do TypeScript estejam sincronizadas com o seu esquema:
```bash
npx prisma generate
```

*(Opcional)* Se quiser visualizar as tabelas e gerenciar os registros do banco de dados graficamente no navegador, você pode rodar o Prisma Studio:
```bash
npx prisma studio
```

### 5. Compilar o Código TypeScript
Como o projeto está escrito em TypeScript, os arquivos sob a pasta `src/` precisam ser compilados em JavaScript para a pasta `src/output/`. Para fazer isso, execute:
```bash
npm run build
```

### 6. Executar o Servidor
Com os arquivos compilados com sucesso, inicie o servidor rodando:
```bash
npm start
```

Você deverá ver a mensagem indicando que o servidor está em execução:
```text
Server running...
```

---

## 📂 Estrutura de Comandos Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm install` | Instala todas as dependências do projeto. |
| `npx prisma db push` | Sincroniza e cria as tabelas no MySQL com base no `schema.prisma`. |
| `npx prisma generate` | Gera o Prisma Client com tipagens TypeScript atualizadas. |
| `npx prisma studio` | Abre a interface web do Prisma para gerenciar o banco de dados. |
| `npm run build` | Transpila o código TypeScript de `src/` para JavaScript em `src/output/`. |
| `npm start` | Inicia o servidor backend a partir da pasta de saída compilada. |
