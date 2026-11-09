# ADR-028 — Adoção dos breakpoints padrão do Tailwind CSS 4

### Título

Adoção dos breakpoints padrão do Tailwind CSS 4

### Status

Aceita.

### Contexto

O projeto utiliza Angular, Tailwind CSS 4 e Spartan UI para a construção da interface.

A ADR-010 — Interface mobile first estabeleceu originalmente a utilização de apenas três breakpoints: `sm`, `md` e `lg`, excluindo explicitamente `xl` e `2xl`.

O Tailwind CSS 4 disponibiliza cinco breakpoints padrão: `sm`, `md`, `lg`, `xl` e `2xl`. O projeto já carrega o tema padrão do Tailwind, sem configuração personalizada de breakpoints.

A restrição anterior a três breakpoints não eliminava tecnicamente os breakpoints padrão da ferramenta. Ela apenas criava uma limitação artificial ao uso de `xl` e `2xl`, sem benefício técnico evidente.

Além disso, a documentação apresentava divergência entre a ADR-010 e o Design System de Responsividade, que já listava os cinco breakpoints padrão do Tailwind.

### Alternativas consideradas

**1. Manter somente `sm`, `md` e `lg`**

**Vantagens**

- Mantém a decisão original da ADR-010.
- Reduz a quantidade de breakpoints disponíveis.

**Desvantagens**

- Mantém uma limitação artificial ao uso de `xl` e `2xl`.
- Divergência com o tema padrão do Tailwind CSS 4.
- Exige justificativa especial para usar breakpoints que já estão disponíveis.
- Perpetua a divergência documental com o Design System.

Alternativa rejeitada.

---

**2. Desabilitar `xl` e `2xl` por configuração personalizada**

**Vantagens**

- Torna explícita a restrição aos três breakpoints.
- Impede tecnicamente o uso de `xl` e `2xl`.

**Desvantagens**

- Cria configuração personalizada sem necessidade.
- Contraria o uso dos padrões da ferramenta.
- Aumenta a manutenção para preservar uma limitação sem benefício técnico.

Alternativa rejeitada.

---

**3. Criar breakpoints personalizados**

**Vantagens**

- Permite adaptar os limites a necessidades específicas.

**Desvantagens**

- Não há justificativa técnica que exija valores diferentes dos padrões.
- Reduz a consistência com o Tailwind CSS e com o Design System.
- Aumenta a complexidade de documentação e manutenção.

Alternativa rejeitada.

---

**4. Adotar os cinco breakpoints padrão do Tailwind CSS 4 (Escolhida)**

A decisão adota os cinco breakpoints padrão, mantém a abordagem mobile-first e estabelece uma convenção única para classes utilitárias e media queries em SCSS.

### Decisão

1. O projeto adota os cinco breakpoints padrão do Tailwind CSS 4: `sm`, `md`, `lg`, `xl` e `2xl`.
2. Não haverá limitação artificial da quantidade de breakpoints disponíveis.
3. A estratégia de desenvolvimento continuará sendo mobile-first.
4. Não serão criados breakpoints personalizados sem justificativa técnica.
5. Cada componente deverá utilizar somente os breakpoints necessários às suas necessidades.
6. Media queries em SCSS deverão respeitar os mesmos limites definidos pelo Tailwind, sempre que representarem adaptações responsivas gerais.
7. Exceções específicas de componentes poderão existir quando houver justificativa técnica, sem estabelecer novos breakpoints globais.

### Breakpoints oficiais

| Breakpoint | Valor padrão | Equivalência |
|---|---:|---:|
| `sm` | `40rem` | `640px` |
| `md` | `48rem` | `768px` |
| `lg` | `64rem` | `1024px` |
| `xl` | `80rem` | `1280px` |
| `2xl` | `96rem` | `1536px` |

Os valores em pixels consideram uma raiz de `16px`.

### Convenção para media queries em SCSS

- Preferir `min-width` para seguir a abordagem mobile-first.
- Utilizar os mesmos limites dos breakpoints padrão do Tailwind.
- Quando houver necessidade de `max-width`, evitar sobreposição entre intervalos.
- Permitir exceções locais justificadas.
- Não transformar exceções locais em novos breakpoints globais.
- Media queries de acessibilidade, como `prefers-reduced-motion`, não são breakpoints e não precisam seguir essa escala.

```scss
@media (min-width: 48rem) {
  // md
}
```

Para ajustes abaixo de `sm`:

```scss
@media (width < 40rem) {
  // Ajustes específicos para telas menores que sm
}
```

### Relação com a ADR-010

- A ADR-028 substitui a decisão da ADR-010 referente à restrição de utilização de apenas três breakpoints.
- Os demais princípios da ADR-010 permanecem válidos, especialmente mobile-first, unidades flexíveis, Flexbox e Grid.
- A ADR-010 será preservada como registro histórico.
- A ADR-010 passa a ter o status de substituída pela ADR-028.
- A ADR-028 passa a ser a referência arquitetural vigente para os breakpoints.

### Consequências

#### Positivas

✔ Alinhamento com os breakpoints padrão do Tailwind CSS 4.

✔ Eliminação de restrições artificiais ao uso de breakpoints.

✔ Maior flexibilidade para layouts em telas maiores.

✔ Ausência de configurações adicionais de breakpoints.

✔ Padronização das media queries em SCSS.

✔ Consistência entre ADR, Design System e implementação.

#### Negativas

✖ A maior quantidade de opções exige disciplina para não utilizar todos os breakpoints indiscriminadamente.

✖ Componentes podem necessitar de ajustes responsivos futuros.

✖ Exceções locais precisam ser justificadas e documentadas.

A adoção dos cinco breakpoints não exige refatoração imediata dos componentes existentes.

### ADRs relacionadas

- ADR-009 — Adotar Tailwind CSS como estratégia oficial de estilização
- ADR-010 — Interface mobile first (substituída pela ADR-028)

### Data

Criação: 09/11/2026
