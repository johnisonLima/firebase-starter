# Estratégia de Testes E2E

Este documento descreve a estratégia de testes end-to-end efetivamente implementada no Firebase Starter. Ele complementa a [ADR-023](../adr/ADR-023-playwright-e2e-testing.md) e as decisões registradas nas [ADR-025](../adr/ADR-025-autenticacao-real-e-sessao-reutilizavel-nos-testes-e2e.md), [ADR-026](../adr/ADR-026-interceptacao-fail-closed-do-firebase-auth-nos-testes-e2e.md) e [ADR-027](../adr/ADR-027-execucao-dos-testes-no-github-actions.md).

## 3.1 Objetivo e escopo

Os testes E2E validam fluxos completos pela perspectiva de uma pessoa usuária, interagindo com a aplicação em um navegador real. Eles verificam navegação, estados visíveis da interface, mensagens de sucesso e erro, proteção de rotas e integração entre componentes, guards, serviços e Firebase Authentication.

Os testes unitários, executados com Vitest, validam unidades isoladas: regras de formulário, serviços, guards, componentes e utilitários. Eles são mais rápidos e adequados para casos de borda e variações de lógica. Os testes E2E não substituem essa cobertura; eles confirmam que as partes funcionam juntas no navegador.

O escopo atual dos E2E inclui:

- acesso inicial e redirecionamento para login;
- exibição e navegação entre as telas de autenticação;
- login real com a conta dedicada;
- cadastro com operações simuladas do Firebase Auth;
- recuperação de senha com operações simuladas;
- verificação de e-mail, incluindo reenvio e confirmação;
- dashboard, logout e persistência de sessão;
- proteção de rotas para usuários não autenticados;
- redirecionamento de usuários autenticados;
- bloqueio de acesso ao Playground sem autenticação.

Não fazem parte do escopo atual:

- criação de contas reais;
- envio de e-mails reais;
- uso de caixas de entrada externas;
- alteração de regras ou configurações do Firebase;
- testes de carga, performance ou acessibilidade automatizada;
- validação de integrações profundas com o Firebase real além do login de setup.

## 3.2 Ferramentas

| Ferramenta              | Papel                                                                          |
| ----------------------- | ------------------------------------------------------------------------------ |
| Playwright              | Automação dos navegadores e execução da suíte E2E.                             |
| Chromium                | Engine usada no projeto `chromium`.                                            |
| Firefox                 | Engine usada no projeto `firefox`.                                             |
| WebKit                  | Engine usada no projeto `webkit`.                                              |
| Vitest                  | Testes unitários, executados pelo builder de testes do Angular.                |
| Firebase Authentication | Autenticação real no setup e origem das operações simuladas nos demais fluxos. |
| `dotenv`                | Leitura local das credenciais E2E a partir de `.env`, sem versionamento.       |

## 3.3 Organização

A estrutura atual dos testes é:

```text
tests/
├── playwright/
│   ├── app/
│   ├── auth/
│   ├── support/
│   └── auth.setup.ts
└── firestore/
    ├── firestore.rules.test-utils.ts
    └── firestore.rules.spec.ts
```

- `tests/playwright/app/access.spec.ts`: valida o redirecionamento do acesso inicial para login.
- `tests/playwright/app/playground.spec.ts`: valida a proteção da rota do Playground.
- `tests/playwright/auth/login.spec.ts`: exibição do login, navegação ao cadastro e redirecionamento de usuário autenticado.
- `tests/playwright/auth/register.spec.ts`: validações, sucesso, erro e interceptação do cadastro.
- `tests/playwright/auth/forgot-password.spec.ts`: validações, sucesso, erro e interceptação da recuperação de senha.
- `tests/playwright/auth/verify-email.spec.ts`: sessão não verificada, confirmação, falha de consulta, reenvio e interceptação.
- `tests/playwright/auth/dashboard.spec.ts`: acesso não autenticado, sessão reutilizada, reload, logout e login real.
- `tests/playwright/auth.setup.ts`: projeto de setup que realiza o login real e grava o `storageState`.
- `tests/playwright/support/auth.ts`: caminho do estado de autenticação, leitura das credenciais e helper `login(page)`.
- `tests/playwright/support/firebase-auth-routes.ts`: infraestrutura única de interceptação do Firebase Auth.
- `tests/firestore/`: utilitário e arquivo de testes das Security Rules, executados em configuração separada do Playwright.

O `playwright.config.ts` define um projeto `setup`, três projetos `mock-*` e três projetos `auth-*`, além do `baseURL` em `http://localhost:4200` e do `webServer` que inicia a aplicação.

## 3.4 Autenticação

### Conta dedicada

A suíte usa uma conta de teste dedicada, que deve existir no projeto Firebase e estar com o e-mail verificado. Ela não é criada pelos testes e não deve ser uma conta pessoal.

As credenciais são fornecidas por:

- `E2E_USER_EMAIL`;
- `E2E_USER_PASSWORD`.

Localmente, elas podem vir de um arquivo `.env` ignorado pelo Git. No GitHub Actions, vêm exclusivamente de secrets.

### Projeto de setup

`tests/playwright/auth.setup.ts` é executado pelo projeto `setup`. Ele:

1. chama `login(page)`;
2. valida que o usuário chegou ao dashboard e que o botão de logout está visível;
3. cria o diretório `test-results/`, se necessário;
4. grava o estado em `test-results/auth-state.json` com `page.context().storageState()`.

O helper `login(page)` em `tests/playwright/support/auth.ts` preenche o formulário real de login e valida a URL `/dashboard`.

### Reutilização da sessão

Os projetos `auth-chromium`, `auth-firefox` e `auth-webkit` declaram `dependencies: ['setup']` e usam o estado de autenticação gerado. Apenas os testes marcados com `@authenticated` entram nesses projetos. Cenários autenticados que não precisam validar o login em si usam:

```ts
test.use({ storageState: AUTH_STATE_PATH });
```

Isso evita repetir o login em cada teste e mantém o fluxo real validado no setup.

Os projetos `mock-chromium`, `mock-firefox` e `mock-webkit` selecionam os demais testes com `grepInvert: /@authenticated/` e não dependem do setup. Assim, os fluxos simulados podem ser executados sem `E2E_USER_EMAIL` e `E2E_USER_PASSWORD`.

### Isolamento

- Cenários que precisam de contexto não autenticado não usam `storageState`. Exemplos: acesso inicial, proteção do dashboard, proteção do Playground e proteção de `/verify-email`.
- Cenários que validam o login real usam o helper `login(page)` diretamente.
- O teste de logout encerra a sessão, confirma o retorno ao login e verifica que a rota protegida continua bloqueada.
- Arquivos que usam sessão real desativam traces com `test.use({ trace: 'off' })` ou configuração equivalente no projeto `setup`.
- Cada teste recebe uma página nova do Playwright. O estado compartilhado é lido, não alterado pelos demais cenários.

## 3.5 Mocks do Firebase

A infraestrutura de mocks está em `tests/playwright/support/firebase-auth-routes.ts`. Ela intercepta as chamadas HTTP do Firebase Authentication usando `page.route`.

### Operações suportadas

| Operação                 | Origem                                                                                    | Uso                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `signUp`                 | `identitytoolkit.googleapis.com/v1/accounts:signUp`                                       | Cadastro simulado.                                      |
| `signInWithPassword`     | `identitytoolkit.googleapis.com/v1/accounts:signInWithPassword`                           | Login simulado em cenários de verificação de e-mail.    |
| `lookup`                 | `identitytoolkit.googleapis.com/v1/accounts:lookup`                                       | Consulta do estado do usuário.                          |
| `sendPasswordResetEmail` | `identitytoolkit.googleapis.com/v1/accounts:sendOobCode` com `requestType=PASSWORD_RESET` | Recuperação de senha simulada.                          |
| `sendEmailVerification`  | `identitytoolkit.googleapis.com/v1/accounts:sendOobCode` com `requestType=VERIFY_EMAIL`   | Reenvio de verificação simulado.                        |
| `tokenRefresh`           | `securetoken.googleapis.com/v1/token`                                                     | Atualização de token, quando explicitamente autorizada. |

### Respostas simuladas

Cada operação possui uma resposta padrão compatível com o contrato do SDK. O cenário pode:

- substituir a resposta com `responses`;
- simular erros com `firebaseAuthError(message, code)`;
- alterar a resposta durante o teste com `setResponse(operation, response)`, inclusive para representar a passagem de não verificado para verificado.

### Controle explícito e fail-closed

Cada cenário declara as operações permitidas:

```ts
const mock = await mockFirebaseAuth(page, {
  allow: ['signUp', 'lookup', 'sendEmailVerification'],
});
```

Qualquer operação não declarada recebe `403` com `OPERATION_NOT_ALLOWED` e é registrada em `blockedRequests`. O helper expõe:

- `handledOperations`: operações efetivamente simuladas;
- `blockedRequests`: requisições não autorizadas;
- `expectNoUnexpectedRequests()`: falha o teste se houver requisição bloqueada.

Os cenários também verificam `handledOperations` para confirmar que a sequência esperada foi executada. Requisições `OPTIONS` recebem resposta de preflight com os cabeçalhos CORS necessários.

### Garantia de ausência de operações reais

Os cenários com mocks não criam contas reais e não enviam e-mails reais. As operações de cadastro, recuperação e verificação são respondidas pela infraestrutura de interceptação. O comportamento fail-closed impede que uma operação não autorizada chegue ao Firebase real.

A interceptação cobre apenas os hosts do Firebase Authentication. Outros serviços não são simulados por essa infraestrutura.

## 3.6 Navegadores e execução

A configuração executa os cenários mockados e autenticados em Chromium, Firefox e WebKit. O projeto `setup` roda somente como dependência dos projetos `auth-*`; os projetos `mock-*` são independentes de credenciais.

### Instalação dos navegadores

```bash
npx playwright install --with-deps
```

### Execução completa

```bash
npm run test:e2e
```

Esse comando executa o setup e todos os projetos configurados.

### Execução sem autenticação real

```bash
npx playwright test --project=mock-chromium --project=mock-firefox --project=mock-webkit
```

### Execução autenticada

```bash
npx playwright test --project=auth-chromium --project=auth-firefox --project=auth-webkit
```

Os projetos autenticados exigem os secrets/variáveis E2E e executam o projeto `setup` antes dos testes.

### Execução por navegador

```bash
npx playwright test --project=mock-chromium --project=auth-chromium
npx playwright test --project=mock-firefox --project=auth-firefox
npx playwright test --project=mock-webkit --project=auth-webkit
```

### Execução direcionada por arquivo

```bash
npx playwright test tests/playwright/auth/login.spec.ts
npx playwright test tests/playwright/auth/register.spec.ts --project=mock-firefox
```

### Execução por título

```bash
npx playwright test --grep "Cadastro"
```

### Comportamento em CI

Com `CI=true`, o Playwright usa:

- reporter `list`;
- `workers: 1`;
- `retries: 2`;
- `forbidOnly: true`.

Essas configurações priorizam estabilidade e reprodutibilidade, evitando concorrência entre cenários que usam autenticação real.

## 3.7 CI

O workflow está em `.github/workflows/ci.yml` e é acionado por `push` e `pull_request`.

### Jobs

**`verify`** — sempre executa:

1. verificação de disponibilidade dos secrets E2E;
2. checkout;
3. Node.js 22 com cache npm;
4. `npm ci` (inclui `firebase-tools` 15.35.0 como dependência local);
5. Configuração do Java 21 (Temurin) para o Firestore Emulator;
6. `npm run type-check:firestore-tests`;
7. `npm run test:firestore-rules`;
8. `npm run build`;
9. `npm run test:unit`;
10. `npm run type-check:playwright`.

Os testes das regras iniciam somente o Firestore Emulator usando `demo-firebase-starter-rules`; não recebem os secrets E2E nem acessam projetos Firebase reais. O Vitest usa `vitest.firestore.config.ts` e inclui apenas `tests/firestore/**/*.spec.ts`, separado da raiz Playwright `tests/playwright/`.

**`e2e`** — depende de `verify` e só executa quando os secrets estão disponíveis:

1. checkout;
2. Node.js 22 com cache npm;
3. `npm ci`;
4. `npx playwright install --with-deps`;
5. `npm run test:e2e`.

### Secrets

`E2E_USER_EMAIL` e `E2E_USER_PASSWORD` são lidos de GitHub Actions Secrets. O passo de verificação usa `env` para detectar a disponibilidade e publica `e2e_enabled` em `$GITHUB_OUTPUT`.

### Secrets indisponíveis e Pull Requests de fork

Em Pull Requests de fork e de Dependabot, os secrets não são disponibilizados. Nesse caso:

- `verify` continua executando build, testes unitários e type-check;
- o job `e2e` é marcado como `skipped`;
- o workflow emite warning e registra no `$GITHUB_STEP_SUMMARY` que a suíte E2E foi ignorada;
- a validação é explicitamente parcial.

O workflow não usa `pull_request_target`.

### Validação completa versus parcial

- **Completa:** secrets disponíveis, `verify` aprovado e `e2e` executado nos três navegadores.
- **Parcial:** secrets indisponíveis, `verify` aprovado e `e2e` skipped, com aviso explícito.

A execução normal do workflow no GitHub Actions, com os secrets disponíveis, foi validada com sucesso na FIX-020. As validações locais da Etapa 6 também foram concluídas com sucesso. O comportamento de Pull Requests de fork e de Dependabot sem secrets não foi validado diretamente.

Antes da implementação complementar da separação de projetos, a suíte local tinha 67 testes aprovados. Após a inclusão dos dois cenários E2E e a execução em três navegadores, `npx playwright test --list` lista 73 execuções, incluindo o teste de setup.

## 3.8 Segurança

- `test-results/auth-state.json` contém tokens de sessão. Ele é gerado pelo setup, está no `.gitignore` e não é publicado como artefato.
- O arquivo `.env` local é ignorado pelo Git e não deve ser versionado.
- Os secrets são fornecidos por variáveis de ambiente e nunca são impressos nos logs.
- Em CI, o reporter `list` evita a geração desnecessária do relatório HTML.
- Traces, vídeos, screenshots e relatórios não são publicados como artefatos.
- Testes que transportam sessão real usam `trace: 'off'` para reduzir o risco de captura de tokens.
- Os cenários simulados usam credenciais fictícias e não criam contas nem enviam e-mails reais.
- O `auth-state.json` não deve ser copiado para issues, logs, comentários ou artefatos.
- Caso artefatos de diagnóstico sejam necessários no futuro, o conteúdo deve ser revisado antes de qualquer publicação.

## 3.9 Boas práticas

Os próximos testes devem seguir estas convenções:

1. **Seletores acessíveis:** priorizar roles, labels e nomes acessíveis; usar seletores estruturais ou CSS apenas quando não houver alternativa semântica.
2. **Independência:** cada teste deve poder executar isoladamente e não deve depender de ordem ou de estado deixado por outro.
3. **Sem esperas arbitrárias:** usar asserções do Playwright e esperas por estado observável; evitar `waitForTimeout()`.
4. **Helpers existentes:** reutilizar `login(page)`, `AUTH_STATE_PATH` e `mockFirebaseAuth` em vez de duplicar lógica.
5. **Infraestrutura única de mocks:** não criar uma segunda camada de interceptação do Firebase Auth.
6. **Operações explícitas:** declarar em `allow` somente o que o cenário precisa e verificar `handledOperations` e `expectNoUnexpectedRequests()`.
7. **Sem operações reais:** não criar contas, não enviar e-mails e não alterar dados do Firebase nos testes com mocks.
8. **Dados fictícios:** usar e-mails e senhas fictícios nos cenários simulados.
9. **Cenários focados:** manter arquivos organizados por fluxo e evitar arquivos excessivamente grandes.
10. **Segurança:** não registrar credenciais, tokens ou conteúdo de `auth-state.json` em logs ou relatórios.
11. **Documentação:** atualizar este documento e as ADRs relacionadas quando a estratégia mudar.

## 3.10 Comandos de verificação relacionados

```bash
npm run test:unit
npm run build
npm run type-check:playwright
npm run test:e2e
```

## 3.11 Testes das Firestore Security Rules

Os testes das regras ficam em `tests/firestore/` e usam Vitest com `@firebase/rules-unit-testing`. A configuração `vitest.firestore.config.ts` inclui somente `tests/firestore/**/*.spec.ts`; assim, esses arquivos não são descobertos pelo Playwright, cuja raiz é `tests/playwright/`.

O comando `npm run test:firestore-rules` inicia o Firebase Emulator Suite com `--only firestore` e o project ID `demo-firebase-starter-rules`. A biblioteca cria contextos autenticados simulados; o Firebase Auth Emulator não é iniciado. O utilitário aponta explicitamente para `127.0.0.1:8180` e carrega as regras locais de `firestore.rules`. Não há deploy nem conexão configurada com projeto Firebase real nesse fluxo.

```bash
npm run test:firestore-rules
npm run type-check:firestore-tests
```

A suíte tem 35 testes distribuídos em sete arquivos; a suíte e o type-check passaram na validação desta atualização. Ela cobre autenticação, combinações de claims, operações e validação dos documentos, usando somente o Emulator demo. A cobertura, comandos e limites identificados estão registrados em [`firestore-authorization.md`](../security/firestore-authorization.md); acompanhe o andamento na FIX-021 em `docs/requirements/remediation-backlog.md`.

## Referências

- [ADR-014 — Obrigatoriedade de testes unitários para código de domínio](../adr/ADR-014-obrigatoriedade-de-testes-unitários.md)
- [ADR-023 — Playwright para testes end-to-end](../adr/ADR-023-playwright-e2e-testing.md)
- [ADR-025 — Autenticação real e reutilização de sessão nos testes E2E](../adr/ADR-025-autenticacao-real-e-sessao-reutilizavel-nos-testes-e2e.md)
- [ADR-026 — Interceptação fail-closed das operações do Firebase Auth nos testes E2E](../adr/ADR-026-interceptacao-fail-closed-do-firebase-auth-nos-testes-e2e.md)
- [ADR-027 — Execução dos testes automatizados no GitHub Actions](../adr/ADR-027-execucao-dos-testes-no-github-actions.md)
- [Secrets do CI](../ci/secrets.md)
- `.github/workflows/ci.yml`
- `playwright.config.ts`
- `tests/playwright/support/auth.ts`
- `tests/playwright/support/firebase-auth-routes.ts`
