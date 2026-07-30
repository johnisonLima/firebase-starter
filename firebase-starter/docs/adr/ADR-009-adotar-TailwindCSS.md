
# ADR 009 – Adotar Tailwind CSS como estratégia oficial de estilização

## Contexto

Durante a definição da camada de apresentação da aplicação, foi necessário escolher uma estratégia de estilização que atendesse aos requisitos de produtividade, customização, manutenção e compatibilidade com o ecossistema moderno do Angular.

Como o projeto adotará o Spartan UI como biblioteca de componentes, a escolha da solução de estilização deve estar alinhada à filosofia da biblioteca e às práticas recomendadas pela comunidade.

## Alternativas consideradas

### Alternativa 1 – CSS tradicional

**Vantagens**

* Simplicidade.
* Sem dependências adicionais.
* Amplamente conhecido.

**Desvantagens**

* Reutilização limitada.
* Maior quantidade de código.
* Manutenção mais trabalhosa em projetos de médio e grande porte.

---

### Alternativa 2 – SCSS

**Vantagens**

* Recursos avançados como variáveis, mixins e funções.
* Melhor organização dos estilos.
* Bastante difundido na comunidade Angular.

**Desvantagens**

* Pode gerar estruturas de estilos complexas.
* Incentiva a escrita de grandes arquivos de estilos.
* Menor integração com a filosofia do Spartan UI.

---

### Alternativa 3 – Tailwind CSS

**Vantagens**

* Excelente integração com o Spartan UI.
* Desenvolvimento rápido utilizando classes utilitárias.
* Alto nível de customização.
* Estilos consistentes e reutilizáveis.
* Redução significativa da necessidade de CSS personalizado.
* Ampla adoção na comunidade e evolução constante.

**Desvantagens**

* Curva de aprendizado inicial.
* Maior quantidade de classes diretamente no HTML.
* Dependência de uma etapa adicional de processamento durante a compilação.

## Decisão

Foi adotado o **Tailwind CSS** como estratégia oficial de estilização do projeto.

A escolha foi motivada pelo excelente alinhamento com o Spartan UI, pela facilidade de criação de interfaces modernas, pela redução da necessidade de arquivos CSS personalizados e pela ampla adoção da abordagem utilitária no desenvolvimento de aplicações Angular contemporâneas.

## Consequências

### Positivas

* Maior produtividade no desenvolvimento da interface.
* Facilidade de customização dos componentes.
* Redução da quantidade de CSS manual.
* Padronização dos estilos em toda a aplicação.
* Excelente integração com o Spartan UI.
* Arquitetura de interface moderna e escalável.

### Negativas

* Necessidade de aprendizado da sintaxe utilitária do Tailwind CSS.
* Código HTML pode conter maior quantidade de classes.
* Dependência de ferramentas adicionais para processamento dos estilos.

## Data

23/07/2026