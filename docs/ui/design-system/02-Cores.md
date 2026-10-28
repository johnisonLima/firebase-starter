# 02 — Cores e Temas

O sistema de cores do Firebase Starter é organizado por função e
significado, separando as cores de identidade visual das cores
semânticas e das cores neutras utilizadas na construção da interface.

O Firebase Starter utiliza os tokens semânticos fornecidos pela base Tailwind/Spartan como fundação do sistema visual. Esses tokens são personalizados de acordo com a identidade do projeto e possuem valores específicos para os temas Light e Dark.

## 02.1 — Brand Colors

### Primary

`#476B8C`

Cor principal de interação da aplicação.

Utilizada em:

- botões de ação primária;
- links;
- elementos interativos;
- destaques de navegação.

A cor transmite confiança e destaque sem produzir uma sensação
excessivamente agressiva.

### Dark

`#16233A`

Cor estrutural da identidade visual.

Utilizada principalmente em:

- áreas institucionais;
- navegação;
- cabeçalhos;
- fundos de destaque;
- elementos estruturais da interface.

## 02.2 — Semantic Colors

### Warning

`#FFAB00`

Representa situações que exigem atenção, mas que não indicam
necessariamente uma condição de erro ou perigo imediato.

### Danger

`#F4511E`

Reservada para situações críticas e ações destrutivas.

Sua utilização deve ser restrita a situações em que o significado
de perigo ou destruição seja realmente necessário.

## 02.3 — Neutral Colors

As cores neutras são responsáveis pela estrutura visual da
interface, incluindo superfícies, fundos, textos e bordas.

Os valores são diferentes entre os temas Light e Dark para preservar
contraste e legibilidade.

### Light

- Background: `#F7F8FA`
- Surface: `#FFFFFF`
- Surface Secondary: `#F1F3F5`
- Border: `#E1E5EA`
- Text Primary: `#16233A`
- Text Secondary: `#667085`
- Text Disabled: `#98A2B3`

### Dark

- Background: `#0F1726`
- Surface: `#16233A`
- Surface Secondary: `#1E2C42`
- Border: `#34445C`
- Text Primary: `#F8FAFC`
- Text Secondary: `#B7C1CF`
- Text Disabled: `#6F7D91`

## 02.4 — Temas

O tema Light é o tema padrão da aplicação.

O tema Dark utiliza a mesma identidade visual e as mesmas cores
semânticas, alterando principalmente as cores neutras para adequar
a interface ao fundo escuro.

Os componentes não devem definir diretamente valores de cor.
Devem utilizar os tokens disponibilizados pelo tema.

Exemplo:

```scss
color: var(--color-text-primary);
background: var(--color-surface);
border-color: var(--color-border);