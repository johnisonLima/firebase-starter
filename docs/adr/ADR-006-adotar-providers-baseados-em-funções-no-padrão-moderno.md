# Decisão 006

### Título

Adotar Providers baseados em funções seguindo o padrão do Angular moderno.

### Contexto

Durante a integração do Firebase foi avaliada a forma de registrar Providers na aplicação.

Inicialmente foi considerada a exportação de um array de Providers (`firebaseProviders`) para posterior inclusão no `app.config.ts`.

Entretanto, observou-se que o Angular moderno adota como padrão funções iniciadas por `provide...`, como `provideRouter()`, `provideHttpClient()` e `provideZoneChangeDetection()`. Esse padrão torna a configuração da aplicação mais legível, modular e consistente.

### Alternativas consideradas

* Exportar um array de Providers (`firebaseProviders`).
* Registrar cada Provider individualmente no `app.config.ts`.
* Criar uma função `provideFirebase()` responsável por registrar toda a infraestrutura do Firebase.

### Decisão

Adotar funções do tipo `provide...` para registrar dependências globais da aplicação.

A integração do Firebase será realizada por meio da função `provideFirebase()`, responsável por encapsular toda a configuração necessária para disponibilizar o SDK através do sistema de Injeção de Dependências do Angular.

Novas integrações seguirão a mesma abordagem, mantendo a consistência da arquitetura.

### Consequências

#### Positivas

✔ Arquitetura alinhada às boas práticas do Angular moderno.

✔ Melhor legibilidade do `app.config.ts`.

✔ Encapsulamento da infraestrutura de cada domínio.

✔ Facilidade para evolução futura, permitindo adicionar Authentication, Firestore, Storage e outros serviços sem alterar a estrutura do `app.config.ts`.

✔ Padronização da configuração da aplicação utilizando funções `provide...`.

#### Negativas

✖ Introduz uma camada adicional de abstração em relação aos exemplos mais simples da documentação.

✖ Exige conhecimento sobre Providers e Injeção de Dependências para compreender sua implementação.

### Data

22/07/2026