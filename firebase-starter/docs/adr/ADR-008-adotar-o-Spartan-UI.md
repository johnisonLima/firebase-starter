# ADR 008 – Adotar o Spartan UI como biblioteca de componentes

## Contexto

Durante a definição da camada de interface da aplicação, foi necessário escolher uma biblioteca de componentes para acelerar o desenvolvimento e manter consistência visual.

Foram avaliadas as principais alternativas do ecossistema Angular considerando compatibilidade com Angular 21, suporte a Standalone Components, alinhamento com Signals, facilidade de customização, manutenção a longo prazo e aderência às práticas modernas do framework.

## Alternativas consideradas

### Alternativa 1 – Angular Material

Biblioteca oficial do Angular.

**Vantagens**

* Excelente integração com o Angular.
* Documentação completa.
* Grande comunidade.
* Alta estabilidade.

**Desvantagens**

* Forte dependência do Material Design.
* Personalização mais trabalhosa.
* Componentes com aparência bastante característica.

---

### Alternativa 2 – PrimeNG

Biblioteca bastante utilizada em aplicações corporativas.

**Vantagens**

* Grande quantidade de componentes.
* Excelente conjunto para sistemas administrativos.
* Boa documentação.

**Desvantagens**

* Componentes mais complexos.
* Customização visual pode exigir maior esforço.
* Algumas funcionalidades avançadas pertencem à versão comercial.

---

### Alternativa 3 – Taiga UI

Biblioteca moderna focada em experiência do usuário.

**Vantagens**

* Interface elegante.
* Boa integração com Angular.

**Desvantagens**

* Comunidade menor.
* Menor quantidade de exemplos e componentes.

---

### Alternativa 4 – Spartan UI

Biblioteca moderna inspirada na filosofia do shadcn/ui.

**Vantagens**

* Totalmente compatível com Angular moderno.
* Excelente integração com Standalone Components.
* Componentes altamente customizáveis.
* Arquitetura baseada em composição.
* Menor acoplamento visual.
* Incentiva maior controle sobre os componentes utilizados.

**Desvantagens**

* Ecossistema menor que Angular Material e PrimeNG.
* Curva de aprendizado um pouco maior para iniciantes.

## Decisão

Foi adotado o **Spartan UI** como biblioteca oficial de componentes do projeto.

A escolha foi motivada pelo alinhamento com a arquitetura definida para a aplicação, baseada em Angular 21, Standalone Components, Dependency Injection moderna (`inject()`), Signals e foco em componentes altamente reutilizáveis e personalizáveis.

Essa decisão também favorece o caráter didático do projeto, permitindo compreender melhor o funcionamento dos componentes utilizados e reduzindo o acoplamento a uma identidade visual específica.

## Consequências

### Positivas

* Interface moderna e altamente customizável.
* Excelente integração com Angular 21.
* Componentes baseados em composição.
* Menor dependência de estilos pré-definidos.
* Maior controle sobre a evolução da interface.
* Arquitetura alinhada às práticas modernas do ecossistema Angular.

### Negativas

* Comunidade menor quando comparada ao Angular Material e PrimeNG.
* Menor quantidade de exemplos disponíveis.
* Alguns componentes podem exigir maior conhecimento da biblioteca durante a customização.

## Data

23/07/2026