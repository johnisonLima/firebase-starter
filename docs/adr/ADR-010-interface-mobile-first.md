# ADR-010 — Interface mobile first

## Status

Substituída pela ADR-028 — Adoção dos breakpoints padrão do Tailwind CSS 4.

> Esta decisão foi substituída pela ADR-028 — Adoção dos breakpoints padrão do Tailwind CSS 4, em 09/11/2026.
>
> A ADR-028 passa a ser a referência vigente para a definição dos breakpoints do projeto.
>
> O conteúdo original permanece disponível para consulta histórica.

## Contexto

O software utilizará Angular, Tailwind CSS e Spartan UI para construção da interface.

O Tailwind CSS adota naturalmente a filosofia Mobile First, permitindo que os estilos base sejam aplicados para dispositivos móveis e complementados progressivamente para telas maiores.

Como o sistema será utilizado em computadores, tablets e smartphones, a interface deve oferecer uma boa experiência em qualquer dispositivo sem duplicação de layouts.

---

## Decisão

Toda a interface do sistema será desenvolvida utilizando a abordagem Mobile First.

Os componentes deverão ser construídos inicialmente considerando smartphones como dispositivo principal.

Layouts para telas maiores deverão ser adicionados apenas quando necessário através dos breakpoints do Tailwind.

Para manter consistência e simplicidade, o projeto utilizará apenas três breakpoints.

| Breakpoint | Largura mínima | Destino |
|------------|---------------:|---------|
| sm | 640px | Tablets pequenos |
| md | 768px | Tablets e notebooks |
| lg | 1024px | Desktop |

Breakpoints maiores (`xl` e `2xl`) não serão utilizados neste projeto.

---

## Diretrizes

Os componentes devem possuir um layout funcional sem utilização de qualquer breakpoint.

Os breakpoints serão utilizados apenas para melhorar a experiência em telas maiores.

Sempre que possível deverão ser utilizadas unidades flexíveis, evitando larguras fixas.

Os layouts deverão priorizar Flexbox e Grid do CSS utilizando as classes utilitárias do Tailwind.

---

## Consequências

### Positivas

- Interface consistente entre dispositivos.
- Menor quantidade de CSS.
- Código mais simples.
- Desenvolvimento incremental.
- Melhor experiência em dispositivos móveis.
- Melhor aderência à filosofia do Tailwind.

### Negativas

- Alguns layouts desktop exigirão pequenas adaptações.
- É necessário pensar primeiro na experiência móvel antes da desktop.

---

## Alternativas consideradas

### Desktop First

Rejeitada por exigir maior quantidade de sobrescritas para dispositivos móveis.

### Utilização de todos os breakpoints do Tailwind

Rejeitada por aumentar desnecessariamente a complexidade do projeto.


## Data

Criação: 28/07/2026

Atualização: 09/11/2026