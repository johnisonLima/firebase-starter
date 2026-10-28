# Firebase Starter

> Um projeto para o desenvolvimento de aplicações modernas com Angular e Firebase, utilizando uma arquitetura escalável, organizada e alinhada às práticas atuais do ecossistema Angular.

---

# Visão Geral

O **Firebase Starter** é um projeto de referência desenvolvido para a construção de aplicações modernas utilizando Angular e Firebase desde a configuração inicial até a implementação de funcionalidades completas.

O projeto busca mostrar como decisões arquiteturais influenciam a organização, manutenção e evolução de um sistema real.

Durante o desenvolvimento, cada etapa será construída de forma incremental, permitindo compreender tanto a implementação quanto as motivações técnicas por trás de cada decisão.

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

O projeto utiliza tecnologias atuais do ecossistema Angular.

| Tecnologia            | Finalidade                      |
| --------------------- | ------------------------------- |
| Angular 21            | Framework Front-end             |
| TypeScript            | Linguagem principal             |
| Firebase SDK          | Backend as a Service            |
| Authentication        | Autenticação de usuários        |
| Firestore             | Banco de dados NoSQL            |
| Cloud Storage         | Armazenamento de arquivos       |
| Tailwind CSS          | Estilização                     |
| Spartan UI            | Biblioteca de componentes       |
| Angular Signals       | Gerenciamento reativo de estado |
| Standalone Components | Arquitetura moderna do Angular  |
| Angular Router        | Navegação entre páginas         |
| ESLint                | Padronização de código          |
| Prettier              | Formatação automática           |

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

A documentação está organizada por responsabilidade.

```text
docs/
├── README.md                ← Visão geral do projeto
├── architecture/
│   └── Architecture-v1.0.md
├── adr/
│   ├── README.md
│   ├── ADR-001-objetivo-do-projeto.md
│   ├── ADR-002-...
│   └── ...
├── sprint/
    └── Sprint-Planning.md

```

---

# Architecture Decision Records (ADRs)

As ADRs registram todas as decisões arquiteturais importantes do projeto.

Cada documento responde às seguintes perguntas:

* Qual era o problema?
* Qual decisão foi tomada?
* Por que essa decisão foi escolhida?
* Quais são as consequências dessa escolha?

Essa abordagem permite compreender a evolução da arquitetura ao longo do projeto.

---

# Roadmap

O desenvolvimento será realizado de forma incremental.

## Fase 1 — Fundação

* Estrutura inicial do projeto
* Configuração do Angular
* Tailwind CSS
* Spartan UI
* Organização Feature-Based
* Configuração do Firebase

## Fase 2 — Autenticação

* Login
* Cadastro
* Recuperação de senha
* Guards
* Controle de sessão

## Fase 3 — Firestore

* CRUD completo
* Coleções
* Consultas
* Paginação
* Boas práticas

## Fase 4 — Storage

* Upload de imagens
* Organização de arquivos
* Exclusão
* Regras de acesso

## Fase 5 — Recursos Avançados

* Signals
* Otimizações
* Lazy Loading
* Performance
* Responsividade

---

# Filosofia do Projeto

O Firebase Starter não busca apresentar apenas *como escrever código*, mas principalmente *como projetar software*.
