# Decisão 019

### Título

Adoção de Interceptors HTTP Funcionais

### Contexto

A aplicação utiliza interceptors para centralizar comportamentos relacionados às requisições HTTP, como o controle automático do Loading Global definido na ADR-018.

Como novos interceptors poderão ser adicionados conforme a infraestrutura evolui, é necessário estabelecer um padrão arquitetural para sua implementação.

O Angular disponibiliza diferentes abordagens para criação de interceptors HTTP, sendo necessário definir qual delas será adotada pelo projeto.

### Alternativas consideradas

**1. Interceptors baseados em classes**

Utilizar classes que implementam a interface `HttpInterceptor`.

**Vantagens**

* Abordagem tradicional e amplamente conhecida.
* Estrutura familiar para aplicações Angular mais antigas.

**Desvantagens**

* Maior quantidade de estrutura e código.
* Utiliza uma abordagem baseada em classes para comportamentos que podem ser representados funcionalmente.
* Não segue a abordagem funcional adotada pelas APIs mais recentes do Angular.

---

**2. Interceptors funcionais (Escolhido)**

Utilizar `HttpInterceptorFn` para implementar interceptors HTTP.

**Vantagens**

* Implementação mais simples e direta.
* Menor quantidade de boilerplate.
* Integração natural com o modelo funcional de configuração do Angular.
* Facilita a composição de comportamentos.
* Mantém os interceptors focados em sua função.

### Decisão

**Interceptors HTTP deverão ser implementados como funções utilizando `HttpInterceptorFn`.**

A abordagem baseada em classes (`HttpInterceptor`) não será utilizada para novos interceptors.

Essa decisão estabelece um **padrão arquitetural para todos os novos interceptors HTTP** do projeto.

Sempre que um novo comportamento transversal precisar ser aplicado às requisições HTTP, sua implementação deverá utilizar a abordagem funcional, mantendo consistência com o padrão estabelecido.

### Consequências

#### Positivas

✔ Padronização da implementação dos interceptors.

✔ Menor quantidade de boilerplate.

✔ Código mais simples e direto.

✔ Alinhamento com a abordagem funcional disponibilizada pelo Angular.

✔ Facilita a composição e manutenção de comportamentos HTTP.

✔ Define uma regra clara para novos interceptors.

#### Negativas

✖ Interceptors existentes baseados em classes exigiriam migração caso o projeto possua algum legado desse tipo.

✖ Desenvolvedores familiarizados apenas com a abordagem baseada em classes precisarão se adaptar ao padrão funcional.

### Data

19/08/2026
