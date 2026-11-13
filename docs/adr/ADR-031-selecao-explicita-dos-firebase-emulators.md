# ADR-031 — Seleção explícita dos Firebase Emulators

### Status

Aceita.

### Contexto

Os providers do Firebase conectavam Authentication e Firestore aos emuladores sempre que Angular estava em modo de desenvolvimento. Isso fazia `npm start` e o servidor do Playwright dependerem dos emuladores, embora os testes mockados interceptem os endpoints HTTPS do Firebase e os testes autenticados precisem usar a conta real.

Também era necessário executar os testes mockados no CI sem credenciais, mantendo o setup real como dependência apenas dos projetos autenticados.

### Decisão

- O uso dos emuladores é controlado pelo identificador de compilação `FIREBASE_USE_EMULATORS`, cujo padrão é `false`.
- `ng serve` normal define `FIREBASE_USE_EMULATORS=false`; o perfil `ng serve --configuration emulators` define `true`.
- O script `npm run start:emulators` inicia Auth e Firestore via `firebase emulators:exec` e inicia a aplicação com o perfil `emulators` na porta 4201, permitindo manter o `npm start` padrão na porta 4200.
- O provider lê uma única decisão para conectar Authentication e Firestore; o modo Angular (`isDevMode()`) não seleciona os emuladores.
- Os projetos Playwright mockados e autenticados usam o servidor padrão, sem emuladores. Os primeiros interceptam as operações de Auth; os últimos usam o Firebase real.
- `npm run test:e2e:mock` seleciona apenas projetos `mock-*`. `npm run test:e2e:auth` seleciona projetos `auth-*`, que dependem de `setup`.
- O GitHub Actions executa os mocks sem secrets e executa a suíte autenticada em job separado somente quando os secrets estão disponíveis. O job `verify` continua executando os testes de regras no Firestore Emulator.

### Consequências

#### Positivas

✔ `npm start` usa Firebase real por padrão.

✔ A emulação exige um comando/perfil explícito.

✔ Os projetos mockados podem rodar sem credenciais e sem emuladores.

✔ O setup de autenticação real só é incluído quando projetos autenticados são selecionados ou na execução completa.

✔ CI executa mocks mesmo em contextos sem secrets e mantém os testes autenticados condicionados aos secrets existentes.

#### Negativas

✖ A execução autenticada e a mock são jobs separados no CI, repetindo instalação de dependências e navegadores.

✖ A execução completa local continua exigindo credenciais, pois inclui os testes autenticados.

✖ O perfil Angular de emulação precisa manter o identificador de compilação sincronizado com os providers.

### ADRs relacionadas

- ADR-002 — Não utilizar environments
- ADR-004 — Separar configuração da inicialização do Firebase
- ADR-022 — Configuração do Firebase na infraestrutura
- ADR-025 — Autenticação real e sessão reutilizável nos testes E2E
- ADR-026 — Interceptação fail-closed do Firebase Auth nos testes E2E
- ADR-027 — Execução dos testes no GitHub Actions
- ADR-029 — Separação dos projetos E2E mockados e autenticados

### Data

13/11/2026
