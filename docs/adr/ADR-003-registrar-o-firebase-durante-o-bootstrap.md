## Decisão 003

### Título

Registrar o Firebase durante o bootstrap da aplicação.

### Contexto

O Firebase é um serviço global utilizado por múltiplas funcionalidades da aplicação, como autenticação, Firestore, Storage e Cloud Functions.

A inicialização do SDK possui baixo custo e não realiza autenticação nem carregamento de dados automaticamente.

### Alternativas consideradas

- Inicializar no AppComponent.
- Inicializar sob demanda no primeiro Service utilizado.
- Registrar durante o bootstrap da aplicação.

### Decisão

Registrar o Firebase durante o bootstrap utilizando Providers, garantindo que o SDK esteja disponível para toda a aplicação antes da criação dos componentes.

### Consequências

**Positivas**

✔ Inicialização única do SDK.

✔ Menor acoplamento entre componentes e infraestrutura.

✔ Facilidade para reutilização por Authentication, Firestore, Storage e outros serviços.

✔ Arquitetura preparada para crescimento.

**Negativas**

✖ Pequeno aumento no tempo de inicialização da aplicação.

✖ Necessidade de tratar eventuais falhas na inicialização.

### Data

22/07/2026