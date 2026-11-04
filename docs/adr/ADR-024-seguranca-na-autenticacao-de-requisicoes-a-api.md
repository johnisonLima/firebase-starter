# ADR-024 — Segurança na Autenticação de Requisições à API

### Título

Segurança na Autenticação de Requisições à API

### Contexto

A aplicação utiliza Firebase Authentication para autenticar seus usuários e obter o Firebase ID Token, utilizado na autenticação de requisições HTTP.

Conforme estabelecido na ADR-020, o `AuthInterceptor` é responsável por transportar a credencial de autenticação através do header `Authorization: Bearer <token>`.

Entretanto, a aplicação também pode realizar requisições para serviços externos que não pertencem à infraestrutura confiável do sistema.

O envio indiscriminado do Firebase ID Token para qualquer origem HTTP representa um risco de segurança, pois pode expor credenciais de autenticação a serviços que não possuem autorização para recebê-las.

Dessa forma, tornou-se necessário estabelecer uma política explícita para determinar quais origens podem receber o Firebase ID Token.

### Alternativas consideradas

**1. Enviar o token para todas as requisições HTTP**

O `AuthInterceptor` adicionaria automaticamente o Firebase ID Token a todas as requisições HTTP realizadas pela aplicação.

**Vantagens**

- Implementação simples.
- Não exige configuração adicional de origens.

**Desvantagens**

- Pode expor credenciais a serviços externos.
- Não diferencia APIs confiáveis de serviços públicos.
- Aumenta a superfície de risco de segurança.

---

**2. Enviar o token somente para origens confiáveis (Escolhido)**

O `AuthInterceptor` adicionará o Firebase ID Token somente quando a requisição for destinada a uma origem explicitamente configurada como confiável.

### Decisão

O **Firebase ID Token deverá ser enviado exclusivamente para origens confiáveis previamente configuradas**.

A lista de origens confiáveis será definida em:

`src/app/core/config/api.config.ts`

Essa configuração será responsável por estabelecer quais origens podem receber credenciais de autenticação.

O `AuthInterceptor` será responsável por verificar a origem da requisição e controlar o envio do Firebase ID Token.

Requisições destinadas a origens não confiáveis não deverão receber o token, mesmo quando houver um usuário autenticado.

A responsabilidade arquitetural será dividida da seguinte forma:

```text
api.config.ts
      ↓
Define origens confiáveis

AuthInterceptor
      ↓
Controla o envio do token

API
      ↓
Valida a credencial recebida
```

### Consequências

#### Positivas

✔ Restringe o envio do Firebase ID Token a origens previamente autorizadas.

✔ Reduz o risco de exposição de credenciais a serviços externos.

✔ Torna explícita a política de origens que podem receber autenticação.

✔ Mantém o `AuthInterceptor` responsável apenas pelo controle do envio do token.

✔ Preserva a API como autoridade na validação da credencial recebida.

✔ Centraliza a configuração de origens confiáveis em um único local.

#### Negativas

✖ Requer manutenção da lista de origens confiáveis sempre que uma nova API autenticada for integrada.

✖ Uma configuração incorreta pode impedir o envio do token para uma origem legítima.

✖ O `AuthInterceptor` passa a depender de uma configuração adicional da aplicação.

✖ A verificação de origem adiciona complexidade ao fluxo de transporte da credencial.

### Data

03/11/2026
