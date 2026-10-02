# Broadcast

Aplicação de broadcast multi-tenant feita para o teste prático da Unnichat. Cada cliente se cadastra, cria suas conexões, cadastra os contatos de cada conexão e envia mensagens para eles, na hora ou agendadas. O envio é simulado: uma mensagem agendada fica como **Agendada** e uma Cloud Function muda para **Enviada** quando chega o horário, mesmo com o app fechado.

**App publicado:** https://unnichat-broadcast.web.app

## Stack

| Camada                 | Tecnologias                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Frontend (`/web`)      | React 19, TypeScript, Vite 8, Material UI 9, Tailwind CSS 4, Jotai, React Router, React Hook Form + Zod, MUI X Date Pickers |
| Backend (`/functions`) | Cloud Functions for Firebase (2ª geração, Node 24), Firebase Admin                                                          |
| Firebase               | Authentication (e-mail/senha), Cloud Firestore, Cloud Functions, Hosting                                                    |
| Qualidade              | Vitest, Testing Library, `@firebase/rules-unit-testing`, ESLint, Prettier, Husky + Commitlint                               |

## Funcionalidades

- Cadastro e login com e-mail e senha. Cada usuário cadastrado é um cliente.
- CRUD de conexões.
- CRUD de contatos (nome e telefone) dentro de cada conexão.
- Tela de broadcast por conexão:
  - seleção de um ou mais contatos (com busca e "selecionar todos");
  - envio imediato ou agendado para data e horário futuros;
  - lista de mensagens em tempo real, com filtro entre enviadas e agendadas;
  - edição e exclusão de mensagens.
- Tudo atualiza em tempo real (`onSnapshot`): quando a function marca uma mensagem como enviada, a tela muda sozinha.

## Modelagem e isolamento entre clientes

Sem subcoleções: todas as coleções ficam na raiz e cada documento carrega o `clientId` do dono (o `uid` do Firebase Auth).

| Coleção            | Campos                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `clients/{uid}`    | `name`, `email`, `createdAt`                                                                                                               |
| `connections/{id}` | `clientId`, `name`, `createdAt`, `updatedAt`                                                                                               |
| `contacts/{id}`    | `clientId`, `connectionId`, `name`, `phone` (só dígitos), `createdAt`, `updatedAt`                                                         |
| `messages/{id}`    | `clientId`, `connectionId`, `contactIds[]`, `content`, `status` (`scheduled` \| `sent`), `scheduledAt`, `sentAt`, `createdAt`, `updatedAt` |

O isolamento é garantido no servidor pelas [regras do Firestore](firestore.rules), não só pela interface:

- **Leitura:** só é permitida quando `resource.data.clientId == request.auth.uid`. Como regras não funcionam como filtro, toda consulta do app filtra por `clientId`; uma consulta sem esse filtro é recusada.
- **Criação:** o `clientId` precisa ser o do usuário logado e, para contatos e mensagens, a conexão informada precisa pertencer a ele (`get()` na conexão).
- **Atualização:** `clientId` e `connectionId` não podem mudar (`diff().affectedKeys()`), então nada é movido para outro cliente.
- **Validação:** campos exatos (`hasAll` + `hasOnly`), tipos e tamanhos, telefone com 10 ou 11 dígitos, `createdAt`/`updatedAt`/`sentAt` iguais a `request.time` (só `serverTimestamp()`), agendamento obrigatoriamente no futuro e status restrito a `scheduled` ou `sent`.

As regras têm testes automatizados no emulador em [`tests/rules`](tests/rules), cobrindo, entre outros casos, um cliente tentando ler, alterar ou apagar dados de outro.

Os índices compostos de todas as consultas estão em [`firestore.indexes.json`](firestore.indexes.json).

## Cloud Functions

Ficam em [`/functions`](functions), na região `southamerica-east1` (a mesma do Firestore).

| Function                    | Gatilho                         | O que faz                                                                                                                                                                                                                                                   |
| --------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dispatchScheduledMessages` | A cada minuto (Cloud Scheduler) | Busca as mensagens `scheduled` com `scheduledAt` vencido e marca como `sent`, gravando `sentAt`. Usa `BulkWriter` com precondição de `updateTime`: se o usuário editou a mensagem no meio do caminho, a escrita é descartada e a próxima execução reavalia. |
| `onConnectionDeleted`       | Exclusão de uma conexão         | Apaga em cascata os contatos e as mensagens da conexão, já que sem subcoleções nada é removido automaticamente.                                                                                                                                             |
| `onContactDeleted`          | Exclusão de um contato          | Remove o contato das mensagens em que ele aparece e apaga as agendadas que ficaram sem destinatário.                                                                                                                                                        |

## Estrutura

```
.
├── firebase.json            hosting, functions, regras, índices e emuladores
├── firestore.rules          regras de segurança (isolamento por cliente)
├── firestore.indexes.json
├── tests/rules              testes das regras no emulador
├── functions/               Cloud Functions
└── web/
    └── src/
        ├── app/             providers, tema, router e guards de rota
        ├── config/          variáveis de ambiente validadas com Zod
        ├── lib/             Firebase e adaptadores do Firestore para observables
        ├── shared/          o que é reutilizável entre módulos
        │   ├── components/  atomic design: atoms, molecules, organisms, templates
        │   ├── hooks/       useObservable, useDialogState, useNotify
        │   ├── store/       estado global com Jotai (notificações)
        │   └── utils/
        └── modules/         um módulo por domínio
            ├── auth/
            ├── connections/
            ├── contacts/
            └── broadcast/
```

Cada módulo segue o mesmo formato: `components`, `hooks`, `pages`, `schemas`, `services` e `types`. As páginas só orquestram; o acesso ao Firestore fica nos `services` e o estado de tela nos `hooks`. O `shared` não depende de nenhum módulo.

O tempo real passa por um hook genérico, o [`useObservable`](web/src/shared/hooks/useObservable.ts). Ele recebe qualquer fonte com `subscribe` (inclusive um Observable do RxJS) e devolve `{ data, loading, error }`. Os services transformam consultas do Firestore nessa fonte com `fromQuery`/`fromDocument` ([`lib/firestore.ts`](web/src/lib/firestore.ts)).

O projeto segue o paradigma funcional: não há classes, e o ESLint bloqueia `class` no código.

## Rodando localmente

Pré-requisitos: Node 24, Java 21 (para os emuladores) e Firebase CLI (`npm i -g firebase-tools`).

```bash
npm install
npm install --prefix web
npm install --prefix functions
```

### Com os emuladores (sem precisar de projeto no Firebase)

```bash
npm run emulators            # auth, firestore e functions
npm run dev:emulators --prefix web
```

O app abre em http://localhost:5173 usando o projeto `demo-broadcast` dos emuladores ([`web/.env.emulator`](web/.env.emulator)). A UI dos emuladores fica em http://localhost:4000.

O emulador não dispara funções agendadas sozinho. Para ver o agendamento funcionando localmente, use `firebase functions:shell` e chame `dispatchScheduledMessages()`.

### Com um projeto real

Copie `web/.env.example` para `web/.env` e preencha com a configuração do app web (Console do Firebase → Configurações do projeto → Seus apps).

```bash
npm run dev --prefix web
```

## Testes

```bash
npm test --prefix web          # unitários e de componentes (Vitest + Testing Library)
npm run test:rules             # regras do Firestore no emulador
npm test --prefix functions    # functions contra o emulador do Firestore
```

## Deploy

O projeto precisa estar no plano Blaze por causa das Cloud Functions e do Cloud Scheduler.

```bash
firebase deploy
```

O `predeploy` faz o build do web e das functions antes de publicar hosting, functions, regras e índices.

## Decisões

- **Um usuário = um cliente.** O tenant é o próprio `uid`, então as regras comparam direto com `request.auth.uid`, sem custom claims. Se um cliente precisasse ter vários usuários, o caminho seria um `tenantId` em custom claims.
- **Envio imediato direto pelo app.** A mensagem já nasce como `sent` com `sentAt = serverTimestamp()`, e as regras garantem que esse horário não seja forjado. Só o agendamento depende do backend.
- **Editar uma mensagem reaplica o envio.** Ao salvar, o usuário escolhe de novo entre enviar agora ou agendar, seguindo o que o teste pede (editar mensagens enviadas e agendadas).
- **Telefone só com dígitos** no banco; a máscara é aplicada apenas na interface.
