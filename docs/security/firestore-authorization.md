# Firestore — matriz de autorização

## Estado

Esta especificação formaliza a matriz da FIX-021. Os cenários automatizados estão em `tests/firestore/` e exercitam as regras locais no Firestore Emulator. As regras aplicam o princípio do menor privilégio definido em [Architecture v1.0](../Architecture-v1.0.md#151-seguranca) e protegem o Firestore independentemente dos guards Angular.

O contrato de documento de perfil está em [User Profile](../data/user-profile.md).

## Claims de autorização

A autorização administrativa usa duas Custom Claims booleanas independentes:

```json
{
  "canEditAllProfiles": false,
  "canDeleteAllProfiles": false
}
```

- Claim ausente ou `false` não concede a permissão correspondente.
- `canEditAllProfiles: true` concede consulta e edição de perfis de terceiros, respeitando a imutabilidade do campo `email` em atualizações comuns.
- `canDeleteAllProfiles: true` concede exclusão de documentos de terceiros. A exclusão do próprio perfil não depende desta claim.
- As permissões são independentes: conceder exclusão não concede leitura nem edição de perfis de terceiros; conceder edição não concede exclusão.
- A atribuição das claims cabe exclusivamente a ambiente confiável usando Firebase Admin SDK. O frontend Angular não pode conceder nem modificar essas permissões.

## Perfis derivados

| Perfil | `canEditAllProfiles` | `canDeleteAllProfiles` |
| --- | --- | --- |
| Comum | ausente ou `false` | ausente ou `false` |
| Editor | `true` | ausente ou `false` |
| Excluidor | ausente ou `false` | `true` |
| Administrador | `true` | `true` |

Os nomes dos perfis são rótulos derivados das combinações das claims; não são uma terceira claim nem um campo de papel armazenado no perfil.

## Matriz de autorização

| Operação | Comum | Editor | Excluidor | Administrador |
| --- | --- | --- | --- | --- |
| Consultar próprio perfil | Sim | Sim | Sim | Sim |
| Consultar outros perfis | Não | Sim | Não | Sim |
| Criar próprio perfil | Sim | Sim | Sim | Sim |
| Editar próprio perfil | Sim | Sim | Sim | Sim |
| Editar outros perfis | Não | Sim | Não | Sim |
| Excluir próprio perfil | Sim | Sim | Sim | Sim |
| Excluir outros perfis | Não | Não | Sim | Sim |

“Próprio perfil” é o documento cujo caminho usa o UID do usuário autenticado (`users/{request.auth.uid}`). Para excluir esse documento, o usuário deve estar autenticado e ter o e-mail verificado; a permissão não depende de Custom Claims. Excluir documentos de terceiros exige `canDeleteAllProfiles: true`. A matriz descreve autorização no Firestore; a interface ou os guards do cliente não substituem essa verificação.

## Regras e limites de confiança

- Usuários comuns podem consultar, criar e atualizar somente o próprio documento. Qualquer usuário autenticado e com e-mail verificado também pode excluir seu próprio perfil, sem depender de Custom Claims.
- Editores podem consultar e editar perfis de terceiros, mas não podem modificar o campo `email` por uma atualização comum.
- Excluidores podem excluir perfis de terceiros, sem receber automaticamente autorização para ler ou editar esses perfis. A exclusão do próprio perfil é permitida a qualquer usuário autenticado e verificado.
- Administradores possuem as permissões de edição e exclusão descritas pelas duas claims.
- A criação de perfil é limitada ao próprio UID, inclusive para usuários com claims administrativas.
- Somente campos definidos no [contrato do perfil](../data/user-profile.md) podem ser persistidos; campos desconhecidos devem ser rejeitados.
- Excluir um documento Firestore, inclusive o próprio perfil, não exclui a conta correspondente no Firebase Authentication. Não há exclusão coordenada de conta no escopo desta política.
- Security Rules protegem operações diretas no Firestore. Um backend futuro deverá validar explicitamente as mesmas permissões antes de executar operações administrativas com Firebase Admin SDK, pois Admin SDK não é limitado pelas Firestore Security Rules.
- O Firebase ID Token e suas claims são avaliados pelas regras do servidor; estado de interface, guards e dados manipuláveis pelo cliente não são fonte confiável para autorização.

## Testes automatizados

A suíte em `tests/firestore/` contém 35 testes em sete arquivos: autenticação (2), permissões comum (3), editor (3), excluidor (2), administrador (2), validação de perfil (22) e smoke test da infraestrutura (1). Ela cobre leituras pontuais, consultas/listagem, criação, atualização, exclusão, claims independentes, campos e tipos permitidos, limites inclusivos, e-mail imutável e datas do calendário gregoriano. Consultas são testadas como consultas Firestore reais, sem pressupor filtragem pelas Rules.

Execute com `npm run test:firestore-rules` e verifique os tipos com `npm run type-check:firestore-tests`. A suíte inicia exclusivamente o Firestore Emulator, usa `demo-firebase-starter-rules`, carrega `firestore.rules` local e cria contextos de autenticação simulados sem iniciar o Auth Emulator, fazer deploy ou acessar projeto real. Na validação desta atualização, os 35 testes e o type-check passaram no Firestore Emulator.

**Validação dos campos:** limites inclusivos por documento: `email` 254, `name` 120, `phone` 20, `birthDate` 10, `gender` 40, `neighborhood` 100, `city` 100, `state` 2 e `photoURL` 2048 caracteres. Os limites são aplicados aos documentos resultantes de atualização; criação inicial continua aceitando apenas `email`, que também deve coincidir com o token. `gender` e `photoURL` continuam aceitando `null`; campos opcionais podem ser omitidos.

`birthDate` é validada com expressões RE2 compatíveis com Security Rules: meses e dias válidos, anos bissextos a cada quatro anos, exceto séculos não divisíveis por 400. O ano `0000` é rejeitado. Não há validação de idade, data futura, sintaxe de e-mail, E.164, enum de `gender` ou formato de URL para `photoURL`; esses critérios não fazem parte da política aprovada.

## Decisão arquitetural

A adoção das duas Custom Claims independentes, a atribuição confiável e os limites de autorização estão registrados na [ADR-030 — Autorização de perfis por Custom Claims do Firebase Authentication](../adr/ADR-030-autorizacao-de-perfis-por-custom-claims-do-firebase-authentication.md). As regras e os testes estão implementados localmente e validados no Emulator; esta documentação não registra deploy ou alteração do Firebase remoto.

