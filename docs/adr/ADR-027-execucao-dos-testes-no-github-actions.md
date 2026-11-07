# ADR-027 — Execução dos testes automatizados no GitHub Actions

### Título

Execução dos testes automatizados no GitHub Actions

### Status

Aceita. A execução normal do workflow no GitHub Actions foi validada com sucesso na FIX-020. O comportamento de Pull Requests de fork e de Dependabot sem secrets não foi validado diretamente.

### Contexto

O projeto precisa executar build, testes unitários, type-check e testes E2E em pushes e Pull Requests, sem comprometer credenciais e sem publicar artefatos sensíveis.

Os testes E2E autenticados dependem de uma conta dedicada configurada por `E2E_USER_EMAIL` e `E2E_USER_PASSWORD`. Esses valores não podem ser versionados e não devem ser expostos a workflows acionados por código não confiável, como Pull Requests provenientes de forks.

A suíte E2E também é mais pesada que build e testes unitários. Executá-la simultaneamente com outras verificações pode aumentar a instabilidade dos cenários que usam autenticação real.

### Alternativas consideradas

**1. Um único job com todas as etapas**

**Vantagens**

- Estrutura simples.
- Menos duplicação de checkout e instalação.

**Desvantagens**

- Dificulta separar a validação independente de credenciais da suíte E2E.
- Mistura verificações leves e pesadas no mesmo ciclo.
- Torna o comportamento em Pull Requests de fork menos explícito.

---

**2. Jobs totalmente paralelos**

**Vantagens**

- Reduz o tempo total em comparação com a execução sequencial.

**Desvantagens**

- Coloca build, testes unitários e E2E competindo por recursos.
- Aumenta o risco de instabilidade nos testes de autenticação real.
- Prioriza velocidade em vez de confiabilidade e reprodutibilidade.

---

**3. Executar E2E em `pull_request_target`**

**Vantagens**

- O evento teria acesso aos secrets do repositório.

**Desvantagens**

- Executaria código de Pull Request em um contexto confiável.
- Poderia expor secrets a código não revisado.
- Contraria práticas de segurança para Pull Requests de forks.

Alternativa rejeitada.

---

**4. Dois jobs sequenciais, com E2E condicionada aos secrets (Escolhido)**

O job `verify` executa sempre as verificações independentes de credenciais. O job `e2e` depende dele e só executa quando os dois secrets estão disponíveis.

### Decisão

- O workflow único permanece em `.github/workflows/ci.yml`, acionado por `push` e `pull_request`.
- As permissões permanecem em `contents: read` e a concorrência existente é preservada.
- O job `verify` executa:
  1. verificação de disponibilidade dos secrets;
  2. checkout;
  3. Node.js 22 com cache npm;
  4. `npm ci`;
  5. `npm run build`;
  6. `npm run test:unit`;
  7. `npm run type-check:playwright`.
- O job `e2e` declara `needs: verify` e só executa quando `needs.verify.outputs.e2e_enabled == 'true'`.
- O job `e2e` executa:
  1. checkout;
  2. Node.js 22 com cache npm;
  3. `npm ci`;
  4. `npx playwright install --with-deps`;
  5. `npm run test:e2e`.
- A cobertura de type-check não é duplicada:
  - `npm run build` cobre `tsconfig.app.json`;
  - `npm run test:unit` cobre `tsconfig.spec.json`;
  - `npm run type-check:playwright` cobre `tsconfig.playwright.json`.
- Os secrets são lidos em um passo com `env`, e a disponibilidade é publicada em `$GITHUB_OUTPUT`.
- Quando os secrets estão ausentes, o job `verify` emite warning e registra no `$GITHUB_STEP_SUMMARY` que a suíte E2E foi ignorada. O job `e2e` fica como `skipped`, deixando explícito que a validação foi parcial.
- Em Pull Requests de fork e de Dependabot, os secrets não são disponibilizados. Build, testes unitários e type-check continuam executando; a E2E não executa.
- O workflow não utiliza `pull_request_target`.
- A suíte E2E mantém Chromium, Firefox e WebKit, com o projeto `setup` como dependência dos três.
- Em CI, o Playwright usa reporter `list`, `workers: 1`, `retries: 2` e `forbidOnly: true`.
- Nenhum artefato é publicado. `test-results/auth-state.json` permanece ignorado, e traces, vídeos, screenshots e relatórios não são enviados ao GitHub.
- A execução normal do workflow no GitHub Actions foi validada com sucesso na FIX-020.
- O comportamento de Pull Requests de fork e de Dependabot sem secrets não foi validado diretamente.

### Consequências

#### Positivas

✔ Build, testes unitários e type-check sempre executam, mesmo sem credenciais E2E.

✔ A E2E só executa quando os secrets estão disponíveis.

✔ Pull Requests de fork não recebem acesso aos secrets.

✔ O skip da E2E é explícito e não é apresentado como validação completa.

✔ Verificações pesadas não competem entre si.

✔ O cache npm reduz o tempo de instalação.

✔ A ausência de publicação de artefatos reduz o risco de exposição de tokens e credenciais.

✔ A configuração de type-check cobre os três `tsconfig` relevantes sem duplicação.

#### Negativas

✖ O job `e2e` executa `npm ci` novamente em outro runner.

✖ A suíte E2E com `workers: 1` é mais lenta.

✖ A validação em Pull Requests de fork fica parcial por definição.

✖ O comportamento em Pull Requests de fork e de Dependabot sem secrets não foi validado diretamente.

✖ Sem artefatos, a investigação de falhas fica limitada aos logs do runner.

### ADRs relacionadas

- ADR-014 — Obrigatoriedade de testes unitários para código de domínio
- ADR-023 — Playwright para testes end-to-end
- ADR-024 — Segurança na autenticação de requisições à API
- ADR-025 — Autenticação real e reutilização de sessão nos testes E2E
- ADR-026 — Interceptação fail-closed das operações do Firebase Auth nos testes E2E

### Data

06/11/2026
