# 07 — Responsividade

O Firebase Starter utiliza os breakpoints padrão do Tailwind CSS
e adota uma abordagem mobile-first.

## 07.1 — Breakpoints

| Breakpoint | Largura mínima |
|---|---:|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |
| `2xl` | `1536px` |

Os breakpoints não representam categorias rígidas de dispositivos.
Eles devem ser utilizados conforme a necessidade de cada componente
e de acordo com o espaço disponível na interface.

## 07.2 — Mobile-first

Os componentes devem possuir inicialmente uma implementação
adequada para telas menores e utilizar os breakpoints para adicionar
ou adaptar comportamentos em telas maiores.

```html
<div class="w-full md:w-1/2 lg:w-1/3">