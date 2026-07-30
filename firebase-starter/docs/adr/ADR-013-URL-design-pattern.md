# ADR011 — URL Design Pattern

## Contexto

O software utiliza uma arquitetura baseada em funcionalidades (Feature-Based Architecture), onde cada módulo possui sua própria organização interna de componentes, serviços, modelos e rotas.

Entretanto, a estrutura interna da aplicação não deve determinar obrigatoriamente a estrutura das URLs públicas.

As URLs fazem parte da experiência do usuário e devem ser simples, intuitivas e independentes da organização do código-fonte.

---

## Decisão

A estrutura interna das funcionalidades será organizada por **features**, porém as URLs públicas serão definidas pensando na experiência do usuário.

Sempre que possível, as URLs deverão ser curtas, diretas e sem prefixos desnecessários.

A estrutura das pastas não deverá ser refletida obrigatoriamente na navegação da aplicação.

---

## Diretrizes

Cada feature será responsável por declarar suas próprias rotas através do arquivo:

```text
feature.routes.ts
```

O arquivo `app.routes.ts` será responsável apenas por compor todas as rotas da aplicação.

As features não devem conhecer o caminho onde serão publicadas.

---

## Exemplo

Estrutura interna:

```text
features/
└── auth/
    ├── pages/
    │   ├── login/
    │   ├── register/
    │   └── forgot-password/
    │
    └── auth.routes.ts
```

Rotas públicas:

```text
/login
/register
/forgot-password
```

e não:

```text
/auth/login
/auth/register
/auth/forgot-password
```

---

## Organização das Rotas

Cada feature deverá manter seu próprio arquivo de rotas.

Exemplo:

```text
features/
├── auth/
│   └── auth.routes.ts
│
├── dashboard/
│   └── dashboard.routes.ts
│
├── users/
│   └── users.routes.ts
│
└── settings/
    └── settings.routes.ts
```

O arquivo principal de rotas apenas reúne todas as funcionalidades da aplicação.

---

## Benefícios

- URLs mais limpas.
- Melhor experiência para o usuário.
- Independência entre arquitetura interna e navegação.
- Facilidade para reorganizar funcionalidades sem alterar URLs públicas.
- Melhor manutenção da aplicação.
- Menor acoplamento entre módulos.

---

## Consequências

### Positivas

- URLs curtas e intuitivas.
- Melhor organização arquitetural.
- Features independentes.
- Maior flexibilidade para evolução da aplicação.
- Melhor compatibilidade com Lazy Loading.

### Negativas

- Exige disciplina para manter a separação entre arquitetura e navegação.
- O caminho físico da feature deixa de ser um indicativo direto da URL pública.

---

## Alternativas Consideradas

### URLs refletindo a estrutura das pastas

Exemplo:

```text
/auth/login
/auth/register
```

Rejeitada por acoplar a navegação à arquitetura interna da aplicação.

---

### Uma única definição de rotas centralizada

Rejeitada por dificultar a escalabilidade e aumentar o acoplamento entre funcionalidades.

---

## ADRs Relacionadas

- ADR001 — Arquitetura Base
- ADR002 — Estrutura de Diretórios
- ADR009 — Interface Mobile First
- ADR010 — Feature Organization Pattern


## Data

28/07/2026