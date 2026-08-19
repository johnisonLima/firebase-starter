# Decisão 021

### Título

AuthService como Fachada Única de Autenticação

### Contexto

Durante a refatoração da camada de autenticação, surgiu a possibilidade de separar as responsabilidades relacionadas à autenticação em diferentes serviços, como serviços específicos para sessão, verificação de e-mail e obtenção do Firebase ID Token.

Embora a separação de responsabilidades seja importante para manter o código organizado, a criação prematura de múltiplos serviços para responsabilidades que ainda possuem forte coesão poderia resultar em uma fragmentação artificial da arquitetura.

O `AuthService` já representa o ponto de entrada da aplicação para operações relacionadas à autenticação e possui contexto suficiente para coordenar essas responsabilidades.

Portanto, tornou-se necessário estabelecer um limite arquitetural que evite a criação de abstrações adicionais sem uma necessidade concreta.

### Alternativas consideradas

**1. Criar serviços específicos para cada responsabilidade**

Separar a autenticação em serviços independentes, por exemplo:

* `SessionService`
* `EmailVerificationService`
* `TokenService`

**Vantagens**

* Maior granularidade das responsabilidades.
* Possibilidade de evolução independente de cada serviço.

**Desvantagens**

* Aumenta a quantidade de abstrações.
* Pode fragmentar responsabilidades que ainda são coesas.
* Cria indireções desnecessárias.
* Pode dificultar a compreensão do fluxo de autenticação.

---

**2. Manter o AuthService como fachada única (Escolhido)**

Manter o `AuthService` como ponto de entrada da aplicação para as operações e o estado relacionados à autenticação, enquanto essas responsabilidades permanecerem coesas.

### Decisão

O **`AuthService` permanece como fachada única de autenticação da aplicação**.

O serviço será responsável pelas operações e pelo estado relacionados à autenticação, incluindo responsabilidades como:

* autenticação e encerramento de sessão;
* acompanhamento do usuário autenticado;
* verificação do estado de autenticação;
* verificação de e-mail;
* obtenção do Firebase ID Token.

Não serão criados serviços separados para sessão, verificação de e-mail ou obtenção do ID Token **enquanto essas responsabilidades permanecerem coesas e fizerem parte do mesmo contexto de autenticação**.

Essa decisão não impede uma futura separação. Caso uma dessas responsabilidades adquira complexidade, ciclo de vida ou regras próprias que justifiquem uma abstração independente, uma nova decisão arquitetural poderá estabelecer essa separação.

### Consequências

#### Positivas

✔ Evita fragmentação artificial da camada de autenticação.

✔ Mantém um ponto de entrada claro para funcionalidades de autenticação.

✔ Reduz a quantidade de abstrações desnecessárias.

✔ Facilita a compreensão do fluxo de autenticação.

✔ Mantém coesas responsabilidades que pertencem ao mesmo contexto.

✔ Permite futura separação quando houver uma necessidade arquitetural real.

✔ Simplifica a comunicação entre autenticação e demais partes da aplicação.

#### Negativas

✖ O `AuthService` pode crescer caso novas responsabilidades sejam adicionadas sem avaliar sua coesão.

✖ Exige atenção para evitar que o serviço se transforme em um *God Service*.

✖ Uma futura separação poderá exigir refatoração caso alguma responsabilidade deixe de ser coesa.

### Data

19/08/2026
