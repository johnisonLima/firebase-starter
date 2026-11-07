# Requisitos — Firebase Starter

## 1. Introdução

Este documento cataloga os requisitos funcionais e não funcionais identificados no Firebase Starter a partir da implementação atual, dos testes, das Sprints concluídas, do planejamento das Sprints 6 a 10, do backlog, das ADRs e da documentação arquitetural.

O catálogo tem como finalidade servir de base para a compreensão do escopo do projeto, para a identificação do que já foi implementado e do que permanece planejado, e para a futura elaboração da matriz de rastreabilidade.

Este documento não substitui a documentação arquitetural, as ADRs, o histórico de Sprints ou o backlog. As decisões arquiteturais são referenciadas como contexto, não convertidas em requisitos funcionais.

## 2. Objetivo e escopo

### 2.1 Objetivo

Registrar, de forma objetiva e verificável, os comportamentos e atributos de qualidade que compõem o Firebase Starter, distinguindo implementação de planejamento e de validação.

### 2.2 Escopo

Fazem parte deste catálogo:

- funcionalidades de autenticação, conta e proteção de rotas;
- persistência e operações de dados no Cloud Firestore;
- componentes e recursos compartilhados da interface;
- integração HTTP e controle de carregamento;
- atributos de arquitetura, segurança, acessibilidade, responsividade, usabilidade, testabilidade, desempenho e compatibilidade;
- requisitos previstos nas Sprints 6 a 10 e no backlog, identificados como planejados.

Não fazem parte deste documento:

- a matriz de rastreabilidade, que será criada em etapa posterior;
- regras de negócio específicas de domínio que não existam no código;
- configurações realizadas diretamente no console do Firebase;
- decisões arquiteturais tratadas como requisitos funcionais;
- itens de roadmap sem evidência no repositório.

### 2.3 Fontes e método de análise

A análise priorizou o código-fonte e as configurações como evidência do comportamento existente. Quando a documentação divergiu da implementação, a divergência foi registrada na seção 7 sem alteração dos arquivos originais.

Fontes consultadas:

- `src/app/core`, `src/app/features`, `src/app/shared`, `src/styles.scss` e configurações do projeto;
- `tests/` e arquivos `*.spec.ts`;
- `.github/workflows/ci.yml`;
- `docs/sprints/sprints.md`, `docs/sprints/sprint-planning.md` e `docs/sprints/backlog.md`;
- `docs/Architecture-v1.0.md`, `docs/project-status.md` e `docs/adr/`;
- `docs/ui/design-system/`.

Critérios adotados:

- **Implementado** exige comportamento presente no código, independentemente de existir teste automatizado.
- **Parcialmente implementado** exige implementação incompleta, inacessível ao usuário ou restrita a parte do fluxo previsto.
- **Planejado** exige registro em Sprint futura ou backlog, sem implementação correspondente no código.
- **A validar** é usado quando não há evidência suficiente para confirmar ou negar o comportamento.
- A existência de um teste não foi tratada como prova de validação do requisito.

## 3. Convenções e identificação dos requisitos

### 3.1 Identificação

- Requisitos funcionais usam `RF-001`, `RF-002`, `RF-003` e assim por diante.
- Requisitos não funcionais usam `RNF-001`, `RNF-002`, `RNF-003` e assim por diante.
- Os identificadores são estáveis e não devem ser reutilizados para outro requisito.
- Requisitos planejados mantêm a mesma sequência de identificação e são apresentados na seção 6.

### 3.2 Categorias

As categorias indicam a natureza predominante do requisito: Autenticação, Navegação, Segurança, Dados, Interface, Validação, Integração, Desenvolvimento, Arquitetura, Manutenibilidade, Acessibilidade, Responsividade, Compatibilidade, Usabilidade, Testabilidade, Qualidade e Desempenho.

### 3.3 Referências

A coluna **Referência** indica a origem ou o planejamento identificável:

- `Sprint 1` a `Sprint 5`: histórico em `docs/sprints/sprints.md`;
- `Sprint 6` a `Sprint 10`: planejamento em `docs/sprints/sprint-planning.md`;
- `Backlog`: itens sem Sprint definida em `docs/sprints/backlog.md`;
- `ADR-xxx`: decisão arquitetural relacionada;
- `Architecture`: `docs/Architecture-v1.0.md`;
- `Design System`: `docs/ui/design-system/`;
- `—`: sem referência documental específica identificável.

### 3.4 Resumo quantitativo

| Status | Requisitos funcionais | Requisitos não funcionais | Total |
|---|---:|---:|---:|
| Implementado | 52 | 38 | 90 |
| Parcialmente implementado | 2 | 2 | 4 |
| Planejado | 18 | 2 | 20 |
| A validar | 0 | 1 | 1 |
| **Total** | **72** | **43** | **115** |

## 4. Requisitos funcionais

Os requisitos desta seção possuem implementação total ou parcial no código atual. Requisitos planejados estão na seção 6.

### 4.1 Autenticação e conta

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RF-001 | Cadastro de conta com e-mail e senha | Permite criar uma conta informando e-mail, senha e confirmação de senha, com validação dos campos antes do envio. | Autenticação | Implementado | Sprint 2 |
| RF-002 | Login com e-mail e senha | Permite autenticar-se com credenciais válidas; após o login, usuários com e-mail verificado podem acessar o dashboard, enquanto usuários não verificados são encaminhados à tela de verificação. | Autenticação | Implementado | Sprint 2 e 4 |
| RF-003 | Logout | Permite encerrar a sessão autenticada e retorna o usuário à tela de login. | Autenticação | Implementado | Sprint 4 |
| RF-004 | Solicitação de recuperação de senha | Permite informar um e-mail e solicitar o envio das instruções de redefinição de senha. | Autenticação | Implementado | Sprint 2 |
| RF-005 | Confirmação da solicitação de recuperação | Exibe confirmação quando a solicitação de redefinição de senha é concluída sem erro na aplicação. | Autenticação | Implementado | Sprint 2 |
| RF-006 | Envio de verificação após cadastro | Após o cadastro, envia o e-mail de verificação e direciona o usuário para a tela de verificação. | Autenticação | Implementado | Sprint 2 |
| RF-007 | Reenvio de e-mail de verificação | Permite solicitar novo envio do e-mail de verificação na tela correspondente. | Autenticação | Implementado | Sprint 2 |
| RF-008 | Reverificação manual do e-mail | Permite recarregar o usuário autenticado e liberar o dashboard quando o e-mail for confirmado. | Autenticação | Implementado | Sprint 2 |
| RF-009 | Persistência da sessão | Mantém a sessão autenticada após recarregar a aplicação, usando persistência local do Firebase Auth. | Autenticação | Implementado | Sprint 4 |
| RF-010 | Estado de autenticação reativo | Expõe usuário, estado de autenticação, carregamento, erro e e-mail verificado por Signals. | Autenticação | Implementado | Sprint 4 |
| RF-011 | Identificação do e-mail em verificação | Exibe na tela de verificação o e-mail da conta autenticada. | Autenticação | Implementado | Sprint 2 |
| RF-012 | Validação do formulário de login | Exige e-mail válido e senha com pelo menos seis caracteres antes de permitir o envio. | Autenticação | Implementado | Sprint 2 |
| RF-013 | Confirmação de senha no cadastro | Exige que a confirmação seja igual à senha informada. | Autenticação | Implementado | Sprint 2 |
| RF-014 | Mensagens de erro de autenticação | Converte códigos do Firebase Auth em mensagens em português e as exibe no formulário. | Autenticação | Implementado | Sprint 2 |
| RF-015 | Limpeza de erro ao editar formulário | Remove a mensagem de erro de autenticação quando o usuário altera os dados do formulário. | Autenticação | Parcialmente implementado | Sprint 2 |
| RF-016 | Alternância de visibilidade da senha | Permite mostrar e ocultar o conteúdo dos campos de senha. | Autenticação | Implementado | Sprint 2 |
| RF-017 | Autofoco no primeiro campo | Posiciona o foco no primeiro campo do formulário ao abrir a tela. | Usabilidade | Implementado | Sprint 2 |
| RF-018 | Carregamento nos formulários de autenticação | Nos formulários de login, cadastro e recuperação de senha, exibe o estado de carregamento da operação e desabilita o envio enquanto ela está em andamento. O reenvio e a reverificação do e-mail não estão cobertos por este requisito. | Autenticação | Implementado | Sprint 4 |
| RF-019 | Bloqueio de envio inválido | Impede o envio e marca os campos como tocados quando o formulário está inválido. | Autenticação | Implementado | Sprint 2 |
| RF-020 | Navegação entre telas de autenticação | Oferece links entre login, cadastro, recuperação de senha e retorno ao login. | Navegação | Implementado | Sprint 2 |

**Observação sobre RF-015:** o cadastro e a recuperação de senha limpam o erro ao alterar o formulário; o login não executa essa limpeza.

### 4.2 Navegação e proteção de rotas

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RF-021 | Redirecionamento da raiz | A rota raiz redireciona o usuário para `/login`. | Navegação | Implementado | Sprint 2 |
| RF-022 | Proteção de rotas autenticadas | Impede o acesso a rotas protegidas sem sessão ativa, redirecionando ao login. | Segurança | Implementado | Sprint 4 |
| RF-023 | Redirecionamento de visitante autenticado | Impede que usuário autenticado acesse login, cadastro e recuperação de senha, redirecionando ao dashboard. | Navegação | Implementado | Sprint 4 |
| RF-024 | Restrição por e-mail verificado | Exige e-mail verificado para acessar o dashboard. | Segurança | Implementado | Sprint 4 |
| RF-025 | Redirecionamento para verificação | Encaminha usuário autenticado com e-mail não verificado para `/verify-email`. | Navegação | Implementado | Sprint 4 |
| RF-026 | Redirecionamento pós-login e pós-verificação | Após login, encaminha usuários com e-mail verificado ao dashboard e usuários não verificados à tela de verificação. Após a reverificação confirmar o e-mail, encaminha o usuário ao dashboard. | Navegação | Implementado | Sprint 2 e 4 |

### 4.3 Persistência e dados

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RF-027 | Criação de registro | Cria um documento em uma coleção do Firestore e retorna o identificador gerado. | Dados | Implementado | Sprint 3 |
| RF-028 | Consulta por identificador | Retorna o registro correspondente ao identificador ou `null` quando ele não existe. | Dados | Implementado | Sprint 3 |
| RF-029 | Listagem de registros | Retorna todos os documentos da coleção como entidades contendo `id`. | Dados | Implementado | Sprint 3 |
| RF-030 | Atualização de registro | Atualiza parcialmente um documento existente. | Dados | Implementado | Sprint 3 |
| RF-031 | Exclusão de registro | Exclui um documento pelo identificador. | Dados | Implementado | Sprint 3 |
| RF-032 | Verificação de existência | Informa se existe um documento com o identificador consultado. | Dados | Implementado | Sprint 3 |
| RF-033 | Consulta com filtros | Consulta a coleção aplicando um ou mais filtros compostos por campo, operador e valor. | Dados | Implementado | Sprint 3 |
| RF-034 | Repositório de usuários | Disponibiliza as operações de dados da coleção `users` por meio do `UserRepository`. | Dados | Implementado | Sprint 3 |
| RF-035 | Conversão de timestamps | Converte valores `Timestamp` do Firestore em `Date` ao ler registros. | Dados | Implementado | Sprint 3 |
| RF-036 | Página Playground de desenvolvimento | Disponibiliza uma página pública de demonstração manual de recursos compartilhados e integrações de desenvolvimento presentes na página, incluindo tema, Toast, Dialog, loading, botões, inputs, estado/logout de autenticação e requisições HTTP. Não representa cobertura de testes automatizados. | Desenvolvimento | Implementado | Sprint 3 e 4 |
| RF-037 | CRUD Firestore no Playground | O componente `FirestoreTest` implementa ações de criação, consulta, atualização e exclusão de usuários, mas não é importado nem renderizado pela página principal do Playground e, portanto, não está disponível por essa interface. | Desenvolvimento | Parcialmente implementado | Sprint 3 |

**Observação sobre RF-037:** o componente `FirestoreTest` existe, mas não está importado nem renderizado pela página do Playground.

### 4.4 Componentes e recursos compartilhados

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RF-038 | Input reutilizável | Disponibiliza um campo de entrada compartilhado com label e integração com Reactive Forms; também oferece propriedades visuais e ícones configuráveis. | Interface | Implementado | Sprint 1 e 4 |
| RF-039 | Mensagens de erro de formulário | Exibe mensagens padronizadas por campo e associa o texto ao input via `aria-describedby`. | Interface | Implementado | Sprint 2 |
| RF-040 | Botão reutilizável | Disponibiliza um botão compartilhado com variantes e tamanhos configuráveis, suporte a ícones e estado de carregamento/desabilitado. | Interface | Implementado | Sprint 4 |
| RF-041 | Indicador de loading | Exibe spinner com tamanhos e texto opcional acessível. | Interface | Implementado | Sprint 4 |
| RF-042 | Overlay de loading global | Bloqueia a interação e exibe overlay enquanto houver operação global ativa. | Interface | Implementado | Sprint 4 |
| RF-043 | Notificações Toast | Exibe notificações tipadas, com posição, fila, limite de exibição e fechamento manual ou automático. | Interface | Implementado | Sprint 4 |
| RF-044 | Dialog acessível | Exibe diálogo modal com título, descrição, tamanhos, foco preso, fechamento por `Esc` e por overlay. | Interface | Implementado | Sprint 4 |
| RF-045 | Tema claro e escuro | Alterna o tema da aplicação e persiste a preferência no armazenamento local. | Interface | Implementado | Sprint 4 |
| RF-046 | Identidade visual configurável | Disponibiliza nome, descrição, logo, favicon e copyright por token de marca. | Interface | Implementado | Sprint 1 |
| RF-047 | Validação de CPF | Normaliza e valida CPF numérico com dígitos verificadores. | Validação | Implementado | Sprint 1 |
| RF-048 | Validação de CNPJ | Normaliza e valida CNPJ numérico e alfanumérico com dígitos verificadores. | Validação | Implementado | Sprint 1 |
| RF-049 | Validação de CPF ou CNPJ | Aceita o valor quando ele for um CPF válido ou um CNPJ válido. | Validação | Implementado | Sprint 1 |
| RF-050 | Validador de igualdade | Compara o valor de um campo com outro para validações como confirmação de senha. | Validação | Implementado | Sprint 1 e 2 |
| RF-051 | Mensagens padronizadas de validação | Traduz erros de validação em mensagens em português, incluindo obrigatoriedade, formato, tamanho, CPF, CNPJ e igualdade. | Validação | Implementado | Sprint 1 |

### 4.5 Integração HTTP

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RF-052 | Token Firebase em requisições HTTP | Quando há usuário autenticado, o interceptor obtém o ID token pelo Firebase Auth e adiciona `Authorization: Bearer <token>` às requisições HTTP processadas, sem verificar ou restringir o destino pela origem/host da URL. | Integração | Implementado | Sprint 4 |
| RF-053 | Loading global em HTTP | Inicia e finaliza o loading global automaticamente no ciclo das requisições HTTP. | Integração | Implementado | Sprint 4 |
| RF-054 | Exceção de loading por requisição | Permite ignorar o loading global em requisições marcadas com `SKIP_LOADING`. | Integração | Implementado | Sprint 4 |

## 5. Requisitos não funcionais

Os requisitos desta seção possuem implementação total ou parcial no código atual. Requisitos planejados estão na seção 6.

### 5.1 Arquitetura e manutenibilidade

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RNF-001 | Organização por features | Separa infraestrutura em `core`, funcionalidades em `features` e recursos reutilizáveis em `shared`. | Arquitetura | Implementado | ADR-011 |
| RNF-002 | Componentes standalone | Componentes e rotas são standalone, sem NgModules de funcionalidade. | Arquitetura | Implementado | ADR-001 e Architecture |
| RNF-003 | Estado reativo com Signals | Serviços e componentes expõem estado por Signals e valores computados. | Arquitetura | Implementado | Architecture |
| RNF-004 | Tipagem estrita | O projeto compila com `strict`, `noImplicitReturns` e demais verificações do `tsconfig`. | Manutenibilidade | Implementado | `tsconfig.json` |
| RNF-005 | Injeção de dependências | Serviços e instâncias do Firebase são obtidos por injeção de dependências e tokens. | Arquitetura | Implementado | ADR-005 e ADR-022 |
| RNF-006 | Configuração separada da inicialização | A configuração do Firebase fica em arquivo dedicado e a inicialização ocorre em providers. | Arquitetura | Implementado | ADR-004 e ADR-022 |
| RNF-007 | Abstração de acesso a dados | `BaseRepository` delega a um `DataProvider`; `FirestoreDataProvider` implementa esse contrato. | Arquitetura | Implementado | ADR-012 |
| RNF-008 | Fachada de autenticação | O `AuthService` centraliza operações e estado de autenticação. | Arquitetura | Implementado | ADR-021 |
| RNF-009 | Interceptors funcionais | Interceptors HTTP são implementados com `HttpInterceptorFn`. | Arquitetura | Implementado | ADR-019 |
| RNF-010 | URLs independentes da estrutura | As rotas públicas são curtas e não refletem a estrutura interna de pastas. | Arquitetura | Implementado | ADR-013 |
| RNF-011 | Configuração Firebase sem environments | A configuração do Firebase usa arquivo dedicado, sem os arquivos de environment do Angular. | Arquitetura | Implementado | ADR-002 |
| RNF-012 | Ausência de serviço Firebase genérico | Cada integração é exposta por serviço específico, sem um `FirebaseService` genérico. | Arquitetura | Implementado | ADR-007 |
| RNF-013 | Consistência visual | A interface usa Spartan UI, Tailwind CSS e tokens semânticos de tema. | Interface | Implementado | ADR-008, ADR-009 e Design System |

### 5.2 Segurança

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RNF-014 | Persistência local da sessão | A sessão utiliza `browserLocalPersistence` do Firebase Auth. | Segurança | Implementado | ADR-022 e Sprint 4 |
| RNF-015 | Obtenção do token pelo Firebase SDK | O interceptor obtém o ID token por meio do Firebase Auth e não mantém armazenamento manual do token na interface. O interceptor atual o anexa às requisições HTTP processadas sem restrição de destino; uma restrição por origem não está implementada. | Integração | Implementado | ADR-020 |
| RNF-016 | Proteção de navegação no cliente | Guards Angular controlam a navegação para rotas conforme o estado da sessão e a verificação de e-mail. Este requisito cobre a proteção de rotas no cliente e não substitui regras de segurança do Firebase. | Navegação | Implementado | Sprint 4 |
| RNF-017 | Exclusão de arquivos sensíveis do Git | O `.gitignore` exclui `.env`, `.env.*` e `/docs_firebase` do versionamento. | Segurança | Implementado | `.gitignore` |

### 5.3 Acessibilidade

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RNF-018 | Associação entre campos e erros | Inputs possuem label associada e `aria-describedby` apontando para a mensagem de erro. | Acessibilidade | Implementado | Sprint 2 |
| RNF-019 | Papéis e nomes acessíveis nos controles compartilhados | Os componentes compartilhados expõem roles e nomes/rótulos acessíveis quando aplicável, incluindo Dialog, Toast, loading/overlay, alternância de tema e botões de ícone. A conformidade global de acessibilidade é tratada separadamente em RNF-022. | Acessibilidade | Implementado | Sprint 4 |
| RNF-020 | Indicador de foco visível | Componentes interativos exibem foco visível com contraste, usando `focus-visible`. | Acessibilidade | Implementado | Design System |
| RNF-021 | Foco preso no diálogo | O Dialog usa `cdkTrapFocus`, foco inicial automático e fechamento por `Esc`. | Acessibilidade | Implementado | Sprint 4 |
| RNF-022 | Conformidade WCAG verificada | A conformidade das telas com critérios WCAG é verificada por auditoria ou testes automatizados. | Acessibilidade | A validar | — |

### 5.4 Responsividade e compatibilidade

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RNF-023 | Abordagem mobile first | A documentação arquitetural define abordagem mobile first e os estilos utilizam classes responsivas do Tailwind. A lista exata de breakpoints adotada permanece pendente de alinhamento entre ADR-010 e o Design System. | Responsividade | Implementado | ADR-010 e Design System |
| RNF-024 | Layout adaptável das telas de autenticação | As telas usam largura máxima, padding e centralização que se adaptam a diferentes viewports. | Responsividade | Implementado | Sprint 2 |
| RNF-025 | Uso de unidades flexíveis | Os layouts priorizam Flexbox, Grid e classes utilitárias do Tailwind. | Responsividade | Implementado | ADR-010 |
| RNF-026 | Metadados de viewport e idioma | O documento define `lang="pt-br"`, viewport e título. | Compatibilidade | Implementado | `src/index.html` |

### 5.5 Usabilidade e feedback

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RNF-027 | Idioma das mensagens da interface | Mensagens de erro de autenticação, validação e estados abrangidos pela aplicação são apresentadas em português. | Usabilidade | Implementado | Sprint 2 |
| RNF-028 | Indicação de operações em andamento | Formulários e componentes que implementam estado de carregamento indicam visualmente a operação em andamento e, quando aplicável, desabilitam a ação correspondente. | Usabilidade | Implementado | Sprint 4 |
| RNF-029 | Feedback de resultado das operações | Formulários e componentes apresentam feedback visual de erro ou confirmação nos fluxos em que esse feedback está implementado. Não implica cobertura de todos os fluxos; o reenvio de verificação de e-mail permanece pendente. | Usabilidade | Parcialmente implementado | Sprint 2 e 4 |

### 5.6 Testabilidade e qualidade

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RNF-030 | Testes unitários com Vitest | O projeto configura e executa testes unitários com Vitest por meio de `npm run test:unit`. | Testabilidade | Implementado | ADR-014 e Sprint 4 |
| RNF-031 | Cobertura atual de testes de domínio | A cobertura existente inclui testes de utilitários de CPF/CNPJ; não há evidência de testes para todo o código de domínio. A política normativa de que todo código de domínio deve ter testes Vitest está definida separadamente na ADR-014. | Testabilidade | Parcialmente implementado | ADR-014 |
| RNF-032 | Testes E2E existentes com Playwright | Os testes E2E existentes cobrem acesso inicial, login, cadastro, recuperação de senha, verificação de e-mail, dashboard, logout, proteção de rotas e redirecionamento de usuários autenticados. O fluxo autenticado usa login real no setup e reutiliza `storageState`; os fluxos de cadastro, recuperação e verificação usam interceptação fail-closed do Firebase Auth. Os cenários priorizam roles, labels e nomes acessíveis. | Testabilidade | Implementado | ADR-023, ADR-025, ADR-026 e `docs/testing/e2e-strategy.md` |
| RNF-033 | Execução E2E em três engines | A configuração do Playwright define Chromium, Firefox e WebKit. | Testabilidade | Implementado | `playwright.config.ts` |
| RNF-034 | CI de build, testes unitários e E2E | O GitHub Actions executa build, testes unitários, type-check dos testes Playwright e E2E em push e pull request. O job E2E é condicional à disponibilidade dos secrets. A execução normal do workflow foi validada com sucesso na FIX-020. | Qualidade | Implementado | ADR-027 e `ci.yml` |
| RNF-035 | Credenciais E2E via secrets | O CI injeta `E2E_USER_EMAIL` e `E2E_USER_PASSWORD` a partir de secrets quando disponíveis. Em Pull Requests de fork e de Dependabot sem secrets, a E2E é ignorada e build, testes unitários e type-check continuam executando; esse cenário não foi validado diretamente. | Testabilidade | Implementado | ADR-027 e `ci.yml` |

### 5.7 Desempenho

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RNF-036 | Carregamento sob demanda | As rotas usam `loadChildren` e `loadComponent` para carregar funcionalidades sob demanda. | Desempenho | Implementado | Sprint 2 e 5 |
| RNF-037 | Orçamentos de build | O build de produção define limites de aviso e de erro para o bundle inicial. | Desempenho | Implementado | `angular.json` |
| RNF-038 | Build no pipeline | O CI executa o build do projeto antes dos testes unitários e E2E. | Desempenho | Implementado | `ci.yml` |

### 5.8 Formatação e documentação

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RNF-039 | Formatação com Prettier | O repositório possui Prettier configurado e disponível como dependência. | Manutenibilidade | Implementado | `package.json` e `.prettierrc` |
| RNF-040 | Decisões arquiteturais registradas | As decisões arquiteturais relevantes são documentadas em ADRs. | Manutenibilidade | Implementado | `docs/adr/` |
| RNF-041 | Documentação de estado e planejamento | O repositório mantém documentos de estado, histórico de Sprints e planejamento. | Manutenibilidade | Implementado | `docs/` |

## 6. Requisitos planejados

Os requisitos desta seção constam em planejamento ou backlog, mas não possuem implementação correspondente no código atual. Eles não devem ser tratados como funcionalidades disponíveis.

### 6.1 Requisitos funcionais planejados

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RF-055 | Login com Google | Permite autenticar-se com uma conta Google integrada ao Firebase Authentication. | Autenticação | Planejado | Sprint 6 |
| RF-056 | Integração do login Google ao fluxo existente | Integra o login Google ao estado de autenticação, guards e navegação já existentes. | Autenticação | Planejado | Sprint 6 |
| RF-057 | Autenticação por telefone | Permite iniciar a autenticação informando um número de telefone. | Autenticação | Planejado | Sprint 7 |
| RF-058 | Validação de código SMS | Permite informar e validar o código de verificação enviado por SMS. | Autenticação | Planejado | Sprint 7 |
| RF-059 | Pesquisa de registros | Permite pesquisar registros nas listagens de dados. | Dados | Planejado | Sprint 8 |
| RF-060 | Paginação de registros | Permite navegar pelos registros em páginas. | Dados | Planejado | Sprint 8 |
| RF-061 | Ordenação de registros | Permite ordenar os registros exibidos. | Dados | Planejado | Sprint 8 |
| RF-063 | Estados vazios em listagens | Exibe estado visual específico quando não há registros para apresentar. | Interface | Planejado | Sprint 8 |
| RF-064 | Upload de imagens no Storage | Permite enviar imagens para o Firebase Storage. | Dados | Planejado | Sprint 9 |
| RF-065 | Preview de imagens | A Sprint 9 prevê preview para imagens associadas ao fluxo de upload; o momento em que o preview é exibido (antes ou depois do armazenamento) ainda não foi definido. | Interface | Planejado | Sprint 9 |
| RF-066 | Exclusão de arquivos no Storage | Permite excluir arquivos armazenados no Firebase Storage. | Dados | Planejado | Sprint 9 |
| RF-067 | Associação de arquivos a registros | Permite associar arquivos enviados a registros do Firestore. | Dados | Planejado | Sprint 9 |
| RF-068 | Publicação no Firebase Hosting | Permite publicar a aplicação no Firebase Hosting. | Publicação | Planejado | Sprint 10 |
| RF-069 | Deploy da aplicação | Permite executar o processo de deploy da aplicação preparada para publicação. | Publicação | Planejado | Sprint 10 |
| RF-070 | Dashboard com indicadores e estatísticas | Exibe indicadores e estatísticas no dashboard. | Interface | Planejado | Backlog |
| RF-071 | Compressão de imagens | Comprime imagens antes do upload. | Desempenho | Planejado | Backlog |
| RF-072 | Upload com progresso | Exibe o progresso de uploads de arquivos. | Interface | Planejado | Backlog |
| RF-073 | Drag & drop de arquivos | Permite selecionar e enviar arquivos por arrastar e soltar. | Interface | Planejado | Backlog |

### 6.2 Requisitos não funcionais planejados

| ID | Título | Descrição verificável | Categoria | Status | Referência |
|---|---|---|---|---|---|
| RNF-042 | Regras de segurança do Firebase | Define e aplica regras de segurança para os serviços Firebase utilizados. | Segurança | Planejado | Sprint 10 |
| RNF-043 | Checklist de publicação documentado | Mantém um checklist documentado para verificação antes da publicação. A existência do checklist e sua execução são resultados distintos; o checklist ainda não foi apresentado no repositório. | Qualidade | Planejado | Sprint 10 |

## 7. Observações e limitações

### 7.1 Inconsistências entre documentação e implementação

| Item | Descrição | Evidência |
|---|---|---|
| 1 | O backlog lista “Lazy Loading e otimizações de performance” como trabalho futuro, mas as rotas já usam `loadChildren` e `loadComponent`. Permanecem apenas otimizações adicionais. | `docs/sprints/backlog.md`; `src/app/app.routes.ts` |
| 2 | O README do Playground marca Authentication, Notifications e Dialogs como não implementados, mas a página contém Auth Playground com estado e logout, Toast e Dialog. | `src/app/features/dev/playground/README.md`; `playground.html` |
| 3 | O README do Playground marca as operações Firestore como concluídas, mas o componente `FirestoreTest` não está importado nem renderizado pela página. | `firestore-test.ts`; `playground.ts`; `playground.html` |
| 4 | A Architecture v1.0 cita diretórios `layouts/` e `styles/` que não existem no projeto; os estilos globais estão em `src/styles.scss`. | `docs/Architecture-v1.0.md`; `src/` |
| 5 | A ADR-010 limita os breakpoints a `sm`, `md` e `lg`, enquanto o Design System de responsividade lista também `xl` e `2xl`. | `docs/adr/ADR-010-interface-mobile-first.md`; `docs/ui/design-system/07-Responsvidade.md` |
| 6 | A Sprint 3 registra “CRUD validado ponta a ponta”, mas não há testes automatizados da camada de dados e o componente de CRUD do Playground não está montado. A validação aparenta ter sido manual. | `docs/sprints/sprints.md`; `src/app/core/data/`; `firestore-test.ts` |
| 7 | O botão de envio da recuperação de senha está rotulado como “Entrar”, embora a ação seja solicitar a redefinição. | `forgot-password.html` |
| 8 | O login usa o atributo nativo `autofocus` em vez da diretiva `appAutofocus` usada nas demais telas, e não limpa o erro ao editar o formulário. | `login.html`; `login.ts`; `register.ts`; `forgot-password.ts` |
| 9 | O reenvio do e-mail de verificação não apresenta confirmação visual de sucesso, embora exista o serviço de Toast. | `verify-email.html`; `verify-email.ts` |
| 10 | A Sprint 10 lista “Build de Produção” como entrega planejada, mas o CI já executa `npm run build`, que usa a configuração de produção do Angular. O item planejado parece abranger a preparação para publicação, não a existência do build. | `docs/sprints/sprint-planning.md`; `.github/workflows/ci.yml`; `angular.json` |
| 11 | O `Login` mantém um método privado de mapeamento de erro não utilizado, duplicando parte da lógica centralizada em `auth.errors.ts`. | `login.ts`; `auth.errors.ts` |
| 12 | Os campos de nova senha e confirmação no cadastro usam `autocomplete="current-password"` em vez de `new-password`. | `register.html` |

### 7.2 Limitações conhecidas

- A suíte E2E autenticada depende de `E2E_USER_EMAIL` e `E2E_USER_PASSWORD`; sem essas variáveis, os testes de login e dashboard lançam erro.
- Não há testes unitários para `Login`, `AuthService`, guards, interceptors, camada de dados ou componentes compartilhados. Os testes unitários existentes cobrem criação de componentes e utilitários de CPF/CNPJ.
- Não há auditoria de acessibilidade nem testes automatizados de conformidade WCAG.
- O dashboard é um placeholder e não apresenta indicadores ou estatísticas.
- Firebase Storage, Firebase Hosting e regras de segurança do Firebase não estão configurados no repositório.
- O Toast e o Dialog são utilizados no Playground, mas não integram os fluxos de autenticação.
- A redefinição de senha envia o e-mail do Firebase; a definição da nova senha ocorre fora da aplicação, na página hospedada pelo Firebase.
- O CRUD do Firestore está disponível pela camada de dados e pelo componente `FirestoreTest`, mas este não é acessível pela interface atual do Playground.
- Não há ESLint configurado; o projeto adota Prettier para formatação.
- A configuração do Firebase está versionada em `src/app/core/config/firebase.config.ts`, conforme a ADR-002, sem separação por environments.

### 7.3 Pendências de confirmação e definição

- **Destino do AuthInterceptor:** o interceptor anexa o ID token às requisições HTTP processadas sem restringir a origem/host. A definição de destinos permitidos e eventual implementação de restrição permanecem pendentes; não são requisitos implementados neste catálogo.
- **Reenvio de verificação de e-mail:** a chamada não apresenta feedback de sucesso e não trata a falha na tela. A decisão de comportamento esperado e sua implementação ficam pendentes.
- **Configurações externas do Firebase:** a proteção contra enumeração de e-mails e outras configurações remotas não podem ser confirmadas pelos arquivos versionados. A garantia de não revelar se o e-mail está cadastrado permanece a validar.
- **Playground:** `docs/project-status.md` descreve a interface CRUD como parte do Playground, embora `FirestoreTest` não esteja montado na página principal. O README do Playground também contém marcações desatualizadas. Ambos aguardam atualização documental fora do escopo deste catálogo.
- **Breakpoints:** ADR-010 e Design System divergem sobre a lista de breakpoints. A lista exata permanece pendente de alinhamento documental.
- **Melhorias de listagem (Sprint 8):** o planejamento cita melhorias além de pesquisa, paginação, ordenação e estados vazios, mas não define critérios. Mantido como ponto de escopo, não como requisito catalogado.
- **Otimizações adicionais de performance e melhorias adicionais de interface:** itens genéricos do backlog sem critérios verificáveis. Não estão catalogados como requisitos até que o escopo seja definido. O lazy loading existente permanece em RNF-036.
- **Execução do checklist de publicação:** Sprint 10 prevê checklist, mas o documento e a execução são resultados distintos; a existência do checklist ainda precisa ser confirmada quando a Sprint for realizada.

### 7.4 Considerações para a matriz de rastreabilidade

- A matriz deverá relacionar cada RF e RNF às evidências de implementação, testes, Sprints e ADRs.
- Requisitos com status **Parcialmente implementado** e **A validar** devem receber atenção especial na matriz.
- A existência de teste não deve ser usada como critério isolado de validação; a matriz deve distinguir implementação, cobertura de teste e validação.
- Os itens planejados devem ser rastreados ao planejamento ou backlog, sem serem apresentados como entregues.

## 8. Referências

- `docs/Architecture-v1.0.md`
- `docs/project-status.md`
- `docs/adr/ADR-001` a `docs/adr/ADR-027`
- `docs/testing/e2e-strategy.md`
- `docs/ci/secrets.md`
- `docs/sprints/sprints.md`
- `docs/sprints/sprint-planning.md`
- `docs/sprints/backlog.md`
- `docs/ui/design-system/`
- `src/app/`
- `tests/`
- `.github/workflows/ci.yml`
- `angular.json`, `package.json`, `tsconfig.json` e `playwright.config.ts`
