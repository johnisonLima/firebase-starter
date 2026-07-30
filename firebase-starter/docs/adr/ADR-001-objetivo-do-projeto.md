# ADR-001 — Objetivo do Projeto Firebase Starter

**Status:** Aceita

**Data:** 28/07/2026

---

# Contexto

Ao iniciar um projeto Angular moderno é comum que os desenvolvedores encontrem uma grande quantidade de decisões arquiteturais antes mesmo de escrever a primeira funcionalidade.

Entre elas:

- organização de pastas;
- gerenciamento de estado;
- autenticação;
- comunicação com APIs;
- estrutura de componentes;
- padronização visual;
- responsividade;
- boas práticas;
- arquitetura escalável.

Grande parte dos cursos disponíveis ensina tecnologias isoladamente, porém poucos mostram como todas essas decisões trabalham juntas dentro de um projeto real.

Além disso, muitos exemplos utilizam arquiteturas antigas, módulos tradicionais do Angular, RxJS para todo o gerenciamento de estado ou estruturas que já não representam as recomendações atuais da plataforma.

Era necessário definir um projeto base que servisse tanto para aprendizado quanto para utilização como ponto de partida em aplicações reais.

---

# Decisão

Criar o **Firebase Starter**, um projeto educacional desenvolvido passo a passo que demonstra como construir aplicações modernas utilizando o ecossistema atual do Angular.

O projeto adota como tecnologias principais:

- Angular 21
- Firebase SDK
- Tailwind CSS
- Spartan UI
- Standalone Components
- Signals
- Arquitetura Feature-Based
- Mobile First

O objetivo não é apenas ensinar ferramentas individualmente, mas demonstrar como elas se integram em uma arquitetura organizada, escalável e preparada para projetos reais.

Cada decisão arquitetural relevante será registrada através de ADRs, permitindo compreender não apenas *como* determinada solução foi implementada, mas principalmente *por que* ela foi escolhida.

---

# Consequências

## Benefícios

- Projeto próximo da realidade encontrada no mercado.
- Código organizado desde o início.
- Facilidade para manutenção e evolução.
- Material adequado tanto para iniciantes quanto para desenvolvedores experientes.
- Base reutilizável em projetos futuros.
- Todas as decisões arquiteturais ficam documentadas.

## Trade-offs

- O projeto possui uma curva de aprendizado maior do que exemplos simplificados.
- Algumas decisões modernas exigem conhecimentos prévios sobre Angular.
- A evolução da plataforma poderá exigir revisões futuras das ADRs.

---

# Fora do Escopo

Este projeto não pretende:

- ensinar todos os serviços do Firebase;
- substituir a documentação oficial;
- apresentar todas as formas possíveis de desenvolver aplicações Angular;
- cobrir arquiteturas corporativas extremamente complexas.

O foco é construir uma base sólida, moderna e reutilizável para aplicações Full Stack utilizando Angular e Firebase.

---

# Motivação

O Firebase Starter foi criado para servir simultaneamente como:

- curso prático;
- projeto de referência;
- template inicial para novos projetos;
- material de consulta para decisões arquiteturais.

A proposta é que cada aula adicione uma funcionalidade real ao sistema enquanto preserva uma arquitetura consistente desde a primeira linha de código.