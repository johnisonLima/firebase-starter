# 06 — Sombras

O Firebase Starter utiliza sombras de forma discreta, priorizando
a hierarquia visual e a separação entre superfícies em vez de
efeitos decorativos.

A escala de sombras fornecida pelo Tailwind CSS é utilizada como
referência padrão.

## 06.1 — Escala

| Nível | Uso |
|---|---|
| `shadow-sm` | elevação muito sutil |
| `shadow-md` | componentes moderadamente elevados |
| `shadow-lg` | elementos sobrepostos ou de maior elevação |

## 06.2 — Diretrizes

Cards e elementos estruturais não devem utilizar sombras
automaticamente.

A sombra deve ser aplicada somente quando houver uma necessidade
visual de indicar elevação ou separar uma superfície de outra.

`shadow-sm` deve ser priorizado para elementos que precisam de
pequena elevação.

`shadow-md` pode ser utilizado em elementos flutuantes, como
dropdowns e popovers.

`shadow-lg` deve ser reservado principalmente para dialogs, modais
e elementos que se sobrepõem claramente ao conteúdo.

No tema Dark, bordas e contraste entre superfícies devem ser
considerados em conjunto com as sombras, pois sombras escuras
possuem menor eficácia sobre fundos escuros.

## 06.3 — Princípio

O Firebase Starter não utiliza sombras como elemento decorativo
padrão. A elevação visual deve ser utilizada de maneira intencional
e discreta.