# ADR (Architecture Decision Records)

Registro das decisões arquiteturais e técnicas tomadas durante o desenvolvimento do projeto.
Cada decisão documenta o contexto, as alternativas consideradas, a decisão adotada e suas consequências.

# Índice

- Decisão 001 – Não utilizar environments.
- Decisão 002 – Registrar o Firebase durante o bootstrap da aplicação.
- Decisão 003 – Separar configuração da inicialização do Firebase.
- Decisão 004 – Utilizar o sistema de Injeção de Dependências do Angular para registrar dependências externas.
- Decisão 005 – Adotar Providers baseados em funções seguindo o padrão do Angular moderno.
- Decisão 006 – Não criar um FirebaseService genérico
- Decisão 007 – Adotar o Spartan UI como biblioteca de componentes
- Decisão 008 – Adotar Tailwind CSS como estratégia oficial de estilização


 
# Decisão arquitetural 

## Decisão 001

### Título

Não utilizar environments.

### Contexto

O Angular 21 não cria mais environments por padrão.

O projeto possui apenas um ambiente Firebase.

### Decisão

Criar um arquivo dedicado:

core/config/firebase.config.ts

### Consequências

✔ Menos complexidade

✔ Responsabilidade bem definida

✔ Fácil migração para environments futuramente

### Data

22/07/2026

## Decisão 002

### Título

Registrar o Firebase durante o bootstrap da aplicação.

### Contexto

O Firebase é um serviço global utilizado por múltiplas funcionalidades da aplicação, como autenticação, Firestore, Storage e Cloud Functions.

A inicialização do SDK possui baixo custo e não realiza autenticação nem carregamento de dados automaticamente.

### Alternativas consideradas

- Inicializar no AppComponent.
- Inicializar sob demanda no primeiro Service utilizado.
- Registrar durante o bootstrap da aplicação.

### Decisão

Registrar o Firebase durante o bootstrap utilizando Providers, garantindo que o SDK esteja disponível para toda a aplicação antes da criação dos componentes.

### Consequências

**Positivas**

✔ Inicialização única do SDK.

✔ Menor acoplamento entre componentes e infraestrutura.

✔ Facilidade para reutilização por Authentication, Firestore, Storage e outros serviços.

✔ Arquitetura preparada para crescimento.

**Negativas**

✖ Pequeno aumento no tempo de inicialização da aplicação.

✖ Necessidade de tratar eventuais falhas na inicialização.

### Data

22/07/2026

## Decisão 003

### Título

Separar configuração da inicialização do Firebase.

### Contexto

A documentação oficial do Firebase mostra a configuração e a inicialização no mesmo arquivo para simplificar os exemplos. Em uma aplicação Angular, essa abordagem cria efeitos colaterais ao importar o arquivo e mistura responsabilidades.

### Alternativas consideradas

- Manter initializeApp() no arquivo de configuração.
- Inicializar no AppComponent.
- Inicializar durante o bootstrap por meio de Providers.

### Decisão

Manter `firebase.config.ts` exclusivamente para configuração (FirebaseOptions) e realizar a criação da instância do Firebase em `firebase.providers.ts`, integrando-a ao sistema de Injeção de Dependências do Angular.

### Consequências 

**Positivas**

✔ Elimina efeitos colaterais durante imports.

✔ Cada arquivo possui uma única responsabilidade.

✔ Facilita testes.

✔ Facilita a inclusão futura de Firestore, Storage e outras dependências.

**Negativas**

✖ Introduz alguns arquivos extras em relação aos exemplos da documentação.

✖ Exige conhecimento básico do sistema de DI do Angular.

### Data

22/07/2026

# Decisão 004

### Título

Utilizar o sistema de Injeção de Dependências do Angular para registrar dependências externas.

### Contexto

O Angular possui um sistema próprio de Injeção de Dependências (Dependency Injection - DI), responsável por fornecer objetos para toda a aplicação por meio de Providers.

Durante o desenvolvimento da integração com o Firebase, foi avaliado que utilizar imports globais ou implementar manualmente o padrão Singleton aumentaria o acoplamento da aplicação e dificultaria testes, manutenção e evolução da arquitetura.

Além disso, o Angular oferece mecanismos próprios para gerenciar o ciclo de vida das dependências, tornando desnecessária a implementação manual de padrões como Singleton para esse tipo de cenário.

### Alternativas consideradas

* Utilizar imports globais para compartilhar instâncias.
* Implementar manualmente o padrão Singleton.
* Registrar as dependências utilizando Providers e o sistema de Injeção de Dependências do Angular.

### Decisão

Toda dependência externa que possua responsabilidade global na aplicação será registrada no sistema de Injeção de Dependências do Angular por meio de Providers.

Quando a dependência não for representada por uma classe Angular, serão utilizados `InjectionToken` e Providers apropriados (`useFactory`, `useValue`, `useExisting` ou `useClass`), conforme a necessidade.

Essa estratégia será adotada para o Firebase e servirá como padrão para futuras integrações da aplicação.

### Consequências

#### Positivas

✔ Menor acoplamento entre componentes e infraestrutura.

✔ Centralização da criação e gerenciamento das dependências.

✔ Melhor aderência às boas práticas do Angular moderno.

✔ Facilita testes unitários e substituição por objetos simulados (mocks).

✔ Evita implementações manuais desnecessárias do padrão Singleton.

✔ Arquitetura preparada para crescimento e novas integrações.

#### Negativas

✖ Exige compreensão do sistema de Injeção de Dependências do Angular.

✖ Introduz uma pequena complexidade inicial para projetos simples.

### Data

22/07/2026

# Decisão 005

### Título

Adotar Providers baseados em funções seguindo o padrão do Angular moderno.

### Contexto

Durante a integração do Firebase foi avaliada a forma de registrar Providers na aplicação.

Inicialmente foi considerada a exportação de um array de Providers (`firebaseProviders`) para posterior inclusão no `app.config.ts`.

Entretanto, observou-se que o Angular moderno adota como padrão funções iniciadas por `provide...`, como `provideRouter()`, `provideHttpClient()` e `provideZoneChangeDetection()`. Esse padrão torna a configuração da aplicação mais legível, modular e consistente.

### Alternativas consideradas

* Exportar um array de Providers (`firebaseProviders`).
* Registrar cada Provider individualmente no `app.config.ts`.
* Criar uma função `provideFirebase()` responsável por registrar toda a infraestrutura do Firebase.

### Decisão

Adotar funções do tipo `provide...` para registrar dependências globais da aplicação.

A integração do Firebase será realizada por meio da função `provideFirebase()`, responsável por encapsular toda a configuração necessária para disponibilizar o SDK através do sistema de Injeção de Dependências do Angular.

Novas integrações seguirão a mesma abordagem, mantendo a consistência da arquitetura.

### Consequências

#### Positivas

✔ Arquitetura alinhada às boas práticas do Angular moderno.

✔ Melhor legibilidade do `app.config.ts`.

✔ Encapsulamento da infraestrutura de cada domínio.

✔ Facilidade para evolução futura, permitindo adicionar Authentication, Firestore, Storage e outros serviços sem alterar a estrutura do `app.config.ts`.

✔ Padronização da configuração da aplicação utilizando funções `provide...`.

#### Negativas

✖ Introduz uma camada adicional de abstração em relação aos exemplos mais simples da documentação.

✖ Exige conhecimento sobre Providers e Injeção de Dependências para compreender sua implementação.

### Data

22/07/2026

# ADR 006 – Não criar um FirebaseService genérico

## Contexto

Durante a definição da arquitetura da integração entre Angular e Firebase, surgiu a necessidade de decidir se seria criado um serviço genérico (`FirebaseService`) responsável por encapsular o acesso ao `FirebaseApp` e servir de intermediário para todos os demais serviços.

Essa abordagem é comum em diversos projetos, porém adiciona uma camada entre os serviços da aplicação e o sistema de Injeção de Dependências do Angular.

## Alternativas consideradas

### Alternativa 1 – Criar um FirebaseService

Criar um serviço responsável por expor o `FirebaseApp` para toda a aplicação.

Exemplo:

```ts
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  readonly app = inject(FIREBASE_APP);

}
```

Os demais serviços dependeriam desse serviço.

### Alternativa 2 – Injetar diretamente o FIREBASE_APP

Cada serviço especializado obtém diretamente o `FirebaseApp` através do sistema de Dependency Injection do Angular.

Exemplo:

```ts
private readonly app = inject(FIREBASE_APP);
```

## Decisão

Foi adotada a **Alternativa 2**.

Não será criado um `FirebaseService` genérico.

Cada serviço especializado (Auth, Firestore, Storage, etc.) solicitará diretamente o `FIREBASE_APP` ao Angular por meio do `inject()`.

## Consequências

### Positivas

* Remove uma camada desnecessária de abstração.
* Reduz o acoplamento entre os serviços.
* Aproveita diretamente o sistema de Dependency Injection do Angular.
* Mantém cada serviço responsável apenas por seu domínio.
* Segue o princípio da Responsabilidade Única (SRP).
* Facilita manutenção e testes.

### Negativas

* Cada serviço precisará declarar explicitamente sua dependência do `FIREBASE_APP`.
* Caso a estratégia de obtenção do `FirebaseApp` mude no futuro, todos os serviços consumidores dependerão do mesmo token (embora a alteração normalmente permaneça centralizada nos Providers).

### Data

23/07/2026

# ADR 007 – Adotar o Spartan UI como biblioteca de componentes

## Contexto

Durante a definição da camada de interface da aplicação, foi necessário escolher uma biblioteca de componentes para acelerar o desenvolvimento e manter consistência visual.

Foram avaliadas as principais alternativas do ecossistema Angular considerando compatibilidade com Angular 21, suporte a Standalone Components, alinhamento com Signals, facilidade de customização, manutenção a longo prazo e aderência às práticas modernas do framework.

## Alternativas consideradas

### Alternativa 1 – Angular Material

Biblioteca oficial do Angular.

**Vantagens**

* Excelente integração com o Angular.
* Documentação completa.
* Grande comunidade.
* Alta estabilidade.

**Desvantagens**

* Forte dependência do Material Design.
* Personalização mais trabalhosa.
* Componentes com aparência bastante característica.

---

### Alternativa 2 – PrimeNG

Biblioteca bastante utilizada em aplicações corporativas.

**Vantagens**

* Grande quantidade de componentes.
* Excelente conjunto para sistemas administrativos.
* Boa documentação.

**Desvantagens**

* Componentes mais complexos.
* Customização visual pode exigir maior esforço.
* Algumas funcionalidades avançadas pertencem à versão comercial.

---

### Alternativa 3 – Taiga UI

Biblioteca moderna focada em experiência do usuário.

**Vantagens**

* Interface elegante.
* Boa integração com Angular.

**Desvantagens**

* Comunidade menor.
* Menor quantidade de exemplos e componentes.

---

### Alternativa 4 – Spartan UI

Biblioteca moderna inspirada na filosofia do shadcn/ui.

**Vantagens**

* Totalmente compatível com Angular moderno.
* Excelente integração com Standalone Components.
* Componentes altamente customizáveis.
* Arquitetura baseada em composição.
* Menor acoplamento visual.
* Incentiva maior controle sobre os componentes utilizados.

**Desvantagens**

* Ecossistema menor que Angular Material e PrimeNG.
* Curva de aprendizado um pouco maior para iniciantes.

## Decisão

Foi adotado o **Spartan UI** como biblioteca oficial de componentes do projeto.

A escolha foi motivada pelo alinhamento com a arquitetura definida para a aplicação, baseada em Angular 21, Standalone Components, Dependency Injection moderna (`inject()`), Signals e foco em componentes altamente reutilizáveis e personalizáveis.

Essa decisão também favorece o caráter didático do projeto, permitindo compreender melhor o funcionamento dos componentes utilizados e reduzindo o acoplamento a uma identidade visual específica.

## Consequências

### Positivas

* Interface moderna e altamente customizável.
* Excelente integração com Angular 21.
* Componentes baseados em composição.
* Menor dependência de estilos pré-definidos.
* Maior controle sobre a evolução da interface.
* Arquitetura alinhada às práticas modernas do ecossistema Angular.

### Negativas

* Comunidade menor quando comparada ao Angular Material e PrimeNG.
* Menor quantidade de exemplos disponíveis.
* Alguns componentes podem exigir maior conhecimento da biblioteca durante a customização.

## Data

23/07/2026

# ADR 008 – Adotar Tailwind CSS como estratégia oficial de estilização

## Contexto

Durante a definição da camada de apresentação da aplicação, foi necessário escolher uma estratégia de estilização que atendesse aos requisitos de produtividade, customização, manutenção e compatibilidade com o ecossistema moderno do Angular.

Como o projeto adotará o Spartan UI como biblioteca de componentes, a escolha da solução de estilização deve estar alinhada à filosofia da biblioteca e às práticas recomendadas pela comunidade.

## Alternativas consideradas

### Alternativa 1 – CSS tradicional

**Vantagens**

* Simplicidade.
* Sem dependências adicionais.
* Amplamente conhecido.

**Desvantagens**

* Reutilização limitada.
* Maior quantidade de código.
* Manutenção mais trabalhosa em projetos de médio e grande porte.

---

### Alternativa 2 – SCSS

**Vantagens**

* Recursos avançados como variáveis, mixins e funções.
* Melhor organização dos estilos.
* Bastante difundido na comunidade Angular.

**Desvantagens**

* Pode gerar estruturas de estilos complexas.
* Incentiva a escrita de grandes arquivos de estilos.
* Menor integração com a filosofia do Spartan UI.

---

### Alternativa 3 – Tailwind CSS

**Vantagens**

* Excelente integração com o Spartan UI.
* Desenvolvimento rápido utilizando classes utilitárias.
* Alto nível de customização.
* Estilos consistentes e reutilizáveis.
* Redução significativa da necessidade de CSS personalizado.
* Ampla adoção na comunidade e evolução constante.

**Desvantagens**

* Curva de aprendizado inicial.
* Maior quantidade de classes diretamente no HTML.
* Dependência de uma etapa adicional de processamento durante a compilação.

## Decisão

Foi adotado o **Tailwind CSS** como estratégia oficial de estilização do projeto.

A escolha foi motivada pelo excelente alinhamento com o Spartan UI, pela facilidade de criação de interfaces modernas, pela redução da necessidade de arquivos CSS personalizados e pela ampla adoção da abordagem utilitária no desenvolvimento de aplicações Angular contemporâneas.

## Consequências

### Positivas

* Maior produtividade no desenvolvimento da interface.
* Facilidade de customização dos componentes.
* Redução da quantidade de CSS manual.
* Padronização dos estilos em toda a aplicação.
* Excelente integração com o Spartan UI.
* Arquitetura de interface moderna e escalável.

### Negativas

* Necessidade de aprendizado da sintaxe utilitária do Tailwind CSS.
* Código HTML pode conter maior quantidade de classes.
* Dependência de ferramentas adicionais para processamento dos estilos.

## Data

23/07/2026
