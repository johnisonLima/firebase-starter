# Estado do projeto

## Visão geral

O Firebase Starter é uma aplicação de referência e template para estudar e iniciar aplicações com Angular e Firebase, com arquitetura organizada por funcionalidades e decisões técnicas documentadas. As cinco sprints estão concluídas, incluindo a documentação final da Sprint 5, registrada neste documento.

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
- **Firestore:** abstração de dados e repositório de usuários com criação, consulta por ID, listagem, existência, atualização, exclusão e consulta por filtros. O Playground contém interface de demonstração dessas operações.
- **Recursos compartilhados:** formulário e mensagens de erro, autofocus, botões, inputs, spinner/loading, Toast, Dialog e alternância de tema.
- **Requisições HTTP:** interceptors funcionais configurados para token Firebase nas requisições autenticadas e controle do loading global, com opção para ignorá-lo.
- **Acesso a rotas:** guards para visitante, autenticação e verificação de e-mail.

## Qualidade e testes

- **Vitest:** testes unitários configurados pelo Angular (`npm run test:unit`), com testes existentes para componentes e utilitários.
- **Playwright:** testes E2E em `tests/`, executados por `npm run test:e2e`. A configuração define Chromium, Firefox e WebKit; os cenários cobrem acesso, login, dashboard e logout. Fluxos autenticados requerem credenciais E2E configuradas.
- **GitHub Actions:** `.github/workflows/ci.yml` executa em push e pull request: checkout, Node.js 22, `npm ci`, build de produção, testes unitários, instalação dos navegadores Playwright e testes E2E. O workflow injeta credenciais E2E a partir de secrets.
- **Prettier:** dependência e configuração `.prettierrc` presentes. ESLint não está configurado.

As configurações e os arquivos de teste confirmam a presença dessas etapas, sem afirmar aqui resultados de execuções recentes.

## Documentação

- [`Architecture-v1.0.md`](Architecture-v1.0.md) registra a visão arquitetural e os princípios do projeto.
- `docs/adr/` contém 23 ADRs, da ADR-001 à ADR-023, incluindo decisões de arquitetura, dados, autenticação, interceptors e Playwright.
- [`sprints/sprint-planning.md`](sprints/sprint-planning.md) registra as cinco sprints concluídas e o backlog futuro.
- `docs/ui/design-system/` documenta iconografia, cores, tipografia, espaçamento, bordas, sombras, responsividade, estados e princípios de componentes.

## Pendências e limitações conhecidas

- **Obrigatório:** não há pendência de sprint registrada após a conclusão da documentação da Sprint 5.
- **Planejado, ainda não implementado/configurado:** Firebase Cloud Storage e fluxos de upload; Firebase Hosting e deploy. Esses itens estão no backlog, sem prazo ou compromisso de execução indicado.
- Não há configuração de ESLint identificada.
- Os fluxos E2E autenticados dependem de uma conta de teste e dos secrets correspondentes no CI.

Lazy loading já é usado nas rotas. Não é uma pendência.

## Próximos passos

Como possibilidades de evolução, o backlog sugere avaliar pesquisa, paginação e ordenação no CRUD, melhorias de interface conforme necessidade, otimizações de performance, cache, Cloud Storage e publicação por Firebase Hosting. A adoção deve ser decidida conforme os objetivos do projeto; essas possibilidades não são compromissos assumidos.
