# Decisão 015

### Título

Ciclo de Vida do Loading sob Responsabilidade do Consumidor

### Contexto

O indicador de loading é utilizado para comunicar visualmente que uma operação está em andamento. Entretanto, o componente responsável por exibir esse estado não possui conhecimento suficiente para determinar quando a operação que o originou foi concluída.

A tentativa de fazer com que o próprio indicador de loading determine o término da operação criaria acoplamento entre a apresentação do estado visual e a lógica responsável pela execução da operação.

Em operações assíncronas, especialmente com RxJS, a operação pode terminar por sucesso, erro ou cancelamento. Portanto, o controle do ciclo de vida do loading deve permanecer com o consumidor que iniciou a operação, que possui conhecimento sobre seu fluxo de execução.

### Alternativas consideradas

**1. O indicador de loading determinar automaticamente o término da operação**

O próprio componente ou serviço de loading tentaria identificar quando a operação terminou.

**Vantagens**

* Menor responsabilidade aparente para o consumidor.
* Possibilidade de simplificar alguns usos superficiais.

**Desvantagens**

* Acoplamento entre loading e operação.
* O indicador não possui conhecimento sobre o ciclo de vida da operação.
* Dificuldade para tratar corretamente sucesso, erro e cancelamento.
* Comportamento imprevisível em operações concorrentes.

---

**2. O consumidor controlar explicitamente o ciclo de vida (Escolhido)**

O consumidor que inicia a operação é responsável por iniciar e finalizar o loading, utilizando `stop()` quando a operação terminar.

Em operações RxJS, o encerramento deverá ser preferencialmente realizado através de `finalize()`, garantindo a execução do `stop()` independentemente de a operação terminar com sucesso, erro ou cancelamento.

### Decisão

O **indicador de loading não determina quando a operação termina**.

O consumidor que iniciou a operação é responsável por controlar seu ciclo de vida, utilizando `stop()` para finalizar o estado de loading.

Em operações RxJS, o uso de `finalize()` é a abordagem preferencial para garantir que o `stop()` seja executado ao término do fluxo, independentemente do resultado da operação.

O `LoadingService` permanece responsável apenas por manter e expor o estado global do loading, enquanto os componentes de apresentação, como `Loading`, `LoadingOverlay` e loading de botão, permanecem responsáveis exclusivamente pela representação visual desse estado.

Dessa forma, a responsabilidade pelo ciclo de vida da operação permanece no mesmo contexto que possui conhecimento sobre sua execução.

### Consequências

#### Positivas

✔ Separação clara entre estado visual e ciclo de vida da operação.

✔ Redução do acoplamento entre loading e lógica de negócio.

✔ Tratamento consistente de sucesso, erro e cancelamento em operações RxJS.

✔ Uso de `finalize()` garante a execução do `stop()` ao término do fluxo.

✔ Facilita o tratamento de operações concorrentes através do estado global controlado pelo serviço.

✔ Componentes de apresentação permanecem simples e focados exclusivamente na interface.

#### Negativas

✖ O consumidor precisa controlar explicitamente o ciclo de vida do loading.

✖ Existe risco de esquecer o `stop()` caso a operação não utilize uma estratégia adequada de finalização.

✖ O uso incorreto do loading pode causar estados visuais inconsistentes.

### Data

28/07/2026
