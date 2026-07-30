## Decisão 004

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