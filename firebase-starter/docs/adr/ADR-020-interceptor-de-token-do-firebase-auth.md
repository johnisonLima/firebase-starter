# Decisão 020

### Título

Propagação do Firebase ID Token por AuthInterceptor

### Contexto

A aplicação possui autenticação baseada no Firebase Authentication e precisa encaminhar a credencial do usuário autenticado para as APIs que exigem autenticação.

Realizar a obtenção e inclusão do token manualmente em cada requisição criaria duplicação de código e espalharia responsabilidades relacionadas à autenticação pelos diferentes serviços da aplicação.

Além disso, é necessário manter uma separação clara entre as responsabilidades de autenticação, transporte da credencial e validação da credencial pela API.

### Alternativas consideradas

**1. Cada serviço adicionar o token manualmente**

Cada serviço responsável por realizar uma requisição HTTP obteria o token e adicionaria o header `Authorization`.

**Vantagens**

* Implementação direta.
* Controle explícito em cada requisição.

**Desvantagens**

* Duplicação de código.
* Maior risco de esquecer o token em uma requisição protegida.
* Acoplamento dos serviços à implementação da autenticação.
* Dificulta a manutenção e evolução da estratégia de autenticação.

---

**2. AuthInterceptor adicionar automaticamente o token (Escolhido)**

O `AuthInterceptor` será responsável por obter o Firebase ID Token disponibilizado pelo mecanismo de autenticação e adicioná-lo às requisições HTTP quando houver um usuário autenticado.

### Decisão

Requisições HTTP da aplicação **podem receber automaticamente o Firebase ID Token através de um interceptor**, utilizando o header:

```text
Authorization: Bearer <token>
```

quando houver um usuário autenticado.

A responsabilidade será dividida da seguinte forma:

```text
AuthService
    ↓
fornece credencial

AuthInterceptor
    ↓
transporta credencial

API
    ↓
valida credencial
```

O `AuthService` permanece responsável pelo contexto de autenticação e pela disponibilização da credencial.

O `AuthInterceptor` atua exclusivamente como mecanismo de transporte, adicionando o token à requisição quando aplicável.

A API permanece responsável por validar a credencial recebida e determinar se a requisição está autorizada.

Essa separação impede que serviços de domínio ou componentes da aplicação precisem conhecer os detalhes de como o token é obtido ou transportado.

### Consequências

#### Positivas

✔ Centraliza o transporte do Firebase ID Token.

✔ Elimina a necessidade de adicionar manualmente o token em cada serviço.

✔ Reduz duplicação de código.

✔ Mantém os serviços desacoplados da implementação de autenticação.

✔ Define claramente a fronteira entre autenticação, transporte e autorização.

✔ Facilita futuras alterações na estratégia de autenticação ou transporte da credencial.

✔ Mantém a API como autoridade responsável pela validação do token.

#### Negativas

✖ Requisições públicas e protegidas precisam ser diferenciadas quando necessário.

✖ O interceptor passa a possuir conhecimento sobre a necessidade de transportar credenciais de autenticação.

✖ Falhas na obtenção ou atualização do token podem afetar requisições que dependem de autenticação.

### Data

19/08/2026
