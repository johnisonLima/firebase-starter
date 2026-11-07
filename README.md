# Firebase Starter

> Um projeto para o desenvolvimento de aplicações modernas com Angular e Firebase, utilizando uma arquitetura escalável, organizada e alinhada às práticas atuais do ecossistema Angular.

---

# Visão Geral

O **Firebase Starter** é um projeto de referência desenvolvido para a construção de aplicações modernas utilizando Angular e Firebase desde a configuração inicial até a implementação de funcionalidades completas.

O projeto busca mostrar como decisões arquiteturais influenciam a organização, manutenção e evolução de um sistema real.

Durante o desenvolvimento, cada etapa é construída de forma incremental, permitindo compreender tanto a implementação quanto as motivações técnicas por trás de cada decisão.

Toda a arquitetura do projeto é documentada através de ADRs (Architecture Decision Records), garantindo que as escolhas realizadas permaneçam registradas e possam ser revisitadas ao longo da evolução do sistema.

---

# Objetivos

O Firebase Starter possui quatro objetivos principais:

* Aprender Angular moderno através de um projeto real.
* Fazer a integração completa com o Firebase SDK.
* Apresentar uma arquitetura escalável baseada em Features.
* Servir como template inicial para novos projetos.

Ao final, o projeto deverá representar uma base sólida para aplicações Full Stack utilizando Angular e Firebase.

---

# Stack Tecnológica

A tabela apresenta as tecnologias e ferramentas cuja dependência, configuração ou utilização está confirmada no projeto atual.

| Tecnologia/Ferramenta | Finalidade |
| --------------------- | ---------- |
| Angular 21 | Framework Front-end |
| TypeScript | Linguagem principal |
| Firebase SDK | Integração com serviços Firebase |
| Firebase Authentication | Autenticação de usuários |
| Cloud Firestore | Banco de dados NoSQL |
| Tailwind CSS 4 | Estilização |
| Spartan UI | Biblioteca de componentes |
| Angular Signals | Gerenciamento reativo de estado |
| Standalone Components | Organização de componentes Angular |
| Angular Router | Navegação entre páginas |
| Prettier | Formatação automática, com configuração no repositório |
| Vitest | Testes unitários |
| Playwright | Testes E2E |
| GitHub Actions | Integração contínua pelo workflow do repositório |

Cloud Storage, ESLint e Firebase Hosting não fazem parte da configuração atual. Storage e Hosting permanecem no planejamento futuro; ESLint não é uma ferramenta adotada nem um compromisso futuro deste projeto.

---

# Princípios Arquiteturais

Todo o projeto segue um conjunto de princípios definidos desde o início do desenvolvimento.

* Feature-Based Architecture
* Standalone Components
* Mobile First
* Componentes reutilizáveis
* Separação clara de responsabilidades
* Baixo acoplamento
* Alta coesão
* Código legível e previsível
* Escalabilidade
* Simplicidade antes de complexidade

Esses princípios orientam todas as decisões arquiteturais registradas nas ADRs.

---

# Organização da Documentação

A documentação está organizada por responsabilidade. Estes são os caminhos existentes no repositório:

```text
docs/
├── Architecture-v1.0.md
├── project-status.md
├── adr/
│   ├── ADR-001-objetivo-do-projeto.md
│   ├── ADR-002-não-utilizar-enviroments.md
│   ├── ...
│   └── ADR-027-execucao-dos-testes-no-github-actions.md
├── ci/
│   └── secrets.md
├── testing/
│   └── e2e-strategy.md
├── sprints/
│   ├── sprints.md
│   ├── sprint-planning.md
│   └── backlog.md
└── ui/
    └── design-system/
        ├── 01-Iconografia.md
        ├── ...
        └── 09-Componentes.md
```

---

# Architecture Decision Records (ADRs)

As ADRs registram as decisões arquiteturais importantes do projeto.

Cada documento responde às seguintes perguntas:

* Qual era o problema?
* Qual decisão foi tomada?
* Por que essa decisão foi escolhida?
* Quais são as consequências dessa escolha?

Essa abordagem permite compreender a evolução da arquitetura ao longo do projeto.

---

# Roadmap

O histórico das Sprints 1 a 5 está registrado em [`docs/sprints/sprints.md`](docs/sprints/sprints.md). O planejamento das Sprints 6 a 10 está em [`docs/sprints/sprint-planning.md`](docs/sprints/sprint-planning.md). As funcionalidades futuras ainda sem Sprint definida estão em [`docs/sprints/backlog.md`](docs/sprints/backlog.md).

Esses documentos são as fontes de verdade sobre o histórico, o planejamento e o backlog do projeto. Nenhum item de planejamento ou backlog representa funcionalidade já implementada.

---

# Filosofia do Projeto

O Firebase Starter não busca apresentar apenas *como escrever código*, mas principalmente *como projetar software*.
