# Decisão 012

### Título

Camada de Abstração de Dados (Data Provider Pattern)

### Contexto

O Firebase Starter foi projetado para consumir informações provenientes de diferentes fontes de dados, como bancos relacionais, bancos NoSQL, APIs REST, arquivos locais, serviços em nuvem e, futuramente, conectores para plataformas externas.

Permitir que a lógica de negócio acesse diretamente essas tecnologias criaria um forte acoplamento entre as regras do sistema e a infraestrutura de armazenamento, tornando mudanças tecnológicas caras e aumentando a complexidade de testes e manutenção.

Além disso, a proposta do projeto é que novas fontes de dados possam ser adicionadas sem alterar o funcionamento dos agentes, workflows ou serviços que consomem essas informações.

Dessa forma, tornou-se necessário definir uma camada de abstração responsável por padronizar o acesso aos dados, isolando completamente os detalhes de implementação das diferentes tecnologias utilizadas.

### Alternativas consideradas

**1. Acesso direto ao banco ou API**

Cada módulo realizaria consultas diretamente utilizando a tecnologia específica (SQL, Firebase, MongoDB, REST etc.).

**Vantagens**
- Implementação simples.
- Menor quantidade inicial de código.

**Desvantagens**
- Forte acoplamento com a infraestrutura.
- Dificuldade para substituir tecnologias.
- Baixa reutilização.
- Testes unitários mais complexos.

---

**2. Repository Pattern tradicional**

Cada domínio possuiria um repositório responsável pelo acesso aos dados.

**Vantagens**
- Boa separação entre domínio e persistência.
- Bastante conhecido na comunidade.

**Desvantagens**
- Resolve apenas persistência.
- Não abstrai bem APIs externas, arquivos, serviços de IA ou outras fontes heterogêneas.
- Exige diferentes estratégias para cada tipo de origem.

---

**3. Data Provider Pattern (Escolhido)**

Criar uma camada de provedores de dados que define uma interface única para consumo de qualquer origem de informação, independentemente da tecnologia utilizada.

Cada implementação conhece apenas sua própria infraestrutura, enquanto o restante do sistema depende exclusivamente das interfaces.

### Decisão

Será adotado o **Data Provider Pattern** como camada oficial de abstração de acesso a dados do Assist Engine.

Cada fonte de dados será implementada como um **Provider**, responsável por encapsular toda a comunicação com sua tecnologia específica.

A aplicação dependerá apenas das interfaces dos providers, utilizando injeção de dependência para selecionar a implementação adequada.

Exemplos de providers incluem:

- SQL Provider
- Firebase Provider
- REST Provider
- Local File Provider
- Memory Provider
- Vector Database Provider
- AI Provider (quando aplicável)

Essa abordagem garante que agentes, workflows, serviços de domínio e casos de uso permaneçam completamente independentes da tecnologia utilizada para armazenamento ou obtenção das informações.

Novos providers poderão ser adicionados futuramente sem necessidade de modificar a lógica de negócio existente, respeitando o Princípio Aberto/Fechado (Open/Closed Principle) do SOLID.

### Consequências

#### Positivas

✔ Baixo acoplamento entre domínio e infraestrutura.

✔ Facilidade para substituir bancos de dados ou APIs.

✔ Suporte nativo a múltiplas fontes de dados.

✔ Facilidade para criação de implementações Mock durante testes.

✔ Melhor reutilização de código.

✔ Arquitetura preparada para crescimento gradual do projeto.

✔ Facilita futuras integrações com serviços externos.

✔ Mantém agentes e workflows independentes da tecnologia utilizada.

#### Negativas

✖ Aumento inicial da quantidade de código.

✖ Necessidade de manter interfaces bem definidas.

✖ Pequena sobrecarga de abstração para operações simples.

✖ Requer disciplina para evitar que implementações específicas "vazem" para as camadas superiores.

### Data

28/07/2026