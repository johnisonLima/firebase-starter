# 07 — Responsividade

O Firebase Starter adota os cinco breakpoints padrão do
Tailwind CSS 4 e mantém uma abordagem mobile-first, conforme
estabelecido pela ADR-028.

## 07.1 — Breakpoints oficiais

| Breakpoint | Valor em rem | Equivalência em px |
|---|---:|---:|
| `sm` | `40rem` | `640px` |
| `md` | `48rem` | `768px` |
| `lg` | `64rem` | `1024px` |
| `xl` | `80rem` | `1280px` |
| `2xl` | `96rem` | `1536px` |

Os valores em pixels consideram uma raiz de `16px`.

Os breakpoints não representam categorias rígidas de
dispositivos. Eles devem ser utilizados conforme a necessidade
de cada componente e de acordo com o espaço disponível na
interface.

## 07.2 — Mobile-first

Os componentes devem possuir inicialmente uma implementação
adequada para telas menores. Os prefixos responsivos do Tailwind
aplicam adaptações a partir das larguras definidas, sem exigir
uma implementação específica para cada dispositivo.

Não é necessário utilizar todos os breakpoints em todos os
componentes. Cada componente deve utilizar somente os
breakpoints necessários ao seu layout.

## 07.3 — Utilização dos prefixos responsivos

Os prefixos `sm:`, `md:`, `lg:`, `xl:` e `2xl:` aplicam as
classes utilitárias a partir do breakpoint correspondente.

```html
<div
  class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
>
  <div class="rounded border p-4">...</div>
</div>
```

Um componente pode utilizar apenas os breakpoints relevantes
para o seu comportamento:

```html
<div class="w-full md:w-1/2 lg:w-1/3">
  ...
</div>
```

## 07.4 — Media queries em SCSS

Quando houver necessidade de escrever uma media query
diretamente em SCSS, a convenção aprovada pela ADR-028 é
utilizar os mesmos limites dos breakpoints padrão do Tailwind.

Para seguir a abordagem mobile-first, prefira `min-width`:

```scss
@media (min-width: 40rem) {
  // sm
}

@media (min-width: 48rem) {
  // md
}

@media (min-width: 64rem) {
  // lg
}
```

Quando for necessário aplicar estilos abaixo de um breakpoint,
evite sobreposição entre intervalos. Uma alternativa é utilizar
a sintaxe de intervalo:

```scss
@media (width < 40rem) {
  // Ajustes específicos para telas menores que sm
}
```

Se a sintaxe de intervalo não for adotada, utilize um valor
imediatamente abaixo do breakpoint:

```scss
@media (max-width: 39.998rem) {
  // Ajustes específicos para telas menores que sm
}
```

Media queries de acessibilidade, como `prefers-reduced-motion`,
não são breakpoints e não precisam seguir essa escala.

## 07.5 — Exceções locais

Exceções específicas de componentes podem existir quando
houver justificativa técnica, sem estabelecer novos breakpoints
globais. O componente deve documentar o motivo do ajuste local.

Atualmente existem ajustes locais em:

| Arquivo | Largura | Finalidade |
|---|---:|---|
| `playground.scss` | `640px` | Ajustes de layout do Playground em telas menores. |
| `dialog.scss` | `480px` | Redução de paddings do dialog em telas estreitas. |
| `loading-overlay.scss` | `360px` | Ajustes do overlay de carregamento em telas muito estreitas. |

O valor de `640px` corresponde ao limite de `sm`, mas é
utilizado em uma media query própria do componente. Os valores
de `480px` e `360px` não são breakpoints oficiais do Tailwind e
permanecem como exceções locais justificadas.

Essas media queries não devem ser tratadas como novos
breakpoints globais. Uma eventual refatoração deve ser
avaliada separadamente da definição dos breakpoints do projeto.

## 07.6 — Boas práticas

- Priorizar a abordagem mobile-first.
- Utilizar os breakpoints conforme a necessidade do layout.
- Evitar a utilização indiscriminada de todos os prefixos.
- Não criar breakpoints personalizados sem justificativa técnica.
- Preferir classes utilitárias do Tailwind quando forem suficientes.
- Manter exceções locais justificadas e documentadas.
- Não utilizar media queries de acessibilidade como breakpoints.

## 07.7 — Referência

- ADR-028 — Adoção dos breakpoints padrão do Tailwind CSS 4.
- ADR-010 — Interface mobile first (substituída pela ADR-028).
