# Guia de Conexão: Front-end (React) & Back-end (Express/MySQL)

Este guia prático explica, passo a passo, como conectar o seu front-end desenvolvido na AV2 (que atualmente utiliza estado local em memória via `useState` e `useReducer`) com o novo back-end robusto em TypeScript (Express, Prisma, MySQL) finalizado na AV3.

---

## 1. Compreendendo a Arquitetura de Comunicação

No front-end da AV2, todos os dados estão salvos em um estado inicial em memória (`estadoInicial` no `AppViewModel.jsx`). Quando você recarrega a página, todos os cadastros são perdidos.

Para criar um sistema web funcional e persistente:
1. **O Banco de Dados (MySQL)** se torna a única fonte da verdade (*Single Source of Truth*).
2. **O Back-end (Express + Prisma)** atua como intermediário, expondo rotas HTTP para ler e gravar dados.
3. **O Front-end (React)** realiza requisições HTTP assíncronas (*Requests*) para o back-end usando a API `fetch` do navegador ou bibliotecas como o `axios`.
4. **CORS (Cross-Origin Resource Sharing)**: Como o front-end roda em uma porta (ex: `5173` do Vite) e o back-end em outra (`3000`), o back-end precisa permitir explicitamente requisições dessa origem diferente. Isso já foi ativado no back-end com `app.use(cors())`.

---

## Passo 1: Definir a URL Base do Back-end
No front-end, crie uma constante para armazenar o endereço do seu servidor local.
Você pode definir isso no início do arquivo `AppViewModel.jsx` ou em um arquivo de configuração centralizado:

```javascript
const API_URL = 'http://localhost:3000';
```

---

## Passo 2: Adaptar o Reducer para Receber Dados da API
Atualmente, as ações do seu reducer adicionam dados manualmente gerando IDs aleatórios no client-side. Com o back-end, o banco de dados é quem gera as chaves e retorna os registros prontos.

Você deve criar ações no seu reducer (`updateDados` no `AppViewModel.jsx`) para preencher as listas com as informações obtidas do banco.

### Exemplo de Modificação no Reducer:
```javascript
function updateDados(state, action) {
  switch (action.type) {
    // Nova ação para carregar todos os dados vindos do banco
    case 'SET_INITIAL_DATA':
      return {
        ...state,
        aeronaves: action.payload.aeronaves,
        funcionarios: action.payload.funcionarios,
        pecas: action.payload.pecas,
        etapas: action.payload.etapas,
        testes: action.payload.testes
      };
      
    // Ajustar ações de adição para usar o objeto que o Back-end gravou e retornou
    case 'ADD_AERONAVE':
      return { ...state, aeronaves: [...state.aeronaves, action.payload] };
      
    case 'UPDATE_ETAPA':
      return { ...state, etapas: state.etapas.map(e => e.nome === action.payload.nome ? action.payload : e) };

    // ... manter as outras ações adaptadas
  }
}
```

---

## Passo 3: Buscar Dados Iniciais da API (Fetch Inicial)
Para que a tela não comece em branco, você precisa fazer requisições `GET` ao iniciar a aplicação para preencher o estado do React.

Podemos usar um `useEffect` dentro do seu `AppProvider` para fazer as requisições paralelas quando a página carregar:

```javascript
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

// Dentro do seu AppProvider:
useEffect(() => {
  async function carregarDadosIniciais() {
    try {
      // Buscar dados em paralelo do back-end
      const [resAero, resFunc, resPecas, resEtapas, resTestes] = await Promise.all([
        fetch(`${API_URL}/aeronaves`),
        fetch(`${API_URL}/funcionarios`),
        fetch(`${API_URL}/pecas`),
        fetch(`${API_URL}/etapas`),
        fetch(`${API_URL}/testes`)
      ]);

      const aeronaves = await resAero.json();
      const funcionarios = await resFunc.json();
      const pecas = await resPecas.json();
      const etapas = await resEtapas.json();
      const testes = await resTestes.json();

      // Despacha os dados para atualizar o estado do React com o que está no MySQL
      setState({
        type: 'SET_INITIAL_DATA',
        payload: { aeronaves, funcionarios, pecas, etapas, testes }
      });
    } catch (error) {
      console.error("Erro ao carregar dados do servidor:", error);
    }
  }

  carregarDadosIniciais();
}, []);
```

---

## Passo 4: Converter Métodos Síncronos em Assíncronos (`async/await`)
Toda chamada de API é assíncrona porque depende da rede. Portanto, as funções expostas pelo seu `AppViewModel` (como `fazerLogin`, `adicionarAeronave`, etc.) devem ser convertidas em funções assíncronas (`async`) e usar o `await fetch()`.

Veja abaixo os exemplos práticos de como fazer essa transição.

### Exemplo A: Fluxo de Autenticação (Login)
* **Como era:** Verificava as credenciais em um array local síncrono.
* **Como deve ser:** Envia uma requisição `POST` para `/funcionarios/login`. Se o servidor responder `200`, o login deu certo. Se responder `401`, exibe erro.

```javascript
async fazerLogin(usuario, senha) {
  try {
    const resposta = await fetch(`${API_URL}/funcionarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha })
    });

    if (resposta.status === 200) {
      const funcionarioLogado = await resposta.json();
      setState({ type: 'LOGIN', payload: funcionarioLogado });
      return 'ok';
    } else {
      const errorData = await resposta.json();
      notificar('erro', errorData.erro || 'Usuário ou senha inválidos.');
      return 'erro';
    }
  } catch (e) {
    notificar('erro', 'Erro de conexão com o servidor.');
    return 'erro';
  }
}
```

---

### Exemplo B: Cadastrar Nova Aeronave (Operação POST)
* **Como era:** Criava um objeto localmente e dava push no array.
* **Como deve ser:** Faz requisição `POST` enviando os dados em JSON. Se der certo, envia o objeto retornado pelo MySQL (já persistido) para o Reducer atualizar a tela.

```javascript
async adicionarAeronave(dados) {
  try {
    const resposta = await fetch(`${API_URL}/aeronaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (resposta.status === 201) {
      const novaAeronave = await resposta.json();
      setState({ type: 'ADD_AERONAVE', payload: novaAeronave });
      notificar('sucesso', 'Aeronave cadastrada no banco de dados!');
      return true;
    } else {
      const errorData = await resposta.json();
      notificar('erro', errorData.erro || 'Falha ao cadastrar aeronave.');
      return false;
    }
  } catch (e) {
    notificar('erro', 'Não foi possível conectar ao back-end.');
    return false;
  }
}
```

---

### Exemplo C: Atualização com Regras de Negócio (Atualizar Etapa)
A rota `PUT /etapas/:nome` aplica as validações complexas da FATEC (como checar se há funcionários e se a etapa cronológica anterior está concluída). O front-end só precisa capturar a resposta: se o back-end rejeitar a requisição com erro `400`, exibimos a mensagem de erro que o back-end enviou.

```javascript
async atualizarEtapa(nomeEtapa, novoStatus) {
  try {
    const resposta = await fetch(`${API_URL}/etapas/${encodeURIComponent(nomeEtapa)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus })
    });

    if (resposta.status === 200) {
      const etapaAtualizada = await resposta.json();
      setState({ type: 'UPDATE_ETAPA', payload: etapaAtualizada });
      notificar('sucesso', 'Status da etapa atualizado!');
      return true;
    } else {
      // Exibe diretamente a regra de negócio violada no back-end (ex: "Não é possível concluir esta etapa pois a etapa anterior não está concluída.")
      const errorData = await resposta.json();
      notificar('erro', errorData.erro || 'Erro ao atualizar etapa.');
      return false;
    }
  } catch (e) {
    notificar('erro', 'Erro de comunicação.');
    return false;
  }
}
```

---

### Exemplo D: Relacionamentos (Associar Funcionário a Etapa)
Para associar um funcionário à etapa, enviamos uma chamada `POST` para a rota associativa `/etapas/:nome/funcionarios` enviando o `funcionarioId`.

```javascript
async associarFuncionarioAEtapa(nomeEtapa, funcionarioId) {
  try {
    const resposta = await fetch(`${API_URL}/etapas/${encodeURIComponent(nomeEtapa)}/funcionarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ funcionarioId })
    });

    if (resposta.status === 200) {
      const etapaAtualizada = await resposta.json();
      setState({ type: 'UPDATE_ETAPA', payload: etapaAtualizada });
      notificar('sucesso', 'Funcionário associado à etapa!');
      return true;
    } else {
      const errorData = await resposta.json();
      notificar('erro', errorData.erro || 'Erro ao associar funcionário.');
      return false;
    }
  } catch (e) {
    notificar('erro', 'Erro de rede.');
    return false;
  }
}
```

---

## 5. Dicas para Garantir Desempenho e Qualidade de Código

1. **Tratamento de Exceções (`try/catch`)**: Sempre envolva requisições de rede em blocos `try/catch`. Conexões podem falhar por instabilidade de rede ou se o servidor cair.
2. **Validações Consistentes**: Mantenha as mensagens de validação vindas do back-end. Assim, se você mudar as regras de negócio no banco ou back-end futuramente, o seu front-end se adapta automaticamente sem precisar alterar o código do client.
3. **Mapeamento de Rotas com `encodeURIComponent`**: Sempre que usar nomes de entidades com espaços ou acentos como parâmetros na URL (como o nome de uma peça ou etapa), passe-os por `encodeURIComponent(nome)` para evitar quebra de rota HTTP.
4. **Estado de Carregamento (*Loading*)**: É uma boa prática adicionar uma propriedade `carregando` no estado do React para exibir spinners ou barras de progresso enquanto as requisições iniciais ou de login estão sendo processadas, fornecendo um feedback visual rico ao usuário.
