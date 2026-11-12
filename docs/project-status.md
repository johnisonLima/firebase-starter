# Estado do projeto

## Visão geral

O Firebase Starter é uma aplicação de referência e template para estudar e iniciar aplicações com Angular e Firebase, com arquitetura organizada por funcionalidades e decisões técnicas documentadas. As cinco sprints estão concluídas, incluindo a documentação final da Sprint 5, registrada neste documento. A próxima rodada de desenvolvimento está planejada nas Sprints 6 a 10.

## Stack tecnológica

- Angular 21, TypeScript 5.9 e Angular Router, com componentes standalone e Signals.
- Firebase SDK 12: Authentication e Cloud Firestore.
- Tailwind CSS 4, Spartan UI e ícones Lucide.
- Vitest, Playwright e Prettier 3.
- GitHub Actions para build e testes em CI.

## Arquitetura

A aplicação organiza funcionalidades em `src/app/features`, infraestrutura e serviços globais em `src/app/core`, e recursos reutilizáveis em `src/app/shared`. As rotas usam carregamento sob demanda com `loadChildren` e `loadComponent`.

Componentes standalone e Signals aparecem no código. Para persistência, `BaseRepository` delega a uma interface `DataProvider`; `FirestoreDataProvider` implementa essa abstração com Cloud Firestore. A configuração e os providers do Firebase ficam em `core`, sem uma API intermediária identificada.

## Funcionalidades implementadas

- **Autenticação:** cadastro, login, logout, recuperação de senha e verificação de e-mail por Firebase Authentication. O `AuthService` atua como fachada única para as operações de autenticação e expõe o estado por meio de Signals.
- **Firestore:** abstração de dados e repositório de usuários com criação, consulta por ID, listagem, existência, atualização, exclusão e consulta por filtros. Para finalidades exclusivas de desenvolvimento e teste, o componente `FirestoreTest` está integrado à página do Playground, disponibilizando interface para execução das operações CRUD sobre a coleção de testes dedicada `playground_users`. O acesso à rota `/playground` é protegido pelos guards `authGuard` e `emailVerifiedGuard`. Por se tratar de um recurso de apoio ao desenvolvimento, essa interface não constitui funcionalidade de produção nem representa validação ou aprovação definitiva das Security Rules no Firestore.
- **FIX-021 — testes das Firestore Security Rules:** matriz documentada em [`security/firestore-authorization.md`](security/firestore-authorization.md), com autorização por claims conforme [ADR-030](adr/ADR-030-autorizacao-de-perfis-por-custom-claims-do-firebase-authentication.md). Há 18 testes automatizados em `tests/firestore/`, executados exclusivamente no Emulator demo; type-check e suíte passaram em 12/11/2026. Os testes identificaram ausência de limites de tamanho nas regras, registrada para avaliação. A FIX-021 permanece aberta enquanto essa divergência e a revisão final das regras não forem resolvidas.
- **Recursos compartilhados:** formulário e mensagens de erro, autofocus, botões, inputs, spinner/loading, Toast, Dialog e alternância de tema.
- **Requisições HTTP:** interceptors funcionais configurados para token Firebase nas requisições autenticadas e controle do loading global, com opção para ignorá-lo.
- **Acesso a rotas:** guards para visitante, autenticação e verificação de e-mail.

## Qualidade e testes

- **Vitest:** testes unitários configurados pelo Angular (`npm run test:unit`), cobrindo `AuthService`, erros de autenticação, guards, páginas de autenticação, dashboard, Playground e utilitários compartilhados.
- **Playwright:** testes E2E em `tests/playwright/`, executados por `npm run test:e2e`, com Chromium, Firefox e WebKit. A suíte cobre acesso inicial, login, cadastro, recuperação de senha, verificação de e-mail, dashboard, logout, proteção de rotas e redirecionamento de usuários autenticados. O projeto `setup` realiza login real com conta dedicada e gera `storageState`; os fluxos de cadastro, recuperação e verificação usam interceptação fail-closed do Firebase Auth. A estratégia está em [`testing/e2e-strategy.md`](testing/e2e-strategy.md).
- **Firestore Security Rules:** 18 testes em `tests/firestore/`, com Vitest isolado e comandos `npm run test:firestore-rules` e `npm run type-check:firestore-tests`. Em 12/11/2026, type-check e os 18 cenários passaram usando somente o Firestore Emulator com project ID `demo-firebase-starter-rules`. Os testes não acessam projeto real nem fazem deploy.
- **GitHub Actions:** `.github/workflows/ci.yml` é acionado por push e pull request. O job `verify` executa verificação de secrets, checkout, Node.js 22 com cache npm, `npm ci`, build, testes unitários e `type-check:playwright`. O job `e2e` depende de `verify` e só executa quando os secrets E2E estão disponíveis; caso contrário, é marcado como skipped e o workflow registra aviso e resumo. Nenhum artefato sensível é publicado.
- **Prettier:** dependência e configuração `.prettierrc` presentes. ESLint não está configurado.

A validação local da FIX-020 registrou 220 testes unitários e 67 execuções E2E aprovadas nos três navegadores. A execução normal do workflow no GitHub Actions também foi validada com sucesso na FIX-020.

## Documentação

- [`Architecture-v1.0.md`](Architecture-v1.0.md) registra a visão arquitetural e os princípios do projeto.
- `docs/adr/` contém 30 ADRs, da ADR-001 à ADR-030, incluindo decisões de arquitetura, dados, autenticação, autorização, interceptors, Playwright e estratégia de testes E2E e CI.
- [`testing/e2e-strategy.md`](testing/e2e-strategy.md) documenta a estratégia de testes end-to-end.
- [`ci/secrets.md`](ci/secrets.md) documenta os secrets necessários ao CI.
- [`sprints/sprints.md`](sprints/sprints.md) registra o histórico das Sprints 1 a 5 concluídas.
- [`sprints/sprint-planning.md`](sprints/sprint-planning.md) registra o planejamento das Sprints 6 a 10.
- [`sprints/backlog.md`](sprints/backlog.md) registra as funcionalidades futuras ainda sem Sprint definida.
- `docs/ui/design-system/` documenta iconografia, cores, tipografia, espaçamento, bordas, sombras, responsividade, estados e princípios de componentes.

## Pendências e limitações conhecidas

- **Obrigatório:** não há pendência registrada para as Sprints 1 a 5.
- **Planejado, ainda não implementado/configurado:** as Sprints 6 a 10 estão planejadas. Firebase Cloud Storage e Firebase Hosting ainda não estão habilitados/configurados no projeto. O Cloud Firestore possui Security Rules configuradas diretamente no Firebase Console, mas sua definição definitiva, auditoria e versionamento no repositório permanecem pendentes, conforme escopo da FIX-021.
- A interface CRUD disponível no Playground restringe-se ao apoio a desenvolvimento e teste com a coleção `playground_users`; o uso dessa interface não substitui a aprovação e auditoria definitiva das Security Rules do Firestore no servidor, dependendo da conclusão da FIX-021.
- Não há configuração de ESLint identificada.
- Os fluxos E2E autenticados dependem de uma conta de teste verificada e dos secrets correspondentes no CI.
- O comportamento do workflow em Pull Requests de fork e de Dependabot sem secrets ainda não foi validado diretamente.

Lazy loading já é usado nas rotas. Não é uma pendência.

## Próximos passos

O backlog reúne funcionalidades futuras ainda sem Sprint definida. A adoção deve ser decidida conforme os objetivos do projeto; esses itens não são compromissos assumidos.
