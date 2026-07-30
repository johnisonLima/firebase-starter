# Decisão 005

### Título

Utilizar o sistema de Injeção de Dependências do Angular para registrar dependências externas.

### Contexto

O Angular possui um sistema próprio de Injeção de Dependências (Dependency Injection - DI), responsável por fornecer objetos para toda a aplicação por meio de Providers.

Durante o desenvolvimento da integração com o Firebase, foi avaliado que utilizar imports globais ou implementar manualmente o padrão Singleton aumentaria o acoplamento da aplicação e dificultaria testes, manutenção e evolução da arquitetura.

Além disso, o Angular oferece mecanismos próprios para gerenciar o ciclo de vida das dependências, tornando desnecessária a implementação manual de padrões como Singleton para esse tipo de cenário.

### Alternativas consideradas

* Utilizar imports globais para compartilhar instâncias.
* Implementar manualmente o padrão Singleton.
* Registrar as dependências utilizando Providers e o sistema de Injeção de Dependências do Angular.

### Decisão

Toda dependência externa que possua responsabilidade global na aplicação será registrada no sistema de Injeção de Dependências do Angular por meio de Providers.

Quando a dependência não for representada por uma classe Angular, serão utilizados `InjectionToken` e Providers apropriados (`useFactory`, `useValue`, `useExisting` ou `useClass`), conforme a necessidade.

Essa estratégia será adotada para o Firebase e servirá como padrão para futuras integrações da aplicação.

### Consequências

#### Positivas

✔ Menor acoplamento entre componentes e infraestrutura.

✔ Centralização da criação e gerenciamento das dependências.

✔ Melhor aderência às boas práticas do Angular moderno.

✔ Facilita testes unitários e substituição por objetos simulados (mocks).

✔ Evita implementações manuais desnecessárias do padrão Singleton.

✔ Arquitetura preparada para crescimento e novas integrações.

#### Negativas

✖ Exige compreensão do sistema de Injeção de Dependências do Angular.

✖ Introduz uma pequena complexidade inicial para projetos simples.

### Data

22/07/2026