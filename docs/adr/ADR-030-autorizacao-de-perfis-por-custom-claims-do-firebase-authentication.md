# ADR-030 — Autorização de perfis por Custom Claims do Firebase Authentication

### Título

Autorização de perfis por Custom Claims do Firebase Authentication

### Status

Aceita.

### Contexto

O projeto utiliza Firebase Authentication para identificar usuários e Cloud Firestore para persistência. A FIX-021 identificou a necessidade de formalizar as Security Rules do Firestore e a política de autorização para os documentos de perfil.

Os perfis residem em `users/{uid}`, usando como identificador do documento o UID da conta no Firebase Authentication. O campo `email` do perfil é uma cópia sincronizada do e-mail oficial mantido pelo Authentication. O contrato de dados está detalhado em [User Profile](../data/user-profile.md), e a matriz funcional está em [Firestore authorization](../security/firestore-authorization.md).

É necessário distinguir as permissões administrativas de edição e exclusão, sem confiar em dados de autorização que o próprio cliente possa modificar e sem acoplar permissões administrativas ao perfil pessoal.

### Alternativas consideradas

**1. Armazenar um atributo `role` no documento do perfil**

Essa alternativa manteria a autorização junto aos dados de perfil no Firestore.

**Desvantagens**

- Mistura dados pessoais com privilégios administrativos.
- Um campo gravável pelo cliente não pode ser tratado como fonte confiável de autorização.
- Um papel único não expressa diretamente as permissões independentes de edição e exclusão.

**2. Usar uma única Custom Claim de papel**

Um papel no token poderia representar categorias administrativas, mas exigiria enumerar e manter combinações de permissões à medida que as capacidades evoluíssem.

**Desvantagens**

- Acopla operações distintas a uma classificação única.
- A permissão de excluir ou editar poderia ser concedida implicitamente por uma combinação de papéis mal definida.

**3. Usar duas Custom Claims independentes (Escolhida)**

As permissões de editar todos os perfis e excluir perfis são expressas separadamente no Firebase ID Token, com atribuição confiável pelo Firebase Admin SDK.

### Decisão

Adotar as seguintes Firebase Custom Claims booleanas independentes:

```json
{
  "canEditAllProfiles": true,
  "canDeleteAllProfiles": true
}
```

Claims ausentes são interpretadas como `false`. Não será utilizado um atributo `role` no documento User Profile. Os rótulos abaixo descrevem combinações das permissões e não constituem uma claim adicional:

| Perfil derivado | `canEditAllProfiles` | `canDeleteAllProfiles` |
| --- | --- | --- |
| Usuário comum | ausente ou `false` | ausente ou `false` |
| Editor | `true` | ausente ou `false` |
| Excluidor | ausente ou `false` | `true` |
| Administrador | `true` | `true` |

As Firestore Security Rules utilizarão as claims do token autenticado para autorizar operações em `users/{uid}`. A política funcional é:

- Usuários comuns podem consultar, criar e atualizar somente o próprio perfil.
- Editores podem consultar e atualizar perfis de terceiros.
- Excluidores podem excluir perfis, mas não recebem por isso autorização para consultar ou editar documentos de terceiros.
- Usuários com ambas as claims podem executar as operações administrativas de edição e exclusão.
- A edição do perfil não pode modificar o campo `email`.
- A criação de perfil usa o UID autenticado como ID do documento. A associação Authentication–Firestore é feita por esse UID.
- O Firebase Authentication é a fonte oficial do e-mail; o `email` persistido no perfil é uma cópia sincronizada.
- Excluir o documento Firestore não exclui a conta correspondente no Firebase Authentication.

### Confiança e responsabilidades

- As Custom Claims serão atribuídas exclusivamente por ambiente confiável usando Firebase Admin SDK. O frontend Angular não poderá atribuir nem modificar claims.
- As Firestore Security Rules protegem operações diretas realizadas com o SDK cliente e devem validar a identidade e as permissões do token autenticado.
- As alterações de Custom Claims passam a constar no ID Token em uma emissão/renovação subsequente. A sessão cliente pode precisar de novo login, renovação ou atualização forçada do token para observar as claims atualizadas.
- Um backend futuro deverá validar sua própria autorização antes de executar operações administrativas. Bibliotecas server-side/Admin SDK não são limitadas pelas Firestore Security Rules.
- O mecanismo futuro para sincronizar alterações de e-mail do Authentication ao perfil deverá ser executado por ambiente confiável, usando o UID como chave. Esta ADR não escolhe um serviço nem implementa a sincronização.
- As regras deverão ser testadas com Firebase Emulator Suite antes de qualquer publicação.

### Escopo

Esta decisão não determina a implementação de backend próprio, Cloud Functions, interface administrativa, serviço de gerenciamento de permissões, Firebase Storage ou exclusão coordenada entre contas Authentication e documentos Firestore. Esses itens permanecem fora do escopo da FIX-021 e dependem de decisões futuras quando aplicáveis.

Esta ADR formaliza a política, mas não implementa nem publica Security Rules, Custom Claims, backend ou testes.

### Consequências

#### Positivas

- Separa os dados pessoais do perfil das permissões administrativas.
- Permite conceder edição e exclusão independentemente, seguindo menor privilégio.
- Usa o UID como chave única de relacionamento entre Authentication e Firestore.
- Mantém a autoridade de concessão das permissões em ambiente confiável, fora do frontend.
- Define que alterações comuns não podem trocar o e-mail sincronizado.

#### Negativas

- É necessário operar um ambiente confiável com Firebase Admin SDK para atribuir ou remover permissões.
- A propagação das alterações depende da emissão ou renovação do ID Token; a interface pode observar claims antigas até a renovação.
- A política precisa ser implementada tanto nas Firestore Security Rules quanto, futuramente, no backend que utilize Admin SDK.
- A matriz precisa de testes de permissão e negação no Firebase Emulator Suite e manutenção quando novos campos ou operações forem introduzidos.
- O mecanismo de sincronização do e-mail permanece uma responsabilidade futura ainda sem implementação.

### ADRs relacionadas

- [ADR-002 — Não utilizar environments](ADR-002-não-utilizar-enviroments.md)
- [ADR-003 — Registrar o Firebase durante o bootstrap](ADR-003-registrar-o-firebase-durante-o-bootstrap.md)
- [ADR-004 — Separar configuração da inicialização do Firebase](ADR-004-separar-configuração-da-inicialização-do-firebase.md)
- [ADR-007 — Não criar um FirebaseService genérico](ADR-007-não-criar-um-firebaseService-genérico.md)
- [ADR-012 — Camada de abstração de dados](<ADR-012-camada-de-abstração-de-dados-(data-provider-pattern).md>)
- [ADR-020 — Propagação do Firebase ID Token por AuthInterceptor](ADR-020-interceptor-de-token-do-firebase-auth.md)
- [ADR-021 — AuthService como fachada única de autenticação](ADR-021-auth-service-como-fachada-de-autenticacao.md)
- [ADR-022 — Configuração do Firebase na infraestrutura](ADR-022-configuracao-do-firebase-na-infraestrutura.md)
- [ADR-024 — Segurança na autenticação de requisições à API](ADR-024-seguranca-na-autenticacao-de-requisicoes-a-api.md)
- [ADR-026 — Interceptação fail-closed do Firebase Auth nos testes E2E](ADR-026-interceptacao-fail-closed-do-firebase-auth-nos-testes-e2e.md)

### Referências

- [Firebase Authentication — Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Cloud Firestore — Writing conditions for Security Rules](https://firebase.google.com/docs/firestore/security/rules-conditions)

### Data

10/11/2026

