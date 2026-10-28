# 09 — Princípios de Componentes

Os componentes do Firebase Starter devem ser construídos com foco
em reutilização, composição, responsabilidade única e integração
com os tokens definidos pelo Design System.

## 09.1 — Responsabilidade única

Cada componente deve possuir uma responsabilidade clara.

Um componente deve evitar concentrar regras de apresentação,
estado e lógica de negócio que pertencem a outras camadas.

A lógica de negócio deve permanecer nos serviços, casos de uso ou
outras abstrações apropriadas, enquanto os componentes devem
priorizar a apresentação e a interação com o usuário.

## 09.2 — Reutilização

Componentes compartilhados devem ser projetados para atender
diferentes contextos sem depender de uma implementação específica
da aplicação.

A reutilização não deve significar criar abstrações antecipadamente.
Um componente somente deve ser generalizado quando existir uma
necessidade real ou um padrão recorrente.

## 09.3 — Composição

Sempre que possível, componentes maiores devem ser construídos
por meio da composição de componentes menores.

Por exemplo, um componente de formulário pode utilizar componentes
de input, botão, mensagem de erro e loading sem assumir a
responsabilidade de implementar internamente todas essas funções.

## 09.4 — Configuração

A aparência e o comportamento de um componente devem ser
configuráveis por meio de suas APIs públicas.

A implementação interna não deve exigir conhecimento de detalhes
do componente.

Inputs, outputs e outras APIs devem representar somente as
configurações necessárias para o uso do componente.

## 09.5 — Design System

Os componentes devem consumir os tokens definidos pelo Design
System em vez de utilizar valores visuais arbitrários.

Exemplo:

```scss
background: var(--primary);
border-color: var(--border);
color: var(--foreground);