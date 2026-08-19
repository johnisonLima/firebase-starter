# Decisão 018

### Título

Controle Automático do Loading Global por Interceptor HTTP

### Contexto

As requisições HTTP representam uma das principais fontes de operações assíncronas da aplicação e, por isso, precisam participar do ciclo de vida do Loading Global.

Realizar o controle manualmente em cada serviço ou componente aumentaria a repetição de código e criaria o risco de operações esquecerem de iniciar ou finalizar corretamente o loading.

Além disso, a aplicação já estabelece que o ciclo de vida do loading deve ser encerrado de forma confiável, preferencialmente utilizando `finalize()` em operações RxJS.

Dessa forma, tornou-se necessário centralizar o comportamento das requisições HTTP em um ponto comum da infraestrutura.

### Alternativas consideradas

**1. Controle manual do Loading em cada requisição**

Cada serviço ou consumidor chamaria `start()` antes da requisição e `stop()` após sua conclusão.

**Vantagens**

* Implementação simples e explícita.
* O consumidor possui controle direto sobre o loading.

**Desvantagens**

* Repetição de código.
* Maior possibilidade de esquecer `stop()`.
* Dificuldade para garantir comportamento uniforme.
* Aumenta a responsabilidade dos serviços consumidores.

---

**2. Controle automático através de Interceptor HTTP (Escolhido)**

O interceptor intercepta as requisições HTTP e controla automaticamente o ciclo de vida do Loading Global.

### Decisão

As requisições HTTP deverão controlar automaticamente o **Loading Global** através de um **HTTP Interceptor**.

O ciclo de vida seguirá o fluxo:

```text
HTTP
 ↓
start()
 ↓
request
 ↓
finalize()
 ↓
stop()
```

O interceptor será responsável por iniciar o loading antes da execução da requisição e registrar o `stop()` através de `finalize()`, garantindo que o Loading seja encerrado quando o fluxo HTTP terminar, independentemente de sucesso ou erro.

O comportamento automático poderá ser explicitamente ignorado através do `SKIP_LOADING`, implementado como um `HttpContextToken`.

Exemplo conceitual:

```text
Requisição HTTP
      │
      ├── SKIP_LOADING = true
      │       ↓
      │   sem Loading Global
      │
      └── padrão
              ↓
          start()
              ↓
           request
              ↓
          finalize()
              ↓
           stop()
```

Essa exceção permite que determinadas requisições não provoquem o bloqueio global da interface quando esse comportamento não for desejado.

A decisão mantém o interceptor como parte da infraestrutura responsável pela integração entre HTTP e o mecanismo global de Loading, enquanto as regras definidas nas ADRs anteriores continuam válidas para o ciclo de vida e concorrência do Loading.

### Consequências

#### Positivas

✔ Elimina a necessidade de controlar manualmente o Loading em cada requisição HTTP.

✔ Reduz duplicação de código.

✔ Garante um comportamento consistente entre as requisições.

✔ O uso de `finalize()` reduz o risco de Loading permanecer ativo após erro ou conclusão da requisição.

✔ Integra naturalmente com o contador de operações concorrentes definido na ADR-016.

✔ Permite exceções através do `SKIP_LOADING`.

✔ Mantém a responsabilidade de integração HTTP/Loading concentrada na infraestrutura.

#### Negativas

✖ Introduz comportamento automático que pode não ser imediatamente evidente para quem utiliza o HTTP.

✖ Requisições que não devem utilizar o Loading precisam declarar explicitamente `SKIP_LOADING`.

✖ O interceptor passa a possuir responsabilidade adicional dentro da infraestrutura HTTP.

### Data

19/08/2026
