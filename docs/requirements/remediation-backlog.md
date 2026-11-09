# Backlog de Correções e Pendências — Firebase Starter

## 1. Objetivo e escopo

Este documento transforma as lacunas e incertezas identificadas no catálogo [`requirements.md`](requirements.md) em itens rastreáveis de correção, confirmação ou definição. Ele não substitui o catálogo, não cria requisitos de produto e não constitui a matriz de rastreabilidade.

O levantamento considera o código e os testes atuais, as Sprints 1 a 5, o planejamento das Sprints 6 a 10, o backlog, as ADRs e a documentação técnica. Nesta etapa, nenhum código, teste ou documento existente foi alterado.

## 2. Critérios do levantamento

- Status **Parcialmente implementado** foi considerado pendência quando há comportamento incompleto ou indisponível, não apenas falta de testes.
- Ausência de testes foi tratada como pendência obrigatória somente quando a política da ADR-014 se aplica a código de domínio. Código de interface e infraestrutura precisa de estratégia própria, mas não foi considerado incompleto por esse motivo isolado.
- Requisitos planejados permanecem planejados; este documento não os declara implementados nem inventa critérios de aceitação ausentes.
- Configurações do Firebase e secrets do GitHub Actions não foram presumidos. A ausência de configuração no repositório não prova o estado do projeto remoto ou dos secrets.
- Prioridade P0 é reservada a impacto concreto e significativo. P1 indica correção importante, P2 qualidade/consistência ou confirmação necessária, e P3 refinamento não essencial.
- Os FIX IDs são estáveis e não substituem os IDs RF/RNF.

## 3. Resumo quantitativo

Há **20 pendências** no levantamento original: 4 de implementação parcial, 4 de inconsistência documental, 3 limitações técnicas/comportamentais e 9 confirmações ou definições.

> **Atualização:** a FIX-020 foi concluída na implementação e documentação em 06/11/2026. O resumo quantitativo e a lista abaixo são mantidos como registro do levantamento original, anterior à conclusão dessa correção.

| Categoria | P0 | P1 | P2 | P3 | Total |
|---|---:|---:|---:|---:|---:|
| A. Implementação parcial | 0 | 4 | 0 | 0 | 4 |
| B. Documentação e implementação | 0 | 0 | 4 | 0 | 4 |
| C. Limitações conhecidas | 1 | 0 | 2 | 0 | 3 |
| D. Confirmação e definição | 0 | 2 | 7 | 0 | 9 |
| **Total** | **1** | **6** | **13** | **0** | **20** |

## 4. Pendências

### A. Implementação parcial

#### Autenticação e feedback

##### FIX-001 — Limpeza de erro no formulário de login

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

##### FIX-010 — Manter explícito o estado de placeholder do dashboard

- **Categoria:** C. Limitação conhecida aceita até decisão de produto
- **Requisito relacionado:** RF-070
- **Problema:** dashboard existe como página protegida, mas não apresenta os indicadores/estatísticas descritos no backlog.
- **Evidência:** `src/app/features/dashboard/dashboard.html` e item “Dashboard com indicadores e estatísticas” em `docs/sprints/backlog.md`.
- **Impacto:** funcionalidade de análise não está disponível, mas está registrada como backlog e não contradiz o requisito atual planejado.
- **Prioridade:** P2 — limitação conhecida; não exige implementação imediata sem priorização do backlog.
- **Ação recomendada:** manter como limitação aceita até decisão de priorizar o item e definir quais indicadores e fontes de dados são necessários.
- **Arquivos envolvidos:** `src/app/features/dashboard/`, `docs/sprints/backlog.md`.
- **Critério de conclusão:** backlog priorizado e critérios definidos antes de qualquer implementação, ou limitação explicitamente mantida como aceita.
- **Dependências/decisões:** escopo funcional e fonte dos dados do dashboard.

#### Cobertura E2E

##### FIX-011 — Fortalecer a verificação E2E do acesso inicial

- **Categoria:** C. Limitação de testabilidade
- **Requisito relacionado:** RNF-032
- **Problema:** o teste de acesso inicial verifica apenas se a URL contém `localhost:4200`, o que não comprova que a aplicação abriu ou redirecionou corretamente.
- **Evidência:** `tests/app/access.spec.ts` contém somente `expect(page).toHaveURL(/localhost:4200/)` após `goto('/')`.
- **Impacto:** falhas de carregamento ou conteúdo podem passar por esse teste.
- **Prioridade:** P2 — reduz a confiança de um cenário básico, mas os fluxos de login/dashboard têm asserções adicionais.
- **Ação recomendada:** definir o resultado esperado para `/` e assertar URL de destino e/ou conteúdo acessível correspondente.
- **Arquivos envolvidos:** `tests/app/access.spec.ts`.
- **Critério de conclusão:** teste falha quando a aplicação não carrega ou não chega ao resultado esperado, sem depender de seletores CSS.
- **Dependências/decisões:** confirmar se o resultado esperado da raiz continua sendo `/login`, conforme RF-021.

### D. Pendências de confirmação e definição

#### Firebase e ambiente de execução

##### FIX-012 — Confirmar proteção contra enumeração no Firebase Auth

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

- **Categoria:** D. Confirmação de ambiente
- **Requisito relacionado:** RNF-035
- **Problema:** workflow referencia secrets E2E, mas a presença/validade deles nas configurações do GitHub não é visível no repositório.
- **Evidência:** `.github/workflows/ci.yml` injeta `E2E_USER_EMAIL` e `E2E_USER_PASSWORD`; testes autenticados lançam erro quando variáveis estão ausentes.
- **Impacto:** pipeline pode falhar nos cenários autenticados caso os secrets não estejam configurados ou a conta não seja válida/verificada.
- **Prioridade:** P2 — dependência operacional que pode impedir CI, sem evidência local de ausência.
- **Ação recomendada:** responsável verificar existência e validade dos secrets e da conta de teste sem imprimir valores ou credenciais.
- **Arquivos envolvidos:** `.github/workflows/ci.yml`, `tests/auth/login.spec.ts`, `tests/auth/dashboard.spec.ts`, configurações do repositório GitHub.
- **Critério de conclusão:** execução autenticada do CI passa com secrets válidos; nenhum valor secreto é exposto em logs.
- **Dependências/decisões:** acesso autorizado às configurações e execução de CI.

#### Decisões de escopo e documentação

##### FIX-015 — Resolver a divergência documental dos breakpoints

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
- **Requisito relacionado:** RNF-032; RF-001, RF-004, RF-006 a RF-008
- **Problema:** a suíte E2E cobre login/logout e acesso ao dashboard, mas não cobre cadastro, recuperação de senha, envio/reenvio ou confirmação de e-mail. Não há critério de cobertura definido para esses fluxos.
- **Evidência:** testes existentes em `tests/auth/login.spec.ts`, `tests/auth/dashboard.spec.ts` e `tests/app/access.spec.ts`; não há arquivos E2E para registro, recuperação ou verificação.
- **Impacto:** regressões nesses fluxos podem não ser detectadas ponta a ponta, embora existam testes unitários de componentes para algumas páginas.
- **Prioridade:** P2 — lacuna de cobertura a avaliar; a ausência não prova defeito funcional e requer decisão de escopo.
- **Ação recomendada:** responsável priorizar quais fluxos de autenticação exigem E2E e definir estratégia segura para contas, e-mails e ambiente Firebase de teste.
- **Arquivos envolvidos:** `tests/auth/`, páginas de autenticação e configuração E2E.
- **Critério de conclusão:** escopo de E2E documentado; fluxos priorizados possuem testes observáveis usando ambiente/conta de teste autorizados, ou sua exclusão está justificada.
- **Dependências/decisões:** decisão de cobertura; coordenação com disponibilidade de ambiente de teste e secrets (FIX-014).
- **Status:** concluída na implementação e documentação. O escopo está em [`docs/testing/e2e-strategy.md`](../testing/e2e-strategy.md), os fluxos priorizados possuem testes E2E e a CI foi ajustada para executar a suíte quando os secrets estiverem disponíveis. A execução normal do workflow no GitHub Actions foi validada com sucesso. O comportamento em Pull Requests de fork e de Dependabot sem secrets não foi validado diretamente.

## 5. Dependências entre correções

- **FIX-002 → FIX-005 e FIX-006:** primeiro decidir se CRUD deve estar disponível no Playground; depois alinhar estado do projeto e README.
- **FIX-009 → verificação de segurança do interceptor:** definir destinos confiáveis antes de concluir a restrição e seus testes. É a prioridade imediata por envolver envio observável do token a host externo.
- **FIX-012 → RF-005:** confirmar a configuração externa antes de afirmar não enumeração de e-mail.
- **FIX-013 → FIX-019:** conhecer serviços e regras efetivas antes de fechar critérios de publicação.
- **FIX-014 → FIX-020:** confirmar ambiente e conta de teste antes de ampliar os fluxos E2E autenticados.
- **FIX-015 → revisão responsiva:** alinhar documentação antes de usar a lista de breakpoints como critério de aceite.
- **FIX-016 → requisitos futuros de listagem/performance/interface:** escopo e aceitação devem preceder planejamento de implementação.
- **FIX-017 → validação de acessibilidade:** definir padrão e escopo antes da auditoria.
- **FIX-018:** confirmar a evidência histórica separadamente; testes futuros de dados não devem ser descritos como validação passada.

## 6. Ordem recomendada de execução

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
