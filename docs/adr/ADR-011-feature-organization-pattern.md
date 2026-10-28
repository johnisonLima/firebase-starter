# ADR011 — Feature Organization Pattern

## Contexto

O Sofftware será desenvolvido utilizando Angular 21 com Standalone Components e organizado por funcionalidades (Feature-Based Architecture).

Com o crescimento da aplicação, torna-se necessário definir um padrão único para organização interna das features, garantindo previsibilidade, facilidade de manutenção e escalabilidade.

Versões mais antigas do Angular utilizavam frequentemente a divisão entre `containers` e `components`. Entretanto, com a evolução do framework, principalmente após a introdução dos Standalone Components, Lazy Loading por rota e Signals, tornou-se mais natural organizar a aplicação em torno das páginas representadas pelas rotas.

---

## Decisão

Toda funcionalidade da aplicação será organizada utilizando o padrão **Feature Organization Pattern**.

Cada feature possuirá sua própria estrutura interna contendo apenas os elementos relacionados àquela funcionalidade.

A estrutura base será:

```text
features/
└── feature-name/
    ├── pages/
    ├── components/
    ├── services/
    ├── models/
    ├── guards/
    ├── resolvers/
    ├── feature.routes.ts
    └── index.ts
```

Nem todas as pastas são obrigatórias.

Cada feature deverá possuir apenas os diretórios realmente necessários.

---

## Responsabilidades

### pages/

Representam as páginas da aplicação.

Cada página corresponde a uma rota acessível pelo usuário.

Responsabilidades:

- Orquestrar a tela.
- Consumir serviços.
- Controlar navegação.
- Integrar componentes da feature.
- Não conter regras reutilizáveis de interface.

Exemplo:

```text
pages/
├── login/
├── register/
└── forgot-password/
```

---

### components/

Contém componentes reutilizáveis apenas dentro da própria feature.

Responsabilidades:

- Interface.
- Componentes auxiliares.
- Formulários.
- Cards.
- Modais específicos da feature.

Exemplo:

```text
components/
├── login-form/
├── auth-card/
└── social-login/
```

Caso um componente possa ser utilizado por outras features, ele deverá ser movido para:

```text
shared/ui/
```

---

### services/

Contém regras de negócio pertencentes exclusivamente à feature.

Exemplo:

```text
AuthApiService
ProfileService
DashboardService
```

Serviços globais da aplicação deverão permanecer em:

```text
core/
```

---

### models/

Contém interfaces, types e modelos utilizados apenas pela feature.

Exemplo:

```text
login-request.ts
user-profile.ts
```

Modelos compartilhados entre múltiplas features deverão permanecer em:

```text
shared/models/
```

---

### guards/

Contém Route Guards específicos da feature.

Exemplo:

```text
auth.guard.ts
guest.guard.ts
```

---

### resolvers/

Utilizados quando a rota necessita carregar dados antes da renderização da página.

Criar apenas quando necessário.

---

### feature.routes.ts

Arquivo responsável exclusivamente pelas rotas da feature.

Cada feature deverá possuir seu próprio arquivo de rotas.

---

### index.ts

Arquivo responsável por exportações públicas da feature quando necessário.

---

## Estrutura Geral

Exemplo para o módulo de autenticação.

```text
features/
└── auth/
    ├── pages/
    │   ├── login/
    │   ├── register/
    │   └── forgot-password/
    │
    ├── components/
    │   ├── login-form/
    │   ├── auth-card/
    │   └── social-login/
    │
    ├── services/
    │   └── auth.service.ts
    │
    ├── models/
    │   └── login.model.ts
    │
    ├── guards/
    │   └── guest.guard.ts
    │
    ├── auth.routes.ts
    └── index.ts
```

---

## Diretrizes

Uma página deve representar uma rota.

Componentes reutilizáveis da própria funcionalidade devem permanecer em `components`.

Componentes reutilizáveis por toda a aplicação devem permanecer em `shared/ui`.

Serviços globais permanecem em `core`.

Cada feature deve ser independente das demais sempre que possível.

Evitar dependências diretas entre features.

---

## Consequências

### Positivas

- Organização consistente.
- Maior escalabilidade.
- Melhor separação de responsabilidades.
- Facilidade para localizar arquivos.
- Melhor suporte ao Lazy Loading.
- Arquitetura alinhada às práticas modernas do Angular.

### Negativas

- Pequeno aumento inicial da quantidade de diretórios.
- Exige disciplina para manter a organização da arquitetura.

---

## Alternativas Consideradas

### Organização por tipo (Components, Services, Models globais)

Rejeitada por dificultar a escalabilidade e aumentar o acoplamento entre funcionalidades.

### Padrão Containers / Components

Rejeitado como padrão principal.

Embora ainda seja válido, o termo **containers** tornou-se menos semântico no contexto atual do Angular. O diretório **pages** comunica de forma mais clara que seus componentes representam pontos de entrada da aplicação através das rotas.

---

## ADRs Relacionadas

- ADR001 — Arquitetura Base
- ADR002 — Estrutura de Diretórios
- ADR003 — Configuração do Firebase
- ADR009 — Interface Mobile First

## Data

28/07/2026