# Decisão 022

### Título

Configuração do Firebase na Camada de Infraestrutura

### Contexto

Durante a refatoração da autenticação, foi identificada uma responsabilidade de infraestrutura dentro do `AuthService`: a inicialização e configuração da instância do Firebase Authentication.

O `AuthService` continha diretamente configurações como:

```text
initializeAuth(...)
browserLocalPersistence
```

Essas configurações representam detalhes específicos da tecnologia utilizada e não fazem parte da responsabilidade de um serviço da aplicação.

Para manter a separação entre aplicação e infraestrutura, essa configuração foi extraída para o `provideFirebase()`.

### Alternativas consideradas

**1. Manter a configuração do Firebase dentro do AuthService**

O `AuthService` continuaria responsável tanto pelas operações de autenticação quanto pela inicialização e configuração do Firebase.

**Vantagens**

* Implementação direta.
* Menor quantidade inicial de arquivos e abstrações.

**Desvantagens**

* Acopla o serviço de autenticação aos detalhes de inicialização do Firebase.
* Mistura responsabilidades de aplicação e infraestrutura.
* Dificulta substituir ou alterar a configuração da infraestrutura.
* Torna o `AuthService` responsável por detalhes que não pertencem ao seu contexto.

---

**2. Centralizar a configuração na infraestrutura (Escolhido)**

A inicialização das instâncias Firebase e suas configurações específicas ficam na camada de infraestrutura, enquanto os serviços da aplicação recebem as instâncias necessárias através de injeção de dependência.

### Decisão

A **inicialização e configuração das instâncias Firebase pertencem à camada de infraestrutura**.

Configurações específicas do Firebase, como:

```text
initializeAuth(...)
browserLocalPersistence
```

serão realizadas através do `provideFirebase()`.

Os serviços de domínio e aplicação não serão responsáveis por inicializar ou configurar diretamente as instâncias do Firebase. Eles deverão consumir as instâncias disponibilizadas pela infraestrutura através de **Dependency Injection (DI)**.

A separação estabelecida é:

```text
Infraestrutura
    ↓
provideFirebase()
    ↓
Inicializa e configura Firebase
    ↓
Dependency Injection
    ↓
Serviços da aplicação
    ↓
Consomem Firebase
```

Essa decisão mantém os detalhes tecnológicos do Firebase isolados na infraestrutura, permitindo que os serviços consumidores trabalhem com as dependências necessárias sem conhecer seu processo de inicialização.

### Consequências

#### Positivas

✔ Separa claramente aplicação e infraestrutura.

✔ Reduz o acoplamento do `AuthService` com o Firebase.

✔ Centraliza a configuração das instâncias Firebase.

✔ Facilita alterações futuras na configuração da infraestrutura.

✔ Mantém os serviços consumidores focados em suas responsabilidades.

✔ Permite reutilização das instâncias através de Dependency Injection.

✔ Facilita uma eventual substituição da tecnologia de infraestrutura.

#### Negativas

✖ A configuração fica distribuída entre mais componentes da arquitetura.

✖ Exige compreensão do mecanismo de Dependency Injection.

✖ Alterações na configuração do Firebase exigem conhecimento da camada de infraestrutura.

### Data

19/08/2026
