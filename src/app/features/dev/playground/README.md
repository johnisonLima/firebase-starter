# Playground

## Objetivo e escopo

O Playground é um ambiente exclusivo de desenvolvimento para demonstrar e experimentar manualmente os componentes, serviços e integrações do Firebase Starter. Ele reúne exemplos de interface, feedback visual, autenticação, Firestore e requisições HTTP em uma única página.

O Playground:

- Não é uma funcionalidade de produção.
- Não contém regras de negócio.
- Não substitui testes unitários nem testes E2E.
- Não representa validação definitiva de integrações, permissões ou Security Rules.
- Deve ser mantido simples e atualizado junto com os recursos que demonstra.

A página é composta por cinco categorias e dez demonstrações. A navegação entre categorias usa links com `routerLink` e fragmentos para as seções da própria página.

---

## Acesso e pré-requisitos

- Rota: `/playground`.
- A rota é carregada sob demanda em `src/app/app.routes.ts`.
- O acesso exige usuário autenticado e e-mail verificado.
- Guards aplicados: `authGuard` e `emailVerifiedGuard` (`src/app/core/guards/`).
- Usuário não autenticado é redirecionado para `/login`.
- Usuário autenticado com e-mail não verificado é redirecionado para `/verify-email`.
- Não foi encontrado link de navegação para o Playground nos templates da aplicação. O acesso é feito pela URL direta.

Como o Playground depende das mesmas proteções do restante da aplicação, é necessário existir um usuário válido no projeto Firebase configurado, com e-mail verificado.

---

## Como executar

Pré-requisitos: Node.js compatível com Angular 21 e npm. O projeto declara `packageManager: npm@10.8.2` em `package.json`.

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm start
```

Com o servidor em execução, acesse:

```text
http://localhost:4200/playground
```

A aplicação inicializa o Firebase a partir de `src/app/core/config/firebase.config.ts`, por meio dos providers de `src/app/core/firebase/`. É necessário que o projeto Firebase configurado tenha Authentication e Cloud Firestore habilitados. O repositório não possui configuração de Firebase Emulator nem arquivos de Security Rules versionados.

Os scripts npm disponíveis estão organizados por finalidade abaixo. O comando `npm start` (servidor de desenvolvimento) já está descrito na seção de execução.

**Desenvolvimento**

```bash
npm run ng -- <comando>
npm run watch
```

**Build**

```bash
npm run build
```

**Testes e validação**

```bash
npm test
npm run test:unit
npm run test:e2e
npm run type-check:playwright
```

---

## Organização das demonstrações

O template (`playground.html`) organiza as demonstrações em cinco categorias, cada uma com um `id` usado pela navegação por âncoras:

| Categoria | `id` da seção | Finalidade |
| --- | --- | --- |
| Interface e Design System | `interface-design` | Demonstra tema, ícones, botões e campos de entrada. |
| Feedback e Interação | `feedback-interacao` | Demonstra notificações, caixa de diálogo e carregamento. |
| Autenticação | `autenticacao` | Exibe o estado atual da autenticação e permite logout. |
| Firebase | `firebase` | Disponibiliza a interface de CRUD do Firestore. |
| Integrações HTTP | `integracoes-http` | Testa requisições HTTP e o comportamento dos interceptors. |

A ordem das categorias e das demonstrações é verificada por `playground.spec.ts`.

---

## Demonstrações disponíveis

### Interface e Design System

#### Tema (`demo-tema`)

Permite alternar entre os temas claro e escuro por meio do componente `ThemeToggle`. O estado é gerenciado pelo `ThemeService`, que aplica a classe `dark` ao documento e persiste a preferência no `localStorage` com a chave `FS:THEME`.

#### Ícones (`icon`)

Exibe ícones Lucide (`LucideHouse`, `LucideUser` e `LucideSettings`) em tamanhos diferentes, usando `@lucide/angular`. A demonstração é visual e não executa ações.

#### Botões (`demo-button`)

Apresenta o componente compartilhado `Button` com:

- Variantes `primary`, `secondary`, `outline`, `ghost` e `destructive`.
- Tamanhos `sm`, `md` e `lg`.
- Largura `auto` e `full`.
- Estados `loading` e `disabled`.
- Ícones no início e no fim.
- Botões somente com ícone (`iconOnly`), com `aria-label`.
- Combinações de variante, tamanho, largura, ícone e carregamento.

Os botões dessa demonstração são exemplos estáticos de composição visual; não executam regras de negócio.

#### Campos de entrada (`demo-inputs`)

Apresenta o componente compartilhado `Input` com três exemplos:

- **E-mail:** campo do tipo `email`, com ícone no início.
- **Senha:** campo do tipo `password`, com texto de apoio (`hint`), ícone e alternância de visibilidade da senha.
- **Usuário:** campo sem ícones.

Os campos usam `[(ngModel)]` e atualizam as propriedades `inputEmail`, `inputPassword` e `inputUsername` no componente. A demonstração é de formulário e composição visual, sem envio ou persistência.

### Feedback e Interação

#### Notificações (`toast`)

Demonstra o `ToastService` com dois botões:

- **Exibir notificação:** dispara uma notificação de sucesso.
- **Exibir várias notificações:** dispara sete notificações dos tipos `success`, `info`, `warning` e `error`.

Comportamentos configurados no serviço:

- Posição `top-center`.
- No máximo cinco notificações visíveis; as demais entram em fila.
- Duração padrão de 5000 ms para `success` e `info`.
- Notificações `warning` e `error` permanecem visíveis até serem fechadas.
- O container global é renderizado em `src/app/app.html` por `app-toast-container`.

#### Caixa de diálogo (`dialog`)

Demonstra o componente compartilhado `Dialog` com uma caixa intitulada “Novo projeto”. O conteúdo inclui ícone, descrição, campos de configuração e rodapé com os botões “Cancelar” e “Criar projeto”.

O componente suporta:

- Título obrigatório e descrição opcional.
- Tamanhos `sm`, `md` e `lg`.
- Fechamento por tecla `Esc` (habilitado por padrão).
- Botão de fechar (habilitado por padrão).
- Fechamento por clique no overlay (desabilitado por padrão no componente).
- Ícone e rodapé opcionais por diretivas de conteúdo.
- Aprisionamento de foco com `A11yModule` do Angular CDK.

A demonstração cobre apenas um diálogo de formulário. Não existem demonstrações específicas dos tipos “Confirm” ou “Alert”.

#### Carregamento (`loading`)

Apresenta o componente `Loading` nos tamanhos `sm`, `md` e `lg`, com texto “Carregando…”. Também permite testar o `LoadingService`:

- **Iniciar:** incrementa o contador de operações ativas.
- **Parar:** decrementa o contador, sem ficar abaixo de zero.
- O valor de `isLoading()` é exibido na própria seção.
- O overlay global é renderizado em `src/app/app.html` por `app-loading-overlay`.

### Autenticação

#### Estado da autenticação (`demo-guard`)

Exibe os valores expostos pelo `AuthService`:

- `authState`
- `isAuthenticated`
- `loading`
- `emailVerified`

Quando `isAuthenticated` é verdadeiro, é exibido o botão **Logout**, que chama `AuthService.logout()`. A demonstração não oferece controles de login, cadastro, recuperação de senha, reenvio de verificação ou recarregamento do usuário.

### Firebase

#### Firestore CRUD (`demo-firestore`)

Renderiza o componente `FirestoreTest`, que oferece uma interface manual para operações CRUD na coleção de testes `playground_users`. Detalhes na seção [Firestore CRUD](#firestore-crud).

### Integrações HTTP

#### Interceptor HTTP (`demo-interceptor`)

Demonstra o comportamento dos interceptors configurados em `src/app/app.config.ts`:

- **Testar requisição:** realiza `GET https://jsonplaceholder.typicode.com/posts/1`.
- **Testar requisição com erro:** realiza `GET https://jsonplaceholder.typicode.com/rota-inexistente`.
- **Testar requisição sem carregamento:** realiza um `GET` com `SKIP_LOADING`, ignorando o `loadingInterceptor`.

O `loadingInterceptor` inicia e finaliza o estado de carregamento global, exceto quando `SKIP_LOADING` está definido. O `authInterceptor` só anexa o token Firebase a origens presentes em `API_CONFIG.trustedOrigins`; como essa lista está vazia no estado atual (`src/app/core/config/api.config.ts`), o token não é anexado às requisições para `jsonplaceholder.typicode.com`.

Os resultados e erros dessas requisições são enviados para o console do navegador; a demonstração não exibe a resposta na interface.

---

## Firestore CRUD

A demonstração de Firestore é composta por:

- `src/app/features/dev/playground/firestore-test/firestore-test.ts`
- `src/app/features/dev/playground/firestore-test/firestore-test.html`
- `src/app/features/dev/playground/firestore-test/playground-user.repository.ts`

O componente `FirestoreTest` usa o repositório `PlaygroundUserRepository`, que estende `BaseRepository<User>` e delega as operações a um `FirestoreDataProvider`.

- Coleção utilizada: `playground_users`.
- A coleção é exclusiva do Playground e não reutiliza a coleção de domínio de usuários.
- O modelo manipulado é `User`, com os campos `id` e `email`.

### Operações disponíveis

| Operação | Controle | Comportamento |
| --- | --- | --- |
| Create | Campo **Email** e botão **Create** | Cria um documento com o campo `email` e exibe o ID retornado. |
| FindById | Campo **Document Id** e botão **Find By Id** | Consulta um documento pelo ID informado. |
| FindAll | Botão **Find All** | Lista todos os documentos da coleção. |
| Update | Campo **New Email** e botão **Update** | Atualiza o campo `email` do documento cujo ID está no campo **Document Id**. |
| Delete | Botão **Delete** | Exclui o documento cujo ID está no campo **Document Id**. |
| Clear | Botão de limpeza | Limpa os campos `id`, `email`, `updatedEmail` e o resultado exibido. |

O resultado das operações é armazenado em `result` e apresentado como JSON. Erros também são armazenados e exibidos no resultado.

### Como utilizar

1. Preencha o **Email** e clique em **Create** para criar um documento. O ID gerado é preenchido no campo **Document Id**.
2. Use **Find By Id** ou **Find All** para consultar.
3. Para atualizar, mantenha o ID desejado no campo **Document Id**, informe o novo e-mail em **New Email** e clique em **Update**.
4. Para excluir, mantenha o ID no campo **Document Id** e clique em **Delete**.

### Limitações da interface

- Após **Create**, o ID retornado pelo Firestore preenche automaticamente o campo **Document Id**. Para consultar, atualizar ou excluir outro documento, informe o ID desse documento no campo correspondente.
- **Create** grava apenas o campo `email`.
- Não há paginação, ordenação, filtros ou busca por campos na interface.
- **Delete** não solicita confirmação.
- Os dados são gravados diretamente na coleção `playground_users` do projeto Firebase configurado.

### Disponibilidade versus validação real

A interface do CRUD está integrada e visível no Playground. No entanto, os testes automatizados usam um repositório mockado: eles não executam operações contra o Firestore remoto nem validam Security Rules. A disponibilidade da interface não deve ser interpretada como validação ponta a ponta do Firebase.

O funcionamento real depende da configuração do projeto Firebase e das Security Rules aplicadas à coleção `playground_users`. Essas regras não estão versionadas neste repositório.

---

## Autenticação e proteção de acesso

### Disponível no Playground

- Exibição de `authState`, `isAuthenticated`, `loading` e `emailVerified`.
- Botão **Logout**, exibido apenas quando o usuário está autenticado.

### Disponível na aplicação, mas não integrado ao Playground

O `AuthService` implementa operações que não possuem demonstração na interface do Playground:

- Login (`login`).
- Cadastro (`register`).
- Recuperação de senha (`resetPassword`).
- Envio de verificação de e-mail (`sendEmailVerification`).
- Recarregamento do usuário (`reloadUser`).
- Obtenção de token (`getIdToken`).

Os fluxos de login, cadastro, recuperação de senha e verificação de e-mail existem nas páginas de autenticação da aplicação, mas não devem ser considerados demonstrações do Playground.

### Proteção da rota

A rota `/playground` é protegida por:

- `authGuard`: aguarda a inicialização da autenticação e redireciona usuários não autenticados para `/login`.
- `emailVerifiedGuard`: permite o acesso apenas a usuários autenticados com e-mail verificado; usuários autenticados sem verificação são redirecionados para `/verify-email`.

---

## Limitações conhecidas

- **Storage:** não há implementação de upload ou download. Não foi encontrado uso de `firebase/storage` no código, apesar de `storageBucket` existir na configuração do Firebase.
- **Cloud Functions:** não há implementação nem uso de `firebase/functions`.
- **Security Rules:** não há arquivos de regras ou configuração de Firebase Emulator versionados no repositório. As permissões dependem do projeto Firebase configurado.
- **Validação real do Firestore:** os testes usam mocks; não há evidência de validação do CRUD contra o Firestore remoto.
- **Cobertura E2E:** o único teste E2E específico do Playground verifica o redirecionamento de usuário não autenticado. Não há E2E autenticado do Playground nem E2E das operações CRUD.
- **Autenticação:** a página demonstra apenas estado e logout; login, cadastro, recuperação, recarregamento e verificação de e-mail não estão integrados ao Playground.
- **Firestore:** a interface não possui paginação, ordenação, filtros ou confirmação de exclusão.
- **Diálogo:** existe apenas a demonstração de um diálogo de formulário; não há variantes específicas de confirmação ou alerta.
- **Integrações HTTP:** as respostas são exibidas apenas no console; não há resultado visual na página.
- **Acesso:** não há link de navegação para o Playground; o acesso é feito por URL direta.
- **Uso:** a página não deve ser usada como funcionalidade de produção nem como validação de segurança.

---

## Testes e validação

### Testes unitários

`src/app/features/dev/playground/playground/playground.spec.ts` verifica:

- Criação do componente.
- Presença das cinco categorias na ordem esperada.
- Presença das dez demonstrações na ordem esperada.
- Ausência da classe `test-closed`.
- Renderização do componente `FirestoreTest`.
- Existência de cinco links de âncora válidos, todos apontando para `/playground` e para seções existentes.
- Atualização do modelo ao preencher o campo de e-mail.
- Acionamento do `ToastService` pelo botão de notificação.

`src/app/features/dev/playground/firestore-test/firestore-test.spec.ts` verifica, com um repositório mockado:

- Criação de documento e armazenamento do ID retornado.
- Consulta por ID.
- Listagem de documentos.
- Atualização de e-mail.
- Exclusão de documento.
- Armazenamento de erro quando uma operação falha.
- Limpeza dos campos e do resultado.

`src/app/features/dev/playground/firestore-test/playground-user.repository.spec.ts` verifica:

- Uso da coleção `playground_users`.
- Delegação das operações `create` e `findAll` ao provider.

### Testes E2E

`tests/playwright/app/playground.spec.ts` cobre apenas o redirecionamento para `/login` quando o usuário não está autenticado.

### O que não está coberto

- Acesso autenticado ao Playground.
- Acesso direto à rota `/playground` por usuário autenticado cujo e-mail ainda não foi verificado.
- Operações CRUD contra o Firestore real.
- Validação de Security Rules.
- Comportamentos de Toast, Dialog, Loading, tema, ícones, botões e interceptor HTTP em testes E2E.
- Exibição visual dos resultados das requisições HTTP.

Os testes existentes não validam o Firebase remoto. As operações do Firestore são verificadas apenas com mocks.
