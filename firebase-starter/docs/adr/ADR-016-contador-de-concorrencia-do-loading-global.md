# Decisão 016

### Título

Controle de Concorrência do Loading Global por Contador

### Contexto

O Loading global pode ser utilizado simultaneamente por diferentes operações assíncronas. Essas operações podem iniciar e finalizar em momentos distintos, sendo necessário garantir que o término de uma operação não encerre indevidamente o indicador enquanto outras operações ainda estiverem em andamento.

Uma implementação baseada apenas em um estado booleano (`true`/`false`) não é suficiente para representar corretamente operações concorrentes.

Por exemplo:

```text
HTTP A ── start()
HTTP B ── start()

HTTP A ── stop()

HTTP B ── stop()
```

Se o Loading fosse controlado apenas por um booleano, o `stop()` da operação A poderia desativar o indicador enquanto a operação B ainda estivesse em execução.

### Alternativas consideradas

**1. Controle por estado booleano**

O Loading possuiria apenas um estado indicando se está ativo ou inativo.

**Vantagens**

* Implementação simples.
* Baixa complexidade inicial.

**Desvantagens**

* Não representa corretamente operações concorrentes.
* Uma operação pode finalizar o loading de outra.
* Pode produzir inconsistências visuais durante múltiplas requisições simultâneas.

---

**2. Controle por contador de operações (Escolhido)**

O Loading mantém a quantidade de operações atualmente em andamento.

Cada `start()` incrementa o contador e cada `stop()` decrementa.

O loading permanece ativo enquanto o contador for maior que zero.

### Decisão

O **Loading global utilizará um contador de operações concorrentes**.

A cada chamada de `start()`, o contador será incrementado:

```text
start() → contador + 1
```

A cada chamada de `stop()`, o contador será decrementado:

```text
stop() → contador - 1
```

O estado global de loading será considerado ativo enquanto existir pelo menos uma operação em andamento:

```text
contador > 0 → loading ativo
contador = 0 → loading inativo
```

Dessa forma, operações concorrentes possuem ciclos de vida independentes. Uma operação somente deixa de contribuir para o estado global quando executar seu próprio `stop()`, não podendo finalizar o loading iniciado por outra operação.

Exemplo:

```text
HTTP A ── start()  → contador = 1
HTTP B ── start()  → contador = 2

HTTP A ── stop()   → contador = 1
                    → loading continua ativo

HTTP B ── stop()   → contador = 0
                    → loading é desativado
```

O contador representa, portanto, o número de operações que ainda possuem loading ativo.

### Consequências

#### Positivas

✔ Operações concorrentes são tratadas de forma independente.

✔ Uma operação não pode finalizar o loading enquanto outra ainda estiver em execução.

✔ O estado global representa corretamente a existência de operações pendentes.

✔ Permite múltiplos consumidores utilizando o Loading simultaneamente.

✔ Mantém o `LoadingService` responsável pelo estado global, sem necessidade de conhecer as operações individualmente.

✔ Combina naturalmente com a responsabilidade do consumidor definida na ADR-015.

#### Negativas

✖ A implementação possui maior complexidade do que um simples estado booleano.

✖ Chamadas desbalanceadas de `start()` e `stop()` podem deixar o contador inconsistente.

✖ É necessário garantir que cada operação finalize corretamente seu ciclo de loading.

### Data

19/08/2026
