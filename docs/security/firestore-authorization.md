# Firestore — matriz de autorização

## Estado

Esta especificação formaliza a matriz proposta para a FIX-021. As Custom Claims, regras e testes descritos ainda não estão implementados nem validados. As regras futuras deverão aplicar o princípio do menor privilégio definido em [Architecture v1.0](../Architecture-v1.0.md#151-seguranca) e proteger o Firestore independentemente dos guards Angular.

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

## Testes futuros

As permissões deverão ser cobertas por testes de integração usando Firebase Emulator Suite, incluindo combinações de claims, operações próprias e sobre terceiros, tentativas de alterar `email`, campos não permitidos e operações negadas. Os testes deverão executar contra o emulador; a configuração e os testes ainda estão pendentes.

## Decisão arquitetural

A adoção das duas Custom Claims independentes, a atribuição confiável e os limites de autorização estão registrados na [ADR-030 — Autorização de perfis por Custom Claims do Firebase Authentication](../adr/ADR-030-autorizacao-de-perfis-por-custom-claims-do-firebase-authentication.md). A implementação das regras e dos testes continua pendente.

