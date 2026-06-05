# Guia de Execução do Projeto (AV3)

Este guia orienta o passo a passo para configurar e executar os ambientes de **Back-end** e **Front-end** do projeto para a validação das entregas e avaliação.

---

## Pré-requisitos

Antes de iniciar, certifique-se de que sua máquina possui instalado:
- **Node.js** (versão `>= 18`)
- **MySQL Server** ativo e rodando localmente

---

## Clonando o Projeto

Abra um terminal no local desejado e faça o clone do repositório do Git:

```bash
git clone https://github.com/RafaMatesco/AV3.git
cd AV3
```

---

## 1. Executando o Back-end

Navegue até a pasta do servidor para realizar as configurações necessárias:

### Passo 1: Entrar na pasta do Back-end
```bash
cd server
```

### Passo 2: Instalar as dependências
```bash
npm install
```

### Passo 3: Configurar as Variáveis de Ambiente
Crie um arquivo `.env` dentro da pasta `server` e preencha-o com a URL de acesso ao seu banco de dados MySQL local (substituindo pelos seus dados de acesso):

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/av3"
```

### Passo 4: Criar o Banco de Dados
Crie um banco de dados vazio com o nome `av3` usando o seu SGBD de preferência (recomenda-se o **MySQL Workbench**).

### Passo 5: Sincronizar e Gerar o Prisma Client
Execute os seguintes comandos no terminal para sincronizar o arquivo `schema.prisma` com o seu banco de dados local e gerar o cliente do Prisma:

```bash
npx prisma db push
npx prisma generate
```

### Passo 6: Iniciar o servidor do Back-end
Execute o comando abaixo para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

---

## 2. Executando o Front-end

Abra um novo terminal na pasta raiz do projeto e acesse a pasta do cliente:

### Passo 1: Entrar no diretório do Front-end
```bash
cd client
```

### Passo 2: Instalar as dependências
```bash
npm install
```

### Passo 3: Iniciar o Front-end
Execute o seguinte comando para rodar o front-end em modo de desenvolvimento:

```bash
npm run dev
```

---

*Pronto! Com esses passos, o Back-end estará integrado ao banco de dados e o Front-end rodando localmente pronto para ser testado no seu navegador.*
