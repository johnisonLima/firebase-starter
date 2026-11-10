# User Profile — contrato de dados

## Estado

Esta especificação formaliza o contrato proposto para o perfil de usuário no escopo da FIX-021. Ela orienta uma implementação futura; não afirma que o modelo já esteja implementado no frontend, no Firestore ou em Security Rules.

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

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `name` | `string` | Sim | Nome do usuário. |
| `email` | `string` | Sim | Cópia sincronizada do e-mail oficial mantido pelo Firebase Authentication. |
| `phone` | `string` | Não | Telefone com DDD. |
| `birthDate` | `string` | Não | Data no formato `YYYY-MM-DD`. |
| `gender` | `string \| null` | Não | Enumeração ainda pendente de definição. Não há valores permitidos definidos nesta especificação. |
| `neighborhood` | `string` | Não | Bairro. |
| `city` | `string` | Não | Cidade. |
| `state` | `string` | Não | Unidade federativa brasileira. |
| `photoURL` | `string \| null` | Não | URL da foto, reservada para futura integração com Firebase Storage. |

Campos ausentes são permitidos somente para os atributos opcionais. Campos fora deste contrato deverão ser rejeitados pelas futuras Firestore Security Rules.

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

## Relação com a implementação atual

O modelo TypeScript atual `User` contém somente `email`, e `Entity` define `id`. A implementação futura deverá alinhar esses tipos a este contrato sem persistir um campo `id` duplicado. A configuração e os repositórios existentes não implementam, por si só, as regras de UID, validação de campos ou sincronização descritas aqui.

## Pendências

- Definir e registrar os valores permitidos para `gender`, se o campo for mantido.
- Definir validações de formato e limites para os campos antes de escrever as regras.
- Definir o mecanismo confiável de sincronização do e-mail no backend.
- Implementar o modelo, o comportamento de persistência e as Security Rules em etapas próprias.

A política de autorização associada ao perfil está formalizada na [ADR-030](../adr/ADR-030-autorizacao-de-perfis-por-custom-claims-do-firebase-authentication.md) e na [matriz de autorização do Firestore](../security/firestore-authorization.md).

