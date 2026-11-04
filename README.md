# Desafio Tarefas

Gerenciador de tarefas feito com Next.js e tRPC. Permite listar, criar, editar e excluir tarefas com título, descrição e prioridade.

## Como executar

É preciso ter o [Node.js](https://nodejs.org) 18.18 ou superior e o npm. O projeto não usa banco de dados nem variáveis de ambiente.

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

3. Abra [http://localhost:3000](http://localhost:3000) no navegador.

Para executar a versão de produção:

```bash
npm run build
npm start
```

Para verificar o código com o ESLint, use `npm run lint`.

## Como o sistema funciona

A tela inicial lista as tarefas, da mais recente para a mais antiga. A partir dela, é possível:

- **Ver as tarefas:** a lista carrega 10 tarefas por vez, e as próximas aparecem conforme a página é rolada.
- **Criar ou editar:** o mesmo formulário atende os dois casos. O título é obrigatório (até 100 caracteres), a descrição é opcional (até 500) e a prioridade pode ser baixa, média ou alta.
- **Excluir:** a exclusão pede confirmação antes de remover a tarefa.

Front-end e back-end ficam no mesmo projeto. As páginas e os componentes React chamam uma API tRPC, servida em `/api/trpc`, e o TanStack Query cuida do cache no navegador. Um único schema Zod valida os dados no formulário e na API.

**As tarefas ficam apenas na memória do servidor.** Ao iniciar, o sistema cria 30 tarefas de exemplo, e todas as alterações se perdem quando o servidor é reiniciado.

## Estrutura

```text
src/
├── app/      # páginas, componentes e rota da API
├── lib/      # schema de validação e prioridades, usados no cliente e no servidor
└── server/   # routers tRPC e armazenamento em memória
```

As tecnologias usadas, os motivos de cada escolha e as limitações conhecidas estão em [docs/decisoes.md](docs/decisoes.md).
