# Firebase Starter

# Planejamento

Este documento registra o planejamento da próxima rodada de desenvolvimento.

Cada Sprint deverá entregar uma funcionalidade completa, respeitando as ADRs existentes e os princípios de Angular Moderno, Standalone Components, Signals, Firebase SDK Oficial, Spartan UI, Tailwind CSS e abordagem Mobile First.

---

# Nova rodada de Sprints

## Sprint 6 — Autenticação com Google

**Objetivo**

Adicionar autenticação utilizando uma conta Google.

### Entregas

- Login com Google.
- Integração com Firebase Authentication.
- Tratamento de erros.
- Loading.
- Integração com o fluxo de autenticação existente.

---

## Sprint 7 — Autenticação por telefone

**Objetivo**

Implementar autenticação por número de telefone utilizando verificação por SMS.

### Entregas

- Formulário de telefone.
- Envio do código de verificação.
- Validação do código.
- Integração com Firebase Authentication.
- Tratamento de erros.
- Loading.
- Testes utilizando números fictícios do Firebase.

---

## Sprint 8 — Evolução do CRUD

**Objetivo**

Ampliar os recursos de consulta e organização dos registros.

### Entregas

- Pesquisa.
- Paginação.
- Ordenação.
- Estados vazios.

---

## Sprint 9 — Storage e Uploads

**Objetivo**

Adicionar gerenciamento de arquivos utilizando Firebase Storage.

### Entregas

- Integração com Firebase Storage.
- Upload de imagens.
- Preview.
- Exclusão.
- Associação aos registros.

---

## Sprint 10 — Hosting e Publicação

**Objetivo**

Preparar e publicar a aplicação.

### Entregas

- Build de Produção.
- Configuração do Firebase Hosting.
- Regras de Segurança.
- Deploy.
- Checklist de publicação.

---

## Sprint 11 — Qualidade e acessibilidade

**Objetivo**

Elevar a qualidade geral da aplicação e estabelecer as condições necessárias para avaliar sua acessibilidade, utilizando `docs/quality/accessibility.md` como referência.

### Entregas

- Revisão e priorização dos achados preliminares registrados em `docs/quality/accessibility.md`.
- Definição de prioridades e critérios de aceite para as correções.
- Correções de semântica, formulários e mensagens de erro.
- Correções de contraste nos temas claro e escuro.
- Melhorias de navegação por teclado e gerenciamento de foco.
- Revisão de diálogos, toasts e estados de carregamento.
- Melhorias de responsividade e de alvos de interação.
- Avaliação da adoção de `@axe-core/playwright`.
- Criação de testes automatizados de acessibilidade, caso a dependência seja aprovada.
- Integração das verificações à estratégia E2E e ao CI.
- Execução de checklist manual WCAG.
- Verificações com Orca no Ubuntu.
- Atualização da matriz de avaliação, dos problemas, das evidências e do histórico em `docs/quality/accessibility.md`.
- Criação de FIXs para pendências que ultrapassem o escopo da Sprint.
- Avaliação fundamentada sobre a existência de condições para declarar conformidade.

### Critérios de conclusão

- `docs/quality/accessibility.md` atualizado com escopo, métodos, matriz e resultados.
- Achados preliminares priorizados e tratados ou convertidos em FIXs.
- Correções implementadas com testes pertinentes aprovados.
- Testes automatizados de acessibilidade executados, se adotados.
- Checklist manual concluído para as páginas e os fluxos de produção.
- Verificações com Orca registradas.
- Nenhuma reprovação conhecida nos critérios aplicáveis do escopo.
- Conformidade declarada somente se todos os critérios aplicáveis estiverem aprovados ou justificadamente não aplicáveis, com evidências registradas; caso contrário, a conformidade permanece não declarada.
- Requisitos e backlog de remediação atualizados somente em etapa específica, se necessário.

### Organização das atividades

A Sprint está organizada em cinco frentes:

**A. Preparação e critérios de qualidade**

- Utilizar `docs/quality/accessibility.md` como referência.
- Organizar os achados preliminares.
- Definir prioridades e critérios de aceite.

**B. Melhorias de acessibilidade**

- Corrigir problemas de semântica.
- Melhorar formulários e mensagens de erro.
- Corrigir contraste dos temas.
- Melhorar navegação por teclado e gerenciamento de foco.
- Revisar diálogos, toasts e loading.
- Melhorar responsividade e alvos de interação.

**C. Testes automatizados**

- Avaliar a instalação de `@axe-core/playwright`.
- Criar testes de acessibilidade.
- Integrar as verificações à estratégia E2E e CI.

**D. Avaliação manual**

- Executar checklist WCAG.
- Verificar teclado, foco, contraste, zoom e responsividade.
- Realizar verificações com Orca.

**E. Registro dos resultados**

- Atualizar a matriz de avaliação.
- Registrar problemas e resultados.
- Criar novas FIXs para pendências que ultrapassem o escopo da Sprint.
- Avaliar se existem condições para declarar conformidade.

### Dependências

- `docs/quality/accessibility.md` disponível e aprovado como referência.
- Escopo de produção definido, com o Playground excluído da conformidade do produto.
- Decisão sobre a adoção de `@axe-core/playwright`.
- Acesso a uma conta de teste verificada para os fluxos autenticados.
- Ambiente com Orca disponível para as verificações com tecnologia assistiva.

### Dimensionamento e possibilidade de divisão

A proposta inicial é uma única Sprint, com as frentes A e B concentradas no início e as frentes C, D e E na sequência, porque as correções precisam anteceder a avaliação final.

Se a estimativa indicar que o volume de correções e a avaliação não cabem em uma Sprint, a divisão recomendada é:

- **Sprint 11 — Qualidade e correções de acessibilidade:** frentes A e B; conclusão quando os achados estiverem priorizados, as correções implementadas e testadas, e as pendências registradas.
- **Sprint 12 — Testes, auditoria e validação de acessibilidade:** frentes C, D e E; conclusão quando axe, checklist manual, Orca, matriz, evidências e decisão sobre conformidade estiverem concluídos.

A divisão só deve ser adotada após estimativa; não é uma decisão antecipada.

---
