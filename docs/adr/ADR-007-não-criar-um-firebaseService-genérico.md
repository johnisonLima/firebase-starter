# ADR 007 – Não criar um FirebaseService genérico

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