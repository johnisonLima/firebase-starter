# ADR-026 — Interceptação fail-closed das operações do Firebase Auth nos testes E2E

### Título

Interceptação fail-closed das operações do Firebase Auth nos testes E2E

### Status

Aceita.

### Contexto

Os fluxos de cadastro, recuperação de senha e verificação de e-mail precisam ser validados ponta a ponta sem criar contas reais, sem enviar e-mails e sem alterar dados de um projeto Firebase compartilhado.

Esses fluxos utilizam o SDK do Firebase Authentication, que troca mensagens HTTP com os serviços `identitytoolkit.googleapis.com` e `securetoken.googleapis.com`. Para que a interface e os guards sejam exercitados com o contrato esperado pelo SDK, as respostas simuladas precisam ser compatíveis com esse contrato.

Também é necessário garantir que uma operação não prevista em um cenário não escape para o Firebase real por engano. A estratégia deve falhar de forma segura e tornar visível qualquer requisição não autorizada.

### Alternativas consideradas

**1. Firebase Emulator Suite**

**Vantagens**

- Ambiente local com comportamento próximo ao Firebase real.
- Permite testar integrações sem afetar dados de produção.

**Desvantagens**

- Exige infraestrutura e configuração adicionais.
- Aumenta o custo de manutenção e de execução da suíte.
- Não faz parte da infraestrutura atual do projeto.

---

**2. Conta e projeto Firebase dedicados para todos os fluxos**

**Vantagens**

- Valida o comportamento real do serviço.
- Não exige simulação das respostas do SDK.

**Desvantagens**

- Cria contas e envia e-mails reais.
- Introduz efeitos colaterais e necessidade de limpeza.
- Aumenta a dependência de disponibilidade e de configuração externa.
- Dificulta a simulação controlada de erros e de transições de estado.

---

**3. Mocks ad hoc em cada arquivo de teste**

**Vantagens**

- Cada cenário pode declarar exatamente o que precisa.
- Não exige uma abstração compartilhada.

**Desvantagens**

- Duplica a infraestrutura de interceptação.
- Aumenta o risco de inconsistência entre cenários.
- Dificulta garantir que operações não autorizadas sejam bloqueadas.
- Torna mais provável que uma chamada real passe despercebida.

---

**4. Interceptação centralizada com lista explícita de operações permitidas (Escolhido)**

Uma única infraestrutura intercepta as chamadas do Firebase Authentication, responde apenas às operações autorizadas e bloqueia todo o restante.

### Decisão

- A infraestrutura de mocks fica exclusivamente em `tests/support/firebase-auth-routes.ts`.
- `mockFirebaseAuth(page, { allow, responses })` registra as rotas de `identitytoolkit.googleapis.com/**` e `securetoken.googleapis.com/**`.
- Cada cenário declara explicitamente as operações permitidas em `allow`.
- As operações reconhecidas são:
  - `signUp`;
  - `signInWithPassword`;
  - `lookup`;
  - `sendPasswordResetEmail`;
  - `sendEmailVerification`;
  - `tokenRefresh`.
- A operação é identificada pelo caminho da requisição e, no caso de `accounts:sendOobCode`, pelo `requestType` do corpo (`PASSWORD_RESET` ou `VERIFY_EMAIL`).
- Requisições `OPTIONS` recebem resposta de preflight com os cabeçalhos CORS necessários.
- Operações permitidas recebem uma resposta padrão compatível com o contrato do SDK. O cenário pode substituir a resposta por meio de `responses`.
- `firebaseAuthError(message, code)` permite simular erros retornados pelo Firebase.
- `setResponse(operation, response)` permite alterar a resposta durante o cenário, inclusive para representar transições como um usuário que passa de não verificado para verificado.
- Qualquer operação não declarada em `allow` recebe `403` com `OPERATION_NOT_ALLOWED` e é registrada em `blockedRequests`.
- `handledOperations` registra as operações efetivamente simuladas.
- `expectNoUnexpectedRequests()` falha o teste quando alguma operação não autorizada foi interceptada.
- Os cenários com mocks declaram as operações esperadas e verificam `handledOperations`.
- Os testes não criam contas reais e não enviam e-mails reais.
- Não existe uma segunda infraestrutura de mocks para o Firebase Authentication.

### Consequências

#### Positivas

✔ Os fluxos de cadastro, recuperação e verificação podem ser testados sem efeitos colaterais reais.

✔ As respostas são determinísticas e compatíveis com o contrato do SDK.

✔ Erros e transições de estado podem ser simulados de forma controlada.

✔ Operações não autorizadas falham de forma segura e explícita.

✔ A infraestrutura é única, reutilizável e verificável por todos os cenários.

✔ Os testes comprovam que operações inesperadas não chegaram ao Firebase real.

#### Negativas

✖ As respostas simuladas precisam ser mantidas em compatibilidade com o SDK.

✖ A lista de operações e os padrões de URL exigem atualização quando o Firebase alterar o contrato utilizado.

✖ A interceptação não substitui testes de integração com o Firebase real ou com o Emulator Suite.

✖ Uma operação não prevista pode bloquear um cenário legítimo até ser autorizada explicitamente.

### ADRs relacionadas

- ADR-023 — Playwright para testes end-to-end
- ADR-025 — Autenticação real e reutilização de sessão nos testes E2E
- ADR-027 — Execução dos testes automatizados no GitHub Actions

### Data

06/11/2026
