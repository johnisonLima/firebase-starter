# 08 — Estados

Os componentes do Firebase Starter utilizam estados visuais
consistentes para representar interação, disponibilidade,
processamento e resultado de ações.

## 08.1 — Estados principais

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Error
- Success
- Warning

## 08.2 — Interação

### Hover

Indica que o cursor está sobre um elemento interativo.

O estado deve produzir uma alteração visual sutil, sem modificar
a dimensão ou a estrutura do componente.

### Focus

Indica que o elemento está em foco.

O estado de foco deve possuir contraste suficiente para permitir
sua identificação durante a navegação por teclado.

O token `--ring` é utilizado como referência para o indicador
visual de foco.

Sempre que apropriado, deve ser utilizado `focus-visible` para
preservar uma experiência adequada de navegação por teclado.

### Active

Indica que uma ação está sendo pressionada ou ativada.

O efeito deve ser discreto e não deve provocar alterações que
modifiquem a dimensão do componente.

## 08.3 — Disponibilidade

### Disabled

Representa um componente que não está disponível para interação.

O estado deve reduzir o destaque visual e impedir a interação,
sem depender exclusivamente da cor para comunicar a condição.

### Loading

Representa uma operação em processamento.

Durante o loading, ações que possam provocar operações duplicadas
devem ser bloqueadas e o componente deve fornecer feedback visual
ao usuário.

## 08.4 — Estados semânticos

### Error

Representa uma falha ou condição inválida.

Utiliza a semântica `destructive` e deve ser acompanhado por
informação textual ou outro indicador quando necessário.

### Success

Representa uma operação concluída com sucesso.

O estado possui semântica própria e não deve ser confundido com
a cor `primary`.

### Warning

Representa uma situação que requer atenção, mas não caracteriza
necessariamente uma falha.

Utiliza o token `--warning`.

## 08.5 — Acessibilidade

Estados importantes não devem ser comunicados exclusivamente
por meio de cor.

Sempre que necessário, devem ser utilizados conjuntamente
texto, ícones, contraste e outros indicadores visuais.

## 08.6 — Princípio

Os estados devem comunicar claramente a condição do componente
sem alterar sua dimensão ou causar mudanças inesperadas na
interface.