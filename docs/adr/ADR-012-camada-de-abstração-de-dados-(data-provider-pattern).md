# Decisão 012

### Título

Camada de Abstração de Dados (Data Provider Pattern)

### Contexto

O Firebase Starter utiliza o Cloud Firestore para persistência de dados. O acesso direto ao SDK em componentes e consumidores da aplicação acoplaria essas partes à tecnologia de armazenamento, dificultando testes e futuras mudanças na implementação.

O projeto precisa de um contrato comum para operações de dados, mantendo as operações específicas do Firestore encapsuladas e permitindo que os consumidores utilizem os repositórios sem acessar diretamente o SDK.

### Alternativas consideradas

**1. Acesso direto ao Firestore**

Cada componente ou consumidor realizaria as operações de persistência diretamente com o Firebase SDK.

**Vantagens**
- Implementação inicial direta.
- Menos abstrações e código de configuração.

**Desvantagens**
- Acopla os consumidores ao Firestore.
- Pode duplicar consultas e mapeamentos entre funcionalidades.
- Dificulta substituir a implementação e isolar consumidores em testes.

---

**2. Repositórios com acesso direto ao SDK**

Cada repositório de domínio encapsularia as operações realizadas diretamente com o Firestore.

**Vantagens**
- Oferece aos consumidores uma interface do domínio.
- Mantém as operações de persistência fora dos componentes consumidores.

**Desvantagens**
- Cada repositório permanece acoplado ao SDK do Firestore.
- Operações genéricas e integração específica com o Firestore ficam concentradas nos repositórios.

---

**3. Data Provider Pattern (Escolhido)**

Definir o contrato `DataProvider<T>` para operações de acesso a dados e implementar providers que encapsulam as operações da tecnologia utilizada. Os repositórios concretos compõem o provider adequado e expõem as operações aos consumidores por meio do repositório.

### Decisão

Será adotado o **Data Provider Pattern** como camada de abstração de acesso a dados do Firebase Starter.

A interface `DataProvider<T>` define o contrato das operações de acesso aos dados. `FirestoreDataProvider<T>` implementa esse contrato e encapsula as operações específicas do Firestore, incluindo consultas e operações de leitura e escrita. 

`BaseRepository<T>` recebe uma implementação de `DataProvider<T>` pelo construtor e delega a ela as operações de dados, sem selecionar ou instanciar o provider concreto. Cada repositório concreto, como `UserRepository`, instancia o provider apropriado, fornece a ele a configuração específica do domínio, como a coleção, e passa essa implementação ao construir o `BaseRepository<T>`.

O Angular Dependency Injection fornece ao repositório concreto as dependências necessárias, como a instância do Firestore. O Angular DI não seleciona a implementação de `DataProvider<T>`; essa escolha e sua composição são responsabilidade do repositório concreto.

Os consumidores utilizam os repositórios e não acessam diretamente o SDK de persistência. A interface do provider desacopla `BaseRepository<T>` da implementação concreta, enquanto a associação entre o domínio e o provider escolhido permanece no repositório correspondente.

Atualmente, `FirestoreDataProvider<T>` é a implementação de provider utilizada pelo projeto. SQL, REST, GraphQL e armazenamento local são apenas possibilidades futuras, não funcionalidades implementadas. Caso outra implementação seja necessária, sua adoção poderá exigir alterações na composição do repositório concreto, sem necessariamente alterar os consumidores que dependem do contrato do repositório.

### Consequências

#### Positivas

✔ Centraliza o contrato de operações de dados em `DataProvider<T>`.

✔ Encapsula as operações específicas do Firestore em `FirestoreDataProvider<T>`.

✔ Mantém `BaseRepository<T>` dependente de uma interface, sem acoplá-lo à implementação Firestore.

✔ Mantém o acesso ao SDK fora dos consumidores que utilizam os repositórios.

✔ Permite testar `BaseRepository<T>` com implementações substitutas de `DataProvider<T>`.

✔ Localiza a escolha do provider e a configuração do domínio, como a coleção, no repositório concreto.

#### Negativas

✖ Aumenta a quantidade de interfaces, classes e código de composição.

✖ Exige manter o contrato `DataProvider<T>` consistente com as necessidades dos repositórios.

✖ O repositório concreto conhece e instancia a implementação de provider escolhida para seu domínio.

✖ Substituir um provider pode exigir alterações na composição do repositório concreto.

✖ A abstração adiciona alguma sobrecarga para operações simples.

### Data

28/07/2026