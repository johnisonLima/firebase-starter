# ADR-029 — Separação dos projetos E2E mockados e autenticados

### Título

Separação dos projetos E2E mockados e autenticados

### Status

Aceita.

### Contexto

A configuração E2E reutilizava o projeto de setup de autenticação real como dependência de Chromium, Firefox e WebKit. Por isso, até cenários que simulam todas as operações do Firebase Auth dependiam da conta dedicada e dos secrets E2E.

É necessário manter a validação autenticada real e a cobertura nos três navegadores, permitindo também executar os cenários mockados sem credenciais. A CI já condiciona a execução E2E à disponibilidade dos secrets e permanece inalterada.

### Decisão

- O Playwright mantém um projeto `setup` que faz login real e grava o `storageState`.
- Cada teste que depende da sessão real recebe a tag `@authenticated`.
- São definidos três projetos `mock-*` (Chromium, Firefox e WebKit) que executam os testes sem essa tag e não dependem do setup.
- São definidos três projetos `auth-*` (Chromium, Firefox e WebKit) que executam somente os testes com a tag `@authenticated` e declaram `dependencies: ['setup']`.
- A execução completa inclui os seis projetos de navegador e o setup, preservando todos os cenários nos três engines.
- O setup continua sem publicar o estado de autenticação, e os projetos autenticados mantêm `trace: 'off'`.

Essa decisão atualiza a dependência dos projetos registrada nas ADR-025 e ADR-027. As ADRs anteriores permanecem preservadas como registro histórico.

### Consequências

#### Positivas

✔ Testes mockados podem ser executados sem secrets ou login real.

✔ Fluxos autenticados continuam usando login real, setup e `storageState`.

✔ Os dois conjuntos de testes permanecem cobertos em Chromium, Firefox e WebKit.

✔ A execução completa continua contemplando toda a suíte e a CI não precisa mudar.

#### Negativas

✖ A configuração define seis projetos de navegador em vez de três.

✖ Testes devem ser marcados corretamente com `@authenticated` para usar o projeto e as credenciais adequadas.

### ADRs relacionadas

- ADR-023 — Playwright para testes end-to-end
- ADR-025 — Autenticação real e reutilização de sessão nos testes E2E
- ADR-026 — Interceptação fail-closed das operações do Firebase Auth nos testes E2E
- ADR-027 — Execução dos testes automatizados no GitHub Actions

### Data

09/11/2026
