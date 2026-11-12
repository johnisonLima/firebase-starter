# User Profile — contrato de dados

## Estado

Esta especificação registra o contrato de dados do perfil no escopo da FIX-021. As Firestore Security Rules locais validam os limites e formatos documentados; isso não implica que o modelo esteja integralmente implementado no frontend.

## Identidade e localização

- **Coleção:** `users`
- **Documento:** `users/{uid}`
- **Identificador:** UID correspondente da conta Firebase Authentication.
- Cada conta possui no máximo um perfil, identificado diretamente pelo UID.
- O campo `id` não precisa ser persistido no documento. Caso o modelo TypeScript implemente a abstração `Entity` existente, o repositório pode expor o UID como `id` sem duplicá-lo nos dados armazenados.

## Modelo proposto

```json
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "phone": "77999999999",
  "birthDate": "1995-05-20",
  "gender": null,
  "neighborhood": "Centro",
  "city": "Vitória da Conquista",
  "state": "BA",
  "photoURL": null
}
```

## Atributos

| Campo | Tipo | Obrigatório no modelo | Limite | Validação |
| --- | --- | --- | ---: | --- |
| `name` | `string` | Sim no modelo | 120 caracteres | Texto; campo opcional no documento de acordo com as regras atuais. |
| `email` | `string` | Sim | 254 caracteres | Deve corresponder ao e-mail do token na criação; imutável em atualizações comuns. |
| `phone` | `string` | Não | 20 caracteres | Texto; não exige formato E.164. |
| `birthDate` | `string` | Não | 10 caracteres | Data existente no calendário gregoriano, no formato `YYYY-MM-DD`. |
| `gender` | `string \| null` | Não | 40 caracteres | Sem enumeração; `null` é permitido. |
| `neighborhood` | `string` | Não | 100 caracteres | Texto. |
| `city` | `string` | Não | 100 caracteres | Texto. |
| `state` | `string` | Não | 2 caracteres | Duas letras maiúsculas (`A`–`Z`). |
| `photoURL` | `string \| null` | Não | 2048 caracteres | Texto sem validação de URL; `null` é permitido. |

Campos opcionais podem ser omitidos. Campos fora deste contrato são rejeitados pelas Firestore Security Rules. Os limites são contados em caracteres pela função `String.size()` das Rules.

## Regras de negócio

1. Cada conta Authentication possui um único perfil em `users/{uid}`.
2. O UID da conta é a chave do documento e a relação entre Authentication e Firestore.
3. O UID não precisa ser repetido como campo `id` no documento persistido.
4. Firebase Authentication é a fonte oficial do e-mail; `users/{uid}.email` é uma cópia sincronizada.
5. Atualizações comuns do perfil não podem alterar `email`.
6. A sincronização do e-mail após uma mudança no Firebase Authentication será responsabilidade de um backend confiável futuro, que localizará o perfil pelo mesmo UID. A implementação e o mecanismo de sincronização ainda precisam ser definidos.
7. Campos não previstos no contrato devem ser rejeitados pelas Security Rules.
8. Excluir o documento do perfil não exclui a conta no Firebase Authentication.
9. `photoURL` fica reservado para possível integração futura com Firebase Storage; essa integração não faz parte do escopo implementado.
10. A enumeração de `gender` permanece pendente; nenhum conjunto de valores é presumido.
11. As Rules verificam os limites de caracteres em criações e atualizações permitidas. A criação inicial aceita somente `email`.
12. `birthDate` deve ser uma data existente no calendário gregoriano, entre `0001-01-01` e `9999-12-31`, sem restrições de idade ou data futura.

## Relação com a implementação atual

O modelo TypeScript atual `User` contém somente `email`, e `Entity` define `id`. A implementação futura deverá alinhar esses tipos a este contrato sem persistir um campo `id` duplicado. As regras locais em `firestore.rules` aplicam a associação por UID e as validações de tamanho e calendário; isso não implementa por si só a sincronização de e-mail descrita aqui.

## Pendências

- Definir e registrar os valores permitidos para `gender`, se o campo for mantido.
- Alinhar o modelo TypeScript e validações de formulário ao contrato quando a funcionalidade de perfil correspondente for implementada.
- Definir o mecanismo confiável de sincronização do e-mail no backend.
- Alinhar o modelo e o comportamento de persistência no frontend em etapas próprias.

A política de autorização associada ao perfil está formalizada na [ADR-030](../adr/ADR-030-autorizacao-de-perfis-por-custom-claims-do-firebase-authentication.md) e na [matriz de autorização do Firestore](../security/firestore-authorization.md).

