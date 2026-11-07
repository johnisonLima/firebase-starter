# ADR-025 — Autenticação real e reutilização de sessão nos testes E2E

### Título

Autenticação real e reutilização de sessão nos testes E2E

### Status

Aceita.

### Contexto

A suíte E2E do Firebase Starter precisa validar fluxos que dependem de uma sessão autenticada, como acesso ao dashboard, logout e redirecionamentos de rotas. Ao mesmo tempo, os testes não podem depender de credenciais versionadas, não devem criar contas reais e precisam manter cenários não autenticados isolados.

Executar o login pela interface em todos os testes aumentaria o tempo de execução, repetiria a mesma operação e ampliaria a chance de falhas por concorrência ou por indisponibilidade momentânea do Firebase Authentication.

O estado de autenticação gerado pelo Playwright contém tokens de sessão e, por isso, precisa ser tratado como informação sensível.

### Alternativas consideradas

**1. Login real pela interface em cada teste**

**Vantagens**

- Cada cenário começa do zero.
- Não há dependência de um arquivo de estado compartilhado.

**Desvantagens**

- Aumenta o tempo total da suíte.
- Repete a mesma operação em todos os cenários autenticados.
- Aumenta a exposição das credenciais e a chance de falhas transitórias.

---

**2. Mock de autenticação em todos os cenários**

**Vantagens**

- Execução rápida e determinística.
- Não exige credenciais reais.

**Desvantagens**

- Não valida a integração real com o Firebase Authentication.
- Não cobre o comportamento dos guards e da persistência de sessão com o SDK real.
- Reduz a confiança nos fluxos autenticados ponta a ponta.

---

**3. Autenticação programática via SDK, sem passar pela interface**

**Vantagens**

- Evita repetir o preenchimento do formulário.
- Pode ser mais rápida que o login pela interface.

**Desvantagens**

- Não valida o formulário de login nem a navegação observável.
- Exige tratamento adicional do SDK e das credenciais.
- Afasta o teste do comportamento real da pessoa usuária.

---

**4. Login real no projeto de setup e reutilização via `storageState` (Escolhido)**

O projeto `setup` executa o login uma vez pela interface e persiste o estado de autenticação para os demais projetos.

### Decisão

- A suíte utiliza uma conta dedicada de testes, configurada por `E2E_USER_EMAIL` e `E2E_USER_PASSWORD`.
- Localmente, as variáveis podem ser fornecidas por um arquivo `.env` não versionado. No GitHub Actions, são fornecidas exclusivamente por secrets.
- O projeto `setup`, definido em `playwright.config.ts`, executa `tests/auth.setup.ts` antes de Chromium, Firefox e WebKit.
- O helper `login(page)` em `tests/support/auth.ts` realiza o login real pela interface e valida a chegada ao dashboard.
- Após o login, o setup grava o estado em `test-results/auth-state.json` por meio de `page.context().storageState()`.
- Os projetos Chromium, Firefox e WebKit declaram `dependencies: ['setup']` e reutilizam o estado.
- Cenários que precisam de contexto não autenticado não usam `storageState`.
- Cenários autenticados que não validam o login em si usam `test.use({ storageState: AUTH_STATE_PATH })`.
- O cenário de logout encerra a sessão, valida o retorno ao login e confirma que a rota protegida continua bloqueada.
- Arquivos que transportam sessão real usam `trace: 'off'` para evitar a captura de tokens em traces.
- `test-results/auth-state.json` permanece no `.gitignore` e não é publicado como artefato.
- A conta dedicada deve existir e estar com e-mail verificado. A suíte não cria contas reais.

### Consequências

#### Positivas

✔ O login real é validado uma vez pela interface.

✔ Os demais cenários autenticados reutilizam uma sessão consistente.

✔ O tempo total da suíte é reduzido em comparação ao login repetido.

✔ Cenários não autenticados permanecem isolados.

✔ A integração com o Firebase Authentication, os guards e a persistência são exercitados de forma próxima ao uso real.

✔ O estado sensível fica em arquivo ignorado e não é publicado.

#### Negativas

✖ A suíte depende de uma conta dedicada válida e verificada.

✖ A execução autenticada depende de secrets no CI.

✖ O arquivo de estado precisa ser tratado como sensível.

✖ Uma falha no setup impede a execução dos projetos dependentes.

✖ O estado compartilhado exige cuidado para não ser alterado por testes individuais.

### ADRs relacionadas

- ADR-014 — Obrigatoriedade de testes unitários para código de domínio
- ADR-023 — Playwright para testes end-to-end
- ADR-026 — Interceptação fail-closed das operações do Firebase Auth nos testes E2E
- ADR-027 — Execução dos testes automatizados no GitHub Actions

### Data

06/11/2026
