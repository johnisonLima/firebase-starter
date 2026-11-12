# Backlog de Correções e Pendências — Firebase Starter

## 1. Objetivo e escopo

Este documento transforma as lacunas e incertezas identificadas no catálogo [`requirements.md`](requirements.md) em itens rastreáveis de correção, confirmação ou definição. Ele não substitui o catálogo, não cria requisitos de produto e não constitui a matriz de rastreabilidade.

O levantamento original considerou o código e os testes então existentes, as Sprints 1 a 5, o planejamento das Sprints 6 a 10, o backlog, as ADRs e a documentação técnica. Naquela etapa, nenhum código, teste ou documento existente foi alterado.

## 2. Critérios do levantamento

- Status **Parcialmente implementado** foi considerado pendência quando há comportamento incompleto ou indisponível, não apenas falta de testes.
- Ausência de testes foi tratada como pendência obrigatória somente quando a política da ADR-014 se aplica a código de domínio. Código de interface e infraestrutura precisa de estratégia própria, mas não foi considerado incompleto por esse motivo isolado.
- Requisitos planejados permanecem planejados; este documento não os declara implementados nem inventa critérios de aceitação ausentes.
- Configurações do Firebase e secrets do GitHub Actions não foram presumidos. A ausência de configuração no repositório não prova o estado do projeto remoto ou dos secrets.
- Prioridade P0 é reservada a impacto concreto e significativo. P1 indica correção importante, P2 qualidade/consistência ou confirmação necessária, e P3 refinamento não essencial.
- Os FIX IDs são estáveis e não substituem os IDs RF/RNF.

## 3. Resumo do levantamento original

O levantamento original registrou **20 itens**: 4 de implementação parcial, 4 de inconsistência documental, 3 limitações técnicas/comportamentais e 9 confirmações ou definições. Esses quantitativos são a baseline histórica, não o estado atual das correções.

> **Situação atual:** as FIX-001 a FIX-020 foram individualmente encerradas, concluídas ou encerradas com uma decisão/limitação aceita, conforme seus checklists. As FIX-022, FIX-023 e FIX-024, registradas posteriormente à baseline, também estão concluídas. Os problemas e ações abaixo preservam o registro do levantamento original; os resultados atuais aparecem no campo “Encerramento” de cada FIX. Algumas decisões encerradas mantêm trabalho futuro válido, identificado separadamente como planejamento ou definição pendente.

| Categoria | P0 | P1 | P2 | P3 | Total |
|---|---:|---:|---:|---:|---:|
| A. Implementação parcial | 0 | 4 | 0 | 0 | 4 |
| B. Documentação e implementação | 0 | 0 | 4 | 0 | 4 |
| C. Limitações conhecidas | 1 | 0 | 2 | 0 | 3 |
| D. Confirmação e definição | 0 | 2 | 7 | 0 | 9 |
| **Total** | **1** | **6** | **13** | **0** | **20** |

### 3.1 Situação consolidada

As **20 FIXs da baseline estão encerradas**. As **FIX-022, FIX-023 e FIX-024**, incluídas posteriormente, também estão concluídas. “Encerrada” descreve a conclusão da correção, confirmação ou decisão documentada; não significa que todo trabalho de produto ou planejamento relacionado esteja implementado.

| Grupo da baseline | FIXs | Situação atual |
|---|---|---|
| A. Implementação parcial | FIX-001 a FIX-004 | Encerradas com comportamento/testes implementados ou política atendida no escopo inventariado. |
| B. Documentação e implementação | FIX-005 a FIX-008 | Encerradas com alinhamento do Playground, README, backlog e Architecture v1.0. |
| C. Limitações conhecidas | FIX-009 a FIX-011 | Encerradas com restrição do token, limitação de produto aceita para o dashboard e teste de acesso inicial fortalecido. |
| D. Confirmação e definição | FIX-012 a FIX-020 | Encerradas por confirmação externa, decisão de escopo/documentação ou ampliação de cobertura E2E. |
| **Total** | **FIX-001 a FIX-020** | **20 encerradas; pendências futuras relacionadas permanecem discriminadas abaixo.** |

Permanecem como trabalho futuro ou definição de escopo, não como FIXs abertas: finalidade do dashboard (RF-070), melhorias genéricas sem critérios de aceite, avaliação WCAG 2.2 AA proposta para Sprint 11, critérios/checklist/verificação pós-publicação da Sprint 10, e regras definitivas do Firestore sob responsabilidade da FIX-021. A futura API também deverá validar tokens com Firebase Admin SDK.

### 3.2 FIXs posteriores à baseline

| FIX | Categoria | Situação |
|---|---|---|
| FIX-022 | A. Implementação parcial | Concluída em 10/11/2026. |
| FIX-023 | D. Definição de comportamento | Concluída em 10/11/2026. |
| FIX-024 | A. Implementação parcial | Concluída em 10/11/2026. |

As FIX-022, FIX-023 e FIX-024 não integram os quantitativos históricos da tabela da seção 3.1. A FIX-022 foi registrada após a análise documental dos validadores de CPF, CNPJ e CPF ou CNPJ; a FIX-023 formalizou a política de controles desabilitados nos validadores compartilhados; a FIX-024 alinhou o `equalsToValidator` a essa política. Todas estão detalhadas na seção 4.

## 4. Histórico e encerramento das FIX-001 a FIX-020, da FIX-022, da FIX-023 e da FIX-024

As categorias e descrições de problema das FIX-001 a FIX-020 nesta seção reproduzem o levantamento original. A FIX-022 foi registrada posteriormente à baseline, a partir da análise documental e da correção dos validadores documentais; a FIX-023 formalizou a política de controles desabilitados nos validadores compartilhados; a FIX-024 alinhou o `equalsToValidator` a essa política. Nenhum registro histórico anterior foi alterado. Os itens não representam, por si só, tarefas ainda abertas. Cada item registra abaixo seu encerramento e as pendências futuras que permaneceram válidas.

### A. Implementação parcial

#### Autenticação e feedback

##### FIX-001 — Limpeza de erro no formulário de login

- **Encerramento:** concluída. RF-015 foi atendido: editar as credenciais limpa o erro de autenticação; os testes unitários passaram.

- **Categoria:** A. Implementação parcial
- **Requisito relacionado:** RF-015
- **Problema:** o login mantém a mensagem de erro de autenticação após a edição dos campos; cadastro e recuperação limpam o erro ao editar.
- **Evidência:** `src/app/features/auth/pages/login/login.ts` não limpa o erro em alteração do formulário; `register.ts` e `forgot-password.ts` chamam `clearError()`.
- **Impacto:** mensagem obsoleta pode permanecer visível e confundir a pessoa usuária.
- **Prioridade:** P1 — comportamento inconsistente em um fluxo central de autenticação.
- **Ação recomendada:** adotar no login o comportamento de limpeza já usado nos outros formulários.
- **Arquivos envolvidos:** `src/app/features/auth/pages/login/login.ts`, `src/app/core/auth/auth.service.ts` e testes do Login, caso sejam adicionados.
- **Critério de conclusão:** após uma falha de login, editar qualquer campo remove a mensagem de erro; confirmação coberta por teste de componente ou E2E.
- **Dependências/decisões:** nenhuma.

#### Playground e Firestore

##### FIX-002 — Disponibilizar ou retirar a promessa de CRUD no Playground

- **Encerramento:** concluída. Testes com repositório mockado, `PlaygroundUserRepository` e componente foram adicionados; a rota não autenticada foi coberta por E2E. O build passou, assim como 11 arquivos/75 testes unitários. A validação manual com conta autenticada e verificada executou Create, Find By Id, Find All, Update, Delete e Clear. Testes automatizados não acessam o Firebase remoto. O `permission-denied` da validação manual decorreu da regra temporária expirada, cuja data foi atualizada no Console naquela ocasião.

- **Categoria:** A. Implementação parcial
- **Requisito relacionado:** RF-037
- **Problema:** `FirestoreTest` tem operações de criação, consulta, atualização e exclusão, mas não é importado/renderizado pela página principal do Playground.
- **Evidência:** `src/app/features/dev/playground/firestore-test/firestore-test.ts` implementa as operações; `playground.ts` e `playground.html` não o montam.
- **Impacto:** o CRUD não pode ser usado pela interface descrita como Playground.
- **Prioridade:** P1 — recurso explicitamente listado, porém inacessível.
- **Ação recomendada:** decidir se o CRUD deve ser acessível nessa página. Se sim, integrar o componente e verificar o fluxo; se não, remover a promessa da interface/documentação quando essa documentação puder ser atualizada.
- **Arquivos envolvidos:** `firestore-test.ts`, `playground.ts`, `playground.html` e, conforme decisão, documentação do Playground.
- **Critério de conclusão:** decisão registrada; caso mantenha a funcionalidade, ações CRUD acessíveis no Playground e verificadas contra Firestore autorizado; caso contrário, descrições não afirmam disponibilidade pela interface.
- **Dependências/decisões:** decisão de escopo do Playground e disponibilidade/autorização do projeto Firebase de desenvolvimento.

#### Feedback das operações

##### FIX-003 — Definir e completar o resultado do reenvio de verificação

- **Encerramento:** concluída. O reenvio apresenta feedback de sucesso/erro pelo ToastService, usa carregamento local, desabilita a ação durante a operação, impede duplicatas e permite nova tentativa após falha. Os seis testes do componente e a suíte registrada de 63 testes em oito arquivos passaram.

- **Categoria:** A. Implementação parcial
- **Requisito relacionado:** RF-007, RNF-029
- **Problema:** o reenvio chama o serviço, mas a tela não apresenta confirmação de sucesso e não trata a falha. O requisito de feedback do catálogo está marcado parcialmente implementado.
- **Evidência:** `src/app/features/auth/pages/verify-email/verify-email.ts`, método `resendVerificationEmail()`; `verify-email.html` não vincula loading/desabilitação ao botão de reenvio.
- **Impacto:** a pessoa usuária não sabe se o pedido foi concluído ou falhou; repetição pode ocorrer sem indicação.
- **Prioridade:** P1 — lacuna observável em fluxo de conta.
- **Ação recomendada:** primeiro definir as mensagens e o comportamento durante sucesso, erro e operação em curso; depois implementar feedback e bloqueio de repetição conforme o padrão escolhido.
- **Arquivos envolvidos:** `verify-email.ts`, `verify-email.html`, `AuthService` e teste de `VerifyEmail`.
- **Critério de conclusão:** sucesso e falha têm feedback observável; operação em andamento tem comportamento definido; testes cobrem sucesso e erro.
- **Dependências/decisões:** definição do texto/estilo de feedback e confirmação se Toast existente deve ser usado.

#### Testabilidade de domínio

##### FIX-004 — Cumprir a política de testes unitários de domínio

- **Encerramento:** concluída para o escopo inventariado em `src/app/shared/utils/`, conforme ADR-014. Foram cobertos validadores, mensagens de erro e limites de CPF/CNPJ; 13 arquivos de teste e 140 testes passaram. Não houve alteração em código de produção. Isso não afirma cobertura integral de todo o domínio da aplicação.

- **Categoria:** A. Implementação parcial
- **Requisito relacionado:** RNF-031, ADR-014
- **Problema:** a cobertura visível inclui os utilitários de CPF/CNPJ, mas não demonstra testes para todo o código de domínio abrangido pela ADR-014.
- **Evidência:** `src/app/shared/utils/documents/cpf.spec.ts` e `cnpj.spec.ts` são os testes utilitários; funções em `src/app/shared/utils/forms/validators.ts`, `error-messages.ts` e `validator-errors.ts` não têm testes correspondentes identificados. A ADR-014 exige teste para código de domínio, sucesso, erro e limites quando aplicável.
- **Impacto:** comportamento puro pode regredir sem detecção automatizada e a política aprovada não está demonstravelmente cumprida.
- **Prioridade:** P1 — requisito arquitetural explícito.
- **Ação recomendada:** inventariar código puro/domínio e criar testes Vitest para o escopo aplicável, sem incluir automaticamente interface ou infraestrutura excluída pela ADR.
- **Arquivos envolvidos:** utilitários compartilhados em `src/app/shared/utils/` e respectivos `*.spec.ts`; ADR-014 como critério.
- **Critério de conclusão:** inventário de domínio revisado; todo código abrangido possui testes dos cenários aplicáveis; `npm run test:unit` passa.
- **Dependências/decisões:** concordância sobre quais módulos são domínio versus integração, aplicando os limites já definidos na ADR-014.

### B. Inconsistências entre documentação e implementação

#### Estado do Playground

##### FIX-005 — Alinhar o estado do projeto sobre CRUD no Playground

- **Encerramento:** concluída em 06/11/2026. `docs/project-status.md` descreve o `FirestoreTest` integrado à rota protegida do Playground e a coleção `playground_users`, diferenciando uso de desenvolvimento da validação definitiva das Security Rules. A FIX-021 permanece responsável por estas regras.

- **Categoria:** B. Documentação e implementação
- **Requisito relacionado:** RF-037
- **Problema:** o estado do projeto diz que o Playground contém interface para operações Firestore, mas a página atual não monta `FirestoreTest`.
- **Evidência:** `docs/project-status.md`, seção de funcionalidades implementadas; implementação em `src/app/features/dev/playground/playground/playground.ts` e ausência de import/renderização de `FirestoreTest`.
- **Impacto:** leitores podem considerar acessível uma funcionalidade que existe apenas como componente isolado.
- **Prioridade:** P2 — inconsistência documental relevante, sem alterar o comportamento por si só.
- **Ação recomendada:** após resolver FIX-002, atualizar `docs/project-status.md` para refletir a decisão e o estado real.
- **Arquivos envolvidos:** `docs/project-status.md`; depende de FIX-002.
- **Critério de conclusão:** afirmação sobre interface CRUD coincide com a disponibilidade real.
- **Dependências/decisões:** FIX-002.

##### FIX-006 — Atualizar o README do Playground

- **Encerramento:** concluída em 09/11/2026. O README documenta as cinco categorias, dez demonstrações, autenticação e guards, integração do Firestore CRUD, coleção `playground_users`, limitações e cobertura de testes.

- **Categoria:** B. Documentação e implementação
- **Requisito relacionado:** RF-036, RF-037
- **Problema:** o README marca autenticação, Toast e Dialog como não implementados, embora haja demonstrações dessas áreas na página; marca CRUD como concluído, embora a interface CRUD não esteja conectada à página.
- **Evidência:** `src/app/features/dev/playground/README.md` comparado com `playground.html`, `playground.ts` e `firestore-test.ts`.
- **Impacto:** instruções de desenvolvimento contradizem o conteúdo atual.
- **Prioridade:** P2 — documentação operacional desatualizada.
- **Ação recomendada:** revisar as marcações após FIX-002 e refletir somente seções efetivamente acessíveis.
- **Arquivos envolvidos:** `src/app/features/dev/playground/README.md`; depende de FIX-002.
- **Critério de conclusão:** cada item do README corresponde a uma seção existente e acessível, ou está claramente indicado como não disponível.
- **Dependências/decisões:** FIX-002.

#### Roadmap e arquitetura

##### FIX-007 — Corrigir a pendência de lazy loading no backlog

- **Encerramento:** concluída. `docs/sprints/backlog.md` foi atualizado para remover Lazy Loading das pendências e preservar otimizações adicionais e demais itens futuros. A implementação existente em `app.routes.ts` foi confirmada; código e testes não foram alterados.

- **Categoria:** B. Documentação e implementação
- **Requisito relacionado:** RNF-036
- **Problema:** o backlog lista “Lazy Loading” como futuro, mas as rotas já usam `loadChildren`/`loadComponent`.
- **Evidência:** `docs/sprints/backlog.md` e `src/app/app.routes.ts`.
- **Impacto:** roadmap pode duplicar trabalho existente e confundir planejamento.
- **Prioridade:** P2 — inconsistência de planejamento.
- **Ação recomendada:** remover ou reescrever a parte concluída do item ao atualizar o backlog, preservando apenas melhorias futuras que tenham escopo definido.
- **Arquivos envolvidos:** `docs/sprints/backlog.md`, `src/app/app.routes.ts`.
- **Critério de conclusão:** backlog não apresenta lazy loading já implementado como funcionalidade ausente.
- **Dependências/decisões:** nenhuma; a alteração do backlog está fora do escopo desta etapa.

##### FIX-008 — Alinhar a visão arquitetural à estrutura do repositório

- **Encerramento:** concluída. `Architecture-v1.0.md` foi corrigida: referências físicas a `layouts/` e `styles/` foram removidas, `src/styles.scss`, a árvore de diretórios e o diagrama Mermaid foram alinhados ao repositório. Referências conceituais a layouts foram preservadas; nenhum ADR ou código foi alterado.

- **Categoria:** B. Documentação e implementação
- **Requisito relacionado:** RNF-001, RNF-041
- **Problema:** Architecture v1.0 cita diretórios `layouts/` e `styles/` que não existem na estrutura atual; estilos globais estão em `src/styles.scss`.
- **Evidência:** `docs/Architecture-v1.0.md` versus árvore `src/`.
- **Impacto:** orientação arquitetural pode induzir localização errada de novos arquivos.
- **Prioridade:** P2 — reduz clareza de manutenção.
- **Ação recomendada:** corrigir apenas a representação estrutural da documentação, sem alterar ADRs nem criar diretórios para satisfazer um diagrama desatualizado.
- **Arquivos envolvidos:** `docs/Architecture-v1.0.md`, `src/styles.scss`.
- **Critério de conclusão:** estrutura documentada corresponde à organização atual.
- **Dependências/decisões:** nenhuma; a alteração da Architecture está fora do escopo desta etapa.

### C. Limitações conhecidas

#### Autenticação e segurança

##### FIX-009 — Restringir destinos que recebem o token Firebase

- **Encerramento:** concluída. O frontend restringe o token a origens confiáveis e o AuthInterceptor conta com 22 testes. A suíte registrada nessa FIX teve 58 testes aprovados. A configuração atual de `API_CONFIG.trustedOrigins` está vazia. A futura validação do token pela API com Firebase Admin SDK permanece responsabilidade do backend e está registrada no backlog futuro.

- **Categoria:** C. Limitação técnica/comportamental
- **Requisito relacionado:** RF-052, RNF-015
- **Problema:** o interceptor anexa o ID token a qualquer requisição HTTP processada enquanto houver usuário autenticado, sem validar host/origem.
- **Evidência:** `src/app/core/interceptors/auth.interceptor.ts` não verifica URL. O Playground inclui chamadas para `jsonplaceholder.typicode.com` em `src/app/features/dev/playground/playground/playground.ts`; autenticado, o token também será enviado nessas chamadas.
- **Impacto:** token de identidade pode ser entregue a serviço de terceiro quando a aplicação faz uma requisição a esse serviço.
- **Prioridade:** P0 — há caminho demonstrável de envio de credencial de autenticação a host externo, com impacto de segurança concreto.
- **Ação recomendada:** restringir a anexação a destinos confiáveis definidos pelo projeto e/ou permitir opt-out explícito em requisições públicas; validar que chamadas externas não recebem `Authorization`.
- **Arquivos envolvidos:** `src/app/core/interceptors/auth.interceptor.ts`, `src/app/features/dev/playground/playground/playground.ts`, testes do interceptor.
- **Critério de conclusão:** token enviado apenas para destinos aprovados; teste prova que host externo não recebe o cabeçalho e chamadas à API autorizada continuam autenticadas.
- **Dependências/decisões:** aprovar lista/critério de destinos confiáveis; nenhuma alteração remota do Firebase é necessária.

#### Disponibilidade de funcionalidades

##### FIX-010 — Registrar a finalidade de produto ainda indefinida do dashboard

- **Encerramento:** concluída como decisão de escopo/limitação aceita. O dashboard permanece uma página protegida básica; a finalidade de produto continua pendente, sem necessidade de implementação imediata. RF-070 permanece Planejado.

- **Categoria:** C. Limitação conhecida aceita até decisão de produto
- **Requisito relacionado:** RF-070
- **Problema:** o dashboard foi criado nas primeiras sprints como uma página protegida básica, utilizada para validar o fluxo de autenticação e o acesso à área autenticada. A escolha foi circunstancial e não houve, naquele momento, definição de produto que estabelecesse o dashboard como tela de indicadores e estatísticas. Sua finalidade definitiva como funcionalidade de produto ainda não foi estabelecida.
- **Evidência:** `src/app/features/dashboard/dashboard.html` contém apenas o botão de logout e a alternância de tema; o item “Dashboard com indicadores e estatísticas — RF-070” permanece no backlog como possibilidade futura; `docs/requirements/requirements.md` mantém o RF-070 como Planejado.
- **Impacto:** a ausência de indicadores e estatísticas não representa uma deficiência em relação ao objetivo original das primeiras sprints, que era validar a autenticação e o acesso protegido. O dashboard cumpre esse papel como página básica; a lacuna é de definição de produto, não de implementação de uma funcionalidade já acordada.
- **Prioridade:** P2 — decisão de produto pendente; não exige implementação imediata.
- **Ação recomendada:** manter o dashboard como página protegida básica e registrar que sua finalidade definitiva será definida pelo responsável pelo produto. Caso a decisão seja implementar indicadores e estatísticas, priorizar o RF-070 no backlog e definir escopo, fontes de dados e critérios de aceite antes de qualquer implementação. Não há necessidade de implementar funcionalidades adicionais no dashboard nesta correção.
- **Arquivos envolvidos:** `src/app/features/dashboard/`, `docs/sprints/backlog.md` e RF-070 em `docs/requirements/requirements.md` (somente referência).
- **Critério de conclusão:** estado atual do dashboard documentado como página protegida básica, com finalidade definitiva de produto ainda pendente de decisão. Essa pendência é explicitamente aceita nesta etapa, não sendo necessário definir a finalidade definitiva, priorizar o RF-070 ou implementar funcionalidades adicionais para concluir esta correção.
- **Dependências/decisões:** definição de produto sobre a finalidade do dashboard e, se aplicável, priorização do RF-070, fontes de dados e critérios de aceite.

#### Cobertura E2E

##### FIX-011 — Fortalecer a verificação E2E do acesso inicial

- **Encerramento:** concluída. O teste de `/` valida a URL `/login` e o título acessível “Entrar”, sem depender da URL `localhost:4200`. A suíte E2E passou na validação registrada pela FIX.

- **Categoria:** C. Limitação de testabilidade
- **Requisito relacionado:** RNF-032
- **Problema:** o teste de acesso inicial verifica apenas se a URL contém `localhost:4200`, o que não comprova que a aplicação abriu ou redirecionou corretamente.
- **Evidência:** `tests/playwright/app/access.spec.ts` contém somente `expect(page).toHaveURL(/localhost:4200/)` após `goto('/')`.
- **Impacto:** falhas de carregamento ou conteúdo podem passar por esse teste.
- **Prioridade:** P2 — reduz a confiança de um cenário básico, mas os fluxos de login/dashboard têm asserções adicionais.
- **Ação recomendada:** definir o resultado esperado para `/` e assertar URL de destino e/ou conteúdo acessível correspondente.
- **Arquivos envolvidos:** `tests/playwright/app/access.spec.ts`.
- **Critério de conclusão:** teste falha quando a aplicação não carrega ou não chega ao resultado esperado, sem depender de seletores CSS.
- **Dependências/decisões:** confirmar se o resultado esperado da raiz continua sendo `/login`, conforme RF-021.

### D. Pendências de confirmação e definição

#### Firebase e ambiente de execução

##### FIX-012 — Confirmar proteção contra enumeração no Firebase Auth

- **Encerramento:** concluída por confirmação externa e testes manuais. O Firebase Console indicou proteção contra enumeração ativa; recuperação com e-mail cadastrado e inexistente mostrou a mesma mensagem de sucesso, sem revelar a existência da conta. Alterações no código não foram necessárias.

- **Categoria:** D. Confirmação externa
- **Requisito relacionado:** RF-005
- **Problema:** não é possível confirmar no repositório se o Firebase Auth está configurado para não revelar a existência do e-mail no fluxo de recuperação.
- **Evidência:** a aplicação exibe sucesso após resolução de `sendPasswordResetEmail` em `forgot-password.ts`; não há configuração remota versionada que demonstre o comportamento do projeto Firebase.
- **Impacto:** a garantia de privacidade descrita como dependente de configuração externa pode não corresponder ao ambiente efetivo.
- **Prioridade:** P1 — confirmar antes de tratar a não enumeração como comportamento garantido.
- **Ação recomendada:** responsável pelo projeto verificar a configuração ativa e validar o comportamento com contas existentes e inexistentes, sem expor dados de usuários.
- **Arquivos envolvidos:** Firebase Console/configuração do projeto; `src/app/core/auth/auth.service.ts`, `forgot-password.ts`.
- **Critério de conclusão:** configuração e comportamento observados documentados; requisito continua limitado ao comportamento comprovado.
- **Dependências/decisões:** acesso autorizado ao projeto Firebase e decisão de segurança do responsável.

##### FIX-013 — Confirmar estado de regras e serviços Firebase antes da publicação

- **Encerramento:** concluída como levantamento externo histórico. Authentication e Firestore estavam ativos, proteção contra enumeração habilitada, Storage e Hosting não habilitados; as regras eram mantidas no Firebase Console. A regra temporária verificada então expirava em 05/11/2026; sua vigência posterior não foi reconfirmada. A FIX-021 permanece responsável pelas regras definitivas. Nenhum recurso remoto foi alterado nessa confirmação.

- **Categoria:** D. Confirmação externa
- **Requisito relacionado:** RNF-042, RF-064, RF-068
- **Problema:** não foram encontrados `firebase.json`, regras Firestore/Storage ou configuração de Hosting no repositório. Isso não prova que regras/configurações estejam ausentes no console remoto.
- **Evidência:** busca de configuração no repositório; Sprint 9 planeja Storage e Sprint 10 planeja Hosting/regras.
- **Impacto:** estado real de autorização e publicação não pode ser verificado localmente; guards de cliente não protegem dados no servidor.
- **Prioridade:** P1 — necessário confirmar antes de publicar ou habilitar operações com dados/arquivos.
- **Ação recomendada:** confirmar quais serviços estão ativos e onde suas regras são mantidas; antes de publicar, assegurar regras versionadas/revisadas ou processo equivalente definido pelo projeto.
- **Arquivos envolvidos:** estado remoto do Firebase; quando planejado, configuração/rules no repositório.
- **Critério de conclusão:** serviços usados, regras efetivas e processo de publicação identificados e revisados pelo responsável.
- **Dependências/decisões:** acesso autorizado; nenhuma alteração remota está autorizada por este levantamento.

##### FIX-014 — Confirmar disponibilidade dos secrets E2E no CI

- **Encerramento:** concluída por confirmação do responsável. Secrets E2E, conta válida/verificada, testes autenticados anteriores no CI, revisão de logs/workflow e inventário documental foram confirmados. Forks e Dependabot sem secrets continuam sujeitos ao skip documentado; esse comportamento não foi validado diretamente.

- **Categoria:** D. Confirmação de ambiente
- **Requisito relacionado:** RNF-035
- **Problema:** workflow referencia secrets E2E, mas a presença/validade deles nas configurações do GitHub não é visível no repositório.
- **Evidência:** `.github/workflows/ci.yml` injeta `E2E_USER_EMAIL` e `E2E_USER_PASSWORD`; testes autenticados lançam erro quando variáveis estão ausentes.
- **Impacto:** pipeline pode falhar nos cenários autenticados caso os secrets não estejam configurados ou a conta não seja válida/verificada.
- **Prioridade:** P2 — dependência operacional que pode impedir CI, sem evidência local de ausência.
- **Ação recomendada:** responsável verificar existência e validade dos secrets e da conta de teste sem imprimir valores ou credenciais.
- **Arquivos envolvidos:** `.github/workflows/ci.yml`, `tests/playwright/auth/login.spec.ts`, `tests/playwright/auth/dashboard.spec.ts`, configurações do repositório GitHub.
- **Critério de conclusão:** execução autenticada do CI passa com secrets válidos; nenhum valor secreto é exposto em logs.
- **Dependências/decisões:** acesso autorizado às configurações e execução de CI.

#### Decisões de escopo e documentação

##### FIX-015 — Resolver a divergência documental dos breakpoints

- **Encerramento:** concluída. ADR-028 adotou os cinco breakpoints padrão do Tailwind CSS 4; a ADR-010 recebeu metadados/aviso de substituição e o Design System de responsividade foi alinhado.

- **Categoria:** D. Definição documental
- **Requisito relacionado:** RNF-023
- **Problema:** ADR-010 cita `sm`, `md` e `lg`, enquanto o Design System também cita `xl` e `2xl`.
- **Evidência:** `docs/adr/ADR-010-interface-mobile-first.md` versus `docs/ui/design-system/07-Responsvidade.md`.
- **Impacto:** especificação responsiva contraditória; não há critério documental único para revisão de layouts.
- **Prioridade:** P2 — afeta consistência e verificabilidade, não comprova falha visual por si só.
- **Ação recomendada:** responsável técnico confirmar o conjunto de breakpoints pretendido e então alinhar documentação sem alterar ADR existente silenciosamente.
- **Arquivos envolvidos:** ADR-010 e Design System de responsividade.
- **Critério de conclusão:** documentos concordam, com eventual decisão arquitetural nova registrada pelo processo do projeto.
- **Dependências/decisões:** decisão do responsável; possível nova ADR se houver mudança da decisão aprovada.

##### FIX-016 — Definir critérios para itens genéricos do backlog

- **Encerramento:** concluída como decisão de escopo. Melhorias genéricas foram separadas dos requisitos e mantidas como não aprovadas para execução até definição de escopo e critérios. RF-070 a RF-073 foram preservados; RF-062 e Lazy Loading não foram reintroduzidos; o histórico das Sprints foi preservado.

- **Categoria:** D. Definição de escopo
- **Requisito relacionado:** RF-062 removido do catálogo; temas de otimizações e melhorias adicionais também não catalogados como requisitos verificáveis.
- **Problema:** “melhorias na listagem”, “otimizações adicionais” e “melhorias adicionais de interface” não definem resultado observável nem critério de aceite.
- **Evidência:** `docs/sprints/sprint-planning.md` e `docs/sprints/backlog.md`; os requisitos genéricos foram retirados de `requirements.md` e mantidos como pendência de escopo.
- **Impacto:** não é possível estimar, implementar ou verificar esses itens com consistência.
- **Prioridade:** P2 — necessário antes de planejar essas melhorias em uma Sprint.
- **Ação recomendada:** responsável decompor apenas os itens que deseja priorizar em comportamentos/atributos verificáveis; retirar do backlog o que não for prioridade.
- **Arquivos envolvidos:** backlog, planejamento e futuro catálogo de requisitos (fora do escopo desta etapa).
- **Critério de conclusão:** cada item priorizado possui escopo e critério de aceite; itens sem intenção de execução são removidos do planejamento.
- **Dependências/decisões:** priorização do responsável pelo projeto.

##### FIX-017 — Definir objetivo de conformidade de acessibilidade

- **Encerramento:** concluída como definição de objetivo, não como auditoria. WCAG 2.2 AA, escopo de produção, exclusão do Playground, métodos e registro de evidências foram documentados em `docs/quality/accessibility.md`. Conformidade não foi declarada. Sprint 11 foi proposta, com possibilidade de dividir o trabalho em duas Sprints; Sprint 5 não foi reaberta.

- **Categoria:** D. Critério de qualidade
- **Requisito relacionado:** RNF-022
- **Problema:** catálogo registra conformidade WCAG como “A validar”, mas não define nível/versão, telas cobertas ou método de verificação.
- **Evidência:** `requirements.md` não especifica critérios; não foram identificados relatórios de auditoria ou testes de acessibilidade.
- **Impacto:** não há base objetiva para declarar conformidade ou conclusão.
- **Prioridade:** P2 — importante para qualidade e verificabilidade, sem evidência de falha específica que justifique P0/P1.
- **Ação recomendada:** decidir padrão, nível, escopo e forma de auditoria antes de validar o requisito.
- **Arquivos envolvidos:** definição do requisito; telas da aplicação e futura evidência de auditoria.
- **Critério de conclusão:** escopo e critérios definidos e resultados de avaliação registrados; não presumir conformidade antes disso.
- **Dependências/decisões:** decisão do responsável sobre nível e cobertura pretendidos.

##### FIX-018 — Registrar evidência do “CRUD validado ponta a ponta” da Sprint 3

- **Encerramento:** concluída como esclarecimento histórico. A expressão refere-se a validação manual realizada na Sprint 3 com `FirestoreTest`. Ela não deve ser apresentada como teste automatizado; os testes automatizados atuais usam mocks. Nenhuma documentação adicional foi necessária nessa FIX.

- **Categoria:** D. Confirmação histórica
- **Requisito relacionado:** RF-027 a RF-037
- **Problema:** histórico registra CRUD “validado ponta a ponta”, mas o repositório atual não contém teste automatizado de dados e a interface `FirestoreTest` não está montada. Não é possível concluir se a validação histórica foi manual ou se o código mudou desde então.
- **Evidência:** `docs/sprints/sprints.md`; `src/app/core/data/`; componente Firestore isolado.
- **Impacto:** a alegação histórica pode ser interpretada indevidamente como validação automatizada ou estado atual acessível.
- **Prioridade:** P2 — afeta interpretação da evidência, sem invalidar por si só a implementação da camada de dados.
- **Ação recomendada:** responsável confirmar o significado e a evidência da validação da Sprint 3; registrar a natureza manual/automatizada na documentação de estado quando autorizado.
- **Arquivos envolvidos:** histórico das Sprints e documentação de estado (alteração fora do escopo desta etapa).
- **Critério de conclusão:** origem/natureza da validação confirmada e alegações documentais não sugerem cobertura inexistente.
- **Dependências/decisões:** confirmação de quem executou a validação e em qual configuração.

##### FIX-019 — Confirmar checklist e critérios da publicação planejada

- **Encerramento:** concluída como registro da necessidade de planejamento. O bloco desta FIX registra critérios verificáveis, checklist e verificação pós-publicação como trabalho futuro, preserva FIX-013 como evidência histórica e mantém FIX-021 responsável pelas regras definitivas. A expiração em 05/11/2026 não foi reconfirmada depois da data.

- **Categoria:** D. Confirmação de planejamento
- **Requisito relacionado:** RNF-043, RF-068, RF-069
- **Problema:** a Sprint 10 planeja preparação, Hosting, regras, deploy e checklist, mas não define critérios de conclusão próprios nem o conteúdo verificável do checklist. O build de produção já é gerado e verificado pela CI, o que não comprova preparação/publicação completa. A confirmação externa da FIX-013 esclareceu o estado dos serviços Firebase, mas não definiu o processo de publicação nem os critérios de conclusão da Sprint 10.
- **Evidência:** `docs/sprints/sprint-planning.md` (Sprint 10); `angular.json`; `.github/workflows/ci.yml`; ausência de `firebase.json`, `.firebaserc` e regras versionadas no repositório; confirmação externa da FIX-013 (concluída), que registrou Firebase Authentication ativo e verificado no Console, proteção contra enumeração de e-mails habilitada, Cloud Firestore ativo com regras verificadas diretamente no Console, regra temporária com expiração em 05/11/2026, regras mantidas no Console, Cloud Storage e Firebase Hosting ainda não habilitados e confirmação realizada sem alterações remotas. Essas informações refletem o estado verificado na ocasião da FIX-013; o estado atual da regra temporária após 05/11/2026 não foi reconfirmado nesta etapa.
- **Impacto:** não se pode afirmar que publicação ou checklist estejam concluídos; sem critérios delimitados, a Sprint 10 pode ser encerrada sem evidência verificável de preparação, configuração, deploy e verificação pós-publicação.
- **Prioridade:** P2 — item de sprint futura, requer definição antes de sua execução.
- **Ação recomendada:** ao planejar a Sprint 10, definir o escopo e os critérios de conclusão de cada etapa — preparação para publicação, configuração do Firebase Hosting, entrega de regras conforme a FIX-021, execução do deploy e verificação pós-publicação —, além do conteúdo, responsável e aprovação do checklist. Usar os resultados da FIX-013 como baseline do estado dos serviços, sem repetir a confirmação externa. Referenciar a FIX-021 para as regras definitivas do Firestore, sem antecipar decisões. Não duplicar verificações já cobertas pela CI ou pela Sprint 11.
- **Arquivos envolvidos:** planejamento da Sprint 10, futura configuração de Hosting (`firebase.json`/`.firebaserc`), checklist de publicação e documentação de verificação pós-publicação.
- **Critério de conclusão:** escopo e critérios de conclusão da Sprint 10 definidos e aprovados, distinguindo preparação para publicação, configuração do Hosting, entrega de regras conforme a FIX-021, execução do deploy e verificação pós-publicação; checklist documentado, aprovado e com execução registrada separadamente; resultados da FIX-013 registrados como evidência de base; dependência da FIX-021 para as regras definitivas explicitada, sem antecipação de decisões; verificações já cobertas pela CI e pela Sprint 11 referenciadas sem duplicação.
- **Dependências/decisões:** FIX-013 concluída; seus resultados são evidência disponível e não constituem dependência pendente. FIX-021 permanece responsável pela definição das regras definitivas do Firestore. A configuração de Hosting e Storage segue o planejamento das Sprints 10 e 9, respectivamente. O escopo, a aprovação do checklist e os critérios de cada etapa dependem de decisão do responsável.

##### FIX-020 — Confirmar a cobertura E2E desejada para autenticação

- **Categoria:** D. Definição de cobertura
- **Prioridade na baseline:** P2.
- **Requisito relacionado:** RNF-032; RF-001, RF-004, RF-006 a RF-008
- **Encerramento original:** 06/11/2026, com estratégia de cobertura e CI condicionada a secrets. A implementação complementar foi validada em 09/11/2026.
- **Baseline do problema:** a suíte inicial não cobria cadastro, recuperação e verificação por E2E, e não havia escopo documentado para esses fluxos.
- **Encerramento:** concluída em duas etapas. A estratégia e a CI condicionada aos secrets foram implementadas na FIX-020 original; em complemento, os testes mockados foram separados dos autenticados por projetos Playwright e tags `@authenticated`. Os projetos `mock-*` independem de credenciais; os `auth-*` continuam usando setup real e `storageState`.
- **Cobertura atual:** Chromium, Firefox e WebKit executam os projetos mockados e autenticados. Há cenários de login válido e inválido, cadastro, recuperação, envio/reenvio e reverificação de e-mail, acesso e proteção do dashboard, logout e redirecionamentos.
- **Arquivos/evidências:** `playwright.config.ts`, `tests/playwright/auth/`, `tests/playwright/app/`, `tests/playwright/support/`, [`docs/testing/e2e-strategy.md`](../testing/e2e-strategy.md), ADR-025, ADR-026, ADR-027 e ADR-029.
- **Validações complementares locais:** 63/63 execuções mockadas passaram sem variáveis E2E e sem carregar `.env`; 10/10 execuções autenticadas passaram (incluindo setup); 73/73 execuções passaram na suíte completa. O type-check Playwright e `git diff --check` passaram. O histórico informado pelo responsável registra 67 execuções E2E aprovadas antes da implementação complementar e execuções anteriores bem-sucedidas no GitHub Actions.
- **CI e secrets:** o workflow não foi alterado na implementação complementar e não houve nova execução do GitHub Actions nessa rodada. Secrets e conta E2E foram confirmados historicamente; Pull Requests de forks e Dependabot sem secrets continuam com a E2E ignorada e essa condição não foi validada diretamente.
- **Ressalva:** testes com mocks não validam o Firebase remoto; os testes autenticados usam a conta E2E dedicada. Execuções locais, execuções históricas no GitHub Actions e ausência de validação de forks/Dependabot permanecem evidências distintas.

### E. Correção posterior à baseline

#### Validação documental

##### FIX-022 — Rejeitar valores numéricos falsy nos validadores documentais

- **Encerramento:** concluída em 10/11/2026. A implementação passou a usar verificação explícita de valores ausentes em `src/app/shared/utils/forms/validators.ts`; os testes de `src/app/shared/utils/forms/validators.spec.ts` foram atualizados para rejeitar `0`, `false` e `NaN` e manter `null`, `undefined` e `''` como ausentes. O contrato funcional foi formalizado em `docs/requirements/requirements.md` como critério complementar aos RF-047, RF-048 e RF-049.

- **Categoria:** A. Implementação parcial
- **Requisitos relacionados:** RF-047, RF-048, RF-049, RNF-031 e ADR-014.
- **Problema:** os validadores documentais utilizavam `!control.value` para identificar valores ausentes. Com isso, valores como `0`, `false` e `NaN` eram tratados como vazios, embora não representem ausência de informação.
- **Correção realizada:** implementada verificação explícita de valores vazios; criado helper privado compartilhado `isEmptyValue`; mantida a conversão `String(value)` para os demais valores; preservado o comportamento dos controles desabilitados.
- **Testes atualizados:**
  - CPF: rejeita `0`, `false` e `NaN`.
  - CNPJ: rejeita `0`, `false` e `NaN`.
  - CPF ou CNPJ: rejeita `0`, `false` e `NaN`.
  - Os três validadores continuam ignorando `null`, `undefined` e `''`.
  - Os testes de controles desabilitados permanecem válidos.
- **Critério de conclusão:** os valores ausentes devem ser tratados conforme o contrato documentado. Valores falsy diferentes de `null`, `undefined` e `''` devem ser submetidos à validação documental e rejeitados quando inválidos.
- **Arquivos envolvidos:** `src/app/shared/utils/forms/validators.ts`, `src/app/shared/utils/forms/validators.spec.ts` e `docs/requirements/requirements.md`.

#### Validadores compartilhados

##### FIX-024 — Alinhar o equalsToValidator à política de controles desabilitados

- **Encerramento:** concluída em 10/11/2026. O `equalsToValidator` passou a retornar `null` quando o controle validado ou o controle comparado estiver desabilitado, aplicando a política formalizada na FIX-023.

- **Categoria:** A. Implementação parcial
- **Requisitos relacionados:** RF-050, RF-013, RNF-031 e ADR-014.
- **Problema:** o `equalsToValidator` comparava os valores dos controles sem verificar se algum deles estava desabilitado. Isso permitia que controles fora do processo de validação participassem da comparação, contrariando a política formalizada na FIX-023.
- **Correção realizada:** adicionada a guarda `if (control.disabled || otherControl.disabled) { return null; }` em `src/app/shared/utils/forms/validators.ts`, antes da comparação dos valores. Foram preservados o retorno `null` na ausência de `parent`, o retorno `null` quando o controle comparado não existe, a comparação estrita com `===` e o formato do erro `{ equalsTo: true }`.
- **Testes atualizados:**
  - Atualizado o teste que esperava erro para controle validado desabilitado, que passou a esperar `null`.
  - Adicionado teste para controle comparado desabilitado.
  - Adicionado teste para ambos os controles desabilitados.
  - Preservados os testes de valores iguais, valores diferentes, ausência de `parent`, ausência do controle comparado, comparação de `0` e dois campos vazios.
- **Validações executadas:**
  - Testes específicos de `validators.spec.ts`: 40/40 aprovados.
  - Suíte unitária: 231/231 aprovados em 19 arquivos.
  - TypeScript da aplicação (`tsconfig.app.json`): OK.
  - TypeScript dos testes (`tsconfig.spec.json`): OK.
  - `git diff --check`: sem erros.
- **Critério de conclusão:** os cenários com qualquer controle desabilitado devem retornar `null`; com ambos habilitados, a comparação deve manter o comportamento anterior. `register.ts` deve permanecer inalterado, preservando a revalidação por `password.valueChanges`.
- **Arquivos envolvidos:** `src/app/shared/utils/forms/validators.ts` e `src/app/shared/utils/forms/validators.spec.ts`.
- **Fundamento:** política de controles desabilitados formalizada na FIX-023 e registrada em `docs/requirements/requirements.md`.

### F. Definição posterior à baseline

#### Validadores compartilhados

##### FIX-023 — Formalizar a política de não validação de controles desabilitados

- **Encerramento:** concluída em 10/11/2026, exclusivamente por decisão documental. A política foi formalizada em `docs/requirements/requirements.md` como critério complementar aplicável aos validadores compartilhados. Nenhuma implementação ou teste foi alterado nesta FIX.

- **Categoria:** D. Definição de comportamento
- **Requisitos relacionados:** RF-047, RF-048, RF-049, RF-050, RNF-031 e ADR-014.
- **Problema:** os validadores documentais já ignoram controles desabilitados, mas não existe uma política geral documentada para os validadores compartilhados. O `equalsToValidator` não considera explicitamente o estado desabilitado do controle validado ou do controle comparado.
- **Decisão:** formalizar que controles desabilitados ficam fora do processo de validação, incluindo dependências utilizadas por validadores que comparam múltiplos controles.
- **Evidências:**
  - Angular Forms 21.2.18 não executa validadores de controles desabilitados no fluxo normal.
  - `disable()` define o estado `DISABLED` e limpa `errors`.
  - `enable()` reexecuta a validação.
  - Os três validadores documentais já respeitam essa política.
  - A divergência do `equalsToValidator` será corrigida separadamente pela FIX-024.
- **Critério de conclusão:**
  - Política geral documentada em `requirements.md`.
  - Escopo da FIX-024 claramente delimitado.
  - Nenhuma alteração de implementação ou testes nesta FIX.
- **Arquivos envolvidos:** `docs/requirements/requirements.md` e `docs/requirements/remediation-backlog.md`.

- **Relação com a FIX-024:** a pendência foi concluída em 10/11/2026, com o alinhamento do `equalsToValidator` à política formalizada nesta FIX, incluindo o estado desabilitado do controle comparado e os testes correspondentes. O registro da correção está na FIX-024.

### FIX-021 — Revisar as Firestore Security Rules (em andamento)

- **Andamento documental:** contrato proposto do perfil `users/{uid}` e matriz de autorização com as Custom Claims `canEditAllProfiles` e `canDeleteAllProfiles` formalizados em [`docs/data/user-profile.md`](../data/user-profile.md) e [`docs/security/firestore-authorization.md`](../security/firestore-authorization.md).
- **Andamento arquitetural:** política de autorização registrada na [ADR-030 — Autorização de perfis por Custom Claims do Firebase Authentication](../adr/ADR-030-autorizacao-de-perfis-por-custom-claims-do-firebase-authentication.md).
- **Concluído nesta etapa:** reorganizar os testes por ferramenta; preparar configuração independente de Vitest, `@firebase/rules-unit-testing` e Firestore Emulator com project ID `demo-*`; criar utilitários iniciais e comandos separados de execução e type-check. Esta etapa não implementa cenários nem altera as regras.
- **Pendente:** implementar e revisar as Firestore Security Rules; adicionar e executar cenários de autorização e validação no Firestore Emulator; confirmar o estado remoto necessário sem alterar recursos Firebase sem autorização.
- **Status:** FIX-021 permanece aberta. A formalização documental não representa implementação, publicação nem validação das regras.
- **Relação com requisitos:** RNF-042.

## 5. Dependências identificadas no levantamento original (histórico)

- **FIX-002 → FIX-005 e FIX-006:** dependência histórica encerrada; CRUD integrado e estado/README atualizados.
- **FIX-009 → verificação de segurança do interceptor:** restrição frontend concluída e testada. A validação futura do token pela API com Firebase Admin SDK permanece como responsabilidade do backend.
- **FIX-012 → RF-005:** confirmação externa e testes manuais concluídos; não enumeração validada no Firebase Auth.
- **FIX-013 → FIX-019:** resultados da FIX-013 foram usados como evidência histórica na FIX-019; a vigência pós-05/11/2026 da regra temporária não foi confirmada.
- **FIX-014 → FIX-020:** conta e secrets confirmados historicamente e usados nas execuções autenticadas; a limitação de forks/Dependabot permanece documentada.
- **FIX-015 → revisão responsiva:** divergência documental encerrada pela ADR-028 e atualização do Design System.
- **FIX-016 → requisitos futuros de listagem/performance/interface:** itens continuam como pendências de escopo, sem serem requisitos aprovados.
- **FIX-017 → validação de acessibilidade:** definição concluída; avaliação WCAG 2.2 AA continua planejada, sem declaração de conformidade.
- **FIX-018:** validação histórica da Sprint 3 esclarecida como manual, com `FirestoreTest`; testes automatizados atuais usam mocks.
- **FIX-021:** permanece responsável pelas regras definitivas do Firestore.

## 6. Ordem recomendada no levantamento original (histórico)

A lista abaixo preserva a sequência recomendada na baseline do levantamento. Ela não é um plano atual de execução das FIX-001 a FIX-020, que foram encerradas conforme registrado acima.

1. **Conter risco de token (FIX-009):** decidir hosts confiáveis, limitar o interceptor e acrescentar teste específico para destino externo.
2. **Confirmar estado Firebase e autenticação (FIX-012 e FIX-013):** verificar não enumeração, regras e serviços ativos, sem alterar recursos remotos sem autorização.
3. **Completar fluxos parciais (FIX-001, FIX-003 e FIX-002):** resolver primeiro as decisões de experiência do usuário e escopo; verificar cada comportamento por teste apropriado.
4. **Fechar política de domínio e confiança E2E (FIX-004, FIX-011, FIX-014 e FIX-020):** inventariar domínio, fortalecer teste de acesso, definir cobertura E2E e confirmar secrets/conta de CI.
5. **Alinhar documentação dependente de decisões (FIX-005 a FIX-008, FIX-015 e FIX-018):** atualizar apenas após confirmar estado e intenção.
6. **Definir o que ainda não tem aceite (FIX-010, FIX-016, FIX-017 e FIX-019):** priorizar dashboard, critérios de melhorias, acessibilidade e publicação antes de comprometer novas Sprints.

## 7. Critérios gerais de conclusão

Uma pendência pode ser marcada como concluída quando:

- a ação e os critérios específicos do item foram atendidos;
- a evidência foi verificada no código, teste, configuração autorizada ou documentação correspondente;
- dependências e decisões necessárias foram registradas;
- status e documentos relacionados foram atualizados sem declarar como concluído algo que permaneça planejado ou dependa de serviço externo;
- para alterações de código, verificações pertinentes foram executadas e seus resultados registrados;
- nenhuma credencial ou valor secreto foi incluído em logs ou documentação.

Itens classificados como confirmação/definição podem ser concluídos com uma decisão registrada, mesmo que a decisão seja manter a limitação aceita ou adiar a funcionalidade. Isso não equivale a implementar a funcionalidade.
