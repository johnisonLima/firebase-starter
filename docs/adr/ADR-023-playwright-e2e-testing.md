# ADR-023 — Playwright E2E testing

### Título

Playwright para Testes End-to-End

### Contexto

O Firebase Starter necessita validar fluxos completos da aplicação através da interação com um navegador, garantindo que funcionalidades importantes funcionem de forma integrada do ponto de vista do usuário.

A ferramenta escolhida também deverá permitir uma futura integração com o processo de CI, incluindo a execução automatizada através do GitHub Actions.

Além da execução dos testes, é importante que a estratégia adotada mantenha os testes independentes da implementação interna dos componentes Angular, priorizando o comportamento observável da aplicação.

### Alternativas consideradas

**1. Cypress**

Framework de testes E2E com boa experiência de desenvolvimento e recursos de debugging.

**Vantagens**

- Boa experiência de desenvolvimento.
- Recursos de debugging.
- Ampla adoção no ecossistema web.

**Desvantagens**

- Abordagem e arquitetura próprias para automação de navegador.
- Menor flexibilidade em alguns cenários de automação multi-browser.

---

**2. WebdriverIO**

Framework baseado no protocolo WebDriver, com suporte a diferentes ambientes e integrações.

**Vantagens**

- Ecossistema maduro.
- Amplo suporte a diferentes ambientes.
- Flexibilidade de configuração.

**Desvantagens**

- Maior complexidade de configuração.
- Mais infraestrutura necessária para alguns cenários.

---

**3. Nightwatch**

Framework de testes automatizados baseado em WebDriver.

**Vantagens**

- Integração com automação de navegadores.
- Sintaxe relativamente simples.

**Desvantagens**

- Ecossistema menor.
- Menor aderência às necessidades atuais do projeto.

---

**4. Puppeteer**

Biblioteca para automação de navegadores baseada principalmente no Chromium.

**Vantagens**

- API de automação madura.
- Boa integração com o ecossistema JavaScript/TypeScript.
- Excelente para automação baseada em Chromium.

**Desvantagens**

- Foco principal no Chromium.
- Menor abrangência de engines de navegador em comparação com o Playwright.

---

**5. Playwright (Escolhido)**

Framework de automação e testes end-to-end com suporte a múltiplos engines de navegador, recursos de debugging e integração adequada com ambientes de CI.

### Decisão

Será utilizado o **Playwright como ferramenta oficial de testes end-to-end do Firebase Starter**.

A ferramenta será responsável pela suíte de testes que valida os fluxos completos da aplicação através da perspectiva de um usuário utilizando um navegador.

A escolha foi motivada principalmente pelo suporte a múltiplos engines de navegador, recursos de automação e debugging, integração com CI e capacidade de validar a aplicação através de interações próximas ao comportamento real do usuário.

Os testes E2E deverão permanecer independentes da implementação interna dos componentes Angular, validando principalmente o comportamento observável da aplicação.

Como padrão de escrita dos testes, **deverão ser priorizados seletores semânticos e orientados à acessibilidade**, como roles, labels e nomes acessíveis, evitando dependência desnecessária de classes CSS, estrutura do DOM ou outros detalhes internos da implementação.

Exemplo de prioridade:

```text
Role / Nome acessível
        ↓
Label
        ↓
Texto ou outro seletor semântico
        ↓
Seletores estruturais ou CSS
```

Seletores baseados em detalhes internos da implementação deverão ser utilizados somente quando não houver uma alternativa semântica adequada.

A suíte deverá ser estruturada de forma que sua execução possa posteriormente ser incorporada ao processo de **CI/CD através do GitHub Actions**.

### Consequências

#### Positivas

✔ Validação de fluxos completos através de um navegador.

✔ Testes orientados ao comportamento real do usuário.

✔ Suporte a múltiplos engines de navegador.

✔ Recursos de debugging que facilitam a investigação de falhas.

✔ Integração adequada com processos de CI.

✔ Testes menos acoplados à implementação interna dos componentes Angular.

✔ Seletores semânticos tornam os testes mais resistentes a alterações visuais e estruturais.

✔ Incentiva a construção de interfaces com elementos semanticamente acessíveis.

✔ Define uma ferramenta oficial para os testes E2E do projeto.

#### Negativas

✖ O projeto passa a depender do Playwright para sua suíte E2E.

✖ Os testes E2E possuem maior custo de execução em comparação com testes unitários.

✖ É necessário manter configuração, estrutura e infraestrutura específica para execução dos testes.

✖ Testes dependentes de ambiente podem exigir configuração adicional para execução local e CI.

### Data

28/08/2026