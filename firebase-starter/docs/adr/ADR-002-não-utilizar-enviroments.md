## Decisão 002

### Título

Não utilizar environments.

### Contexto

O Angular 21 não cria mais environments por padrão.

O projeto possui apenas um ambiente Firebase.

### Decisão

Criar um arquivo dedicado:

core/config/firebase.config.ts

### Consequências

✔ Menos complexidade

✔ Responsabilidade bem definida

✔ Fácil migração para environments futuramente

### Data

22/07/2026