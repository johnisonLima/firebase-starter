# Decisão 013

### Título

Obrigatoriedade de Testes Unitários para Código de Domínio

### Contexto

O Software uma camada de domínio responsável por concentrar regras de negócio, algoritmos, utilitários, validadores, parsers, helpers e demais componentes que implementam comportamento puro da aplicação.

Esses componentes representam a base do sistema e tendem a ser reutilizados em diversos módulos. Um erro em uma função de domínio pode propagar comportamentos incorretos para múltiplas funcionalidades.

Além disso, o projeto adota integração contínua e evolução incremental, tornando importante que alterações futuras possam ser realizadas com segurança, sem introduzir regressões.

Diante desse cenário, tornou-se necessário estabelecer uma política clara de testes automatizados para todo código de domínio.

### Alternativas consideradas

**1. Testar apenas funcionalidades críticas**

Criar testes apenas para algoritmos considerados importantes.

**Vantagens**
- Menor esforço inicial.
- Desenvolvimento mais rápido.

**Desvantagens**
- Critério subjetivo sobre o que é "crítico".
- Maior risco de regressões.
- Cobertura inconsistente ao longo do projeto.

---

**2. Testes opcionais**

Permitir que cada desenvolvedor decida quando criar testes.

**Vantagens**
- Maior flexibilidade.
- Menos tempo gasto durante o desenvolvimento inicial.

**Desvantagens**
- Ausência de padronização.
- Baixa confiabilidade da suíte de testes.
- Dificuldade para manutenção futura.

---

**3. Testes obrigatórios para todo código de domínio (Escolhido)**

Todo código pertencente à camada de domínio deverá possuir testes unitários desenvolvidos juntamente com sua implementação.

### Decisão

Será obrigatório que **todo código da camada de domínio possua testes unitários utilizando Vitest**.

Essa regra inclui, mas não se limita a:

- Algoritmos
- Utilitários (Utils)
- Helpers
- Validadores
- Parsers
- Value Objects
- Funções puras
- Regras de negócio
- Estratégias
- Serviços de domínio sem dependências externas

Os testes deverão validar tanto os cenários de sucesso quanto os casos de erro, valores limite e situações excepcionais quando aplicável.

Código de domínio sem testes não será considerado concluído.

Componentes cuja responsabilidade seja exclusivamente de interface gráfica, configuração, integração com infraestrutura ou bibliotecas de terceiros poderão possuir estratégias de teste específicas e não são abrangidos por esta decisão.

### Consequências

#### Positivas

✔ Maior confiabilidade das regras de negócio.

✔ Redução significativa de regressões.

✔ Facilidade para refatoração de algoritmos.

✔ Documentação executável do comportamento esperado.

✔ Detecção precoce de erros.

✔ Maior segurança para evolução contínua do projeto.

✔ Incentiva a escrita de funções pequenas, puras e desacopladas.

✔ Padroniza a qualidade do código em todo o projeto.

#### Negativas

✖ Aumento do tempo inicial de desenvolvimento.

✖ Maior quantidade de arquivos no projeto.

✖ Necessidade de manutenção da suíte de testes durante evoluções do domínio.

### Data

28/07/2026