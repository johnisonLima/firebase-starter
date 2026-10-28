# Iconografia

──────────────

**Biblioteca:** Lucide
**Pacote:** `@lucide/angular`
**Integração:** diretivas Angular em elementos SVG
**Importação:** ícones individualmente
**Abstração própria:** não
**Estilo:** outline/stroke
**Stroke padrão:** 2 (configuração global)
**Tamanho:** definido pelo contexto/CSS
**Cor:** controlada pelo CSS/tema

## Iconografia

O Firebase Starter utiliza o **Lucide** como biblioteca padrão de ícones, integrado ao Angular por meio do pacote `@lucide/angular`.

Os ícones são importados individualmente pelos componentes e utilizados como diretivas aplicadas a elementos `<svg>`. Essa abordagem permite aproveitar o tree shaking e evitar a inclusão de ícones que não são utilizados pela aplicação.

Exemplo:

```ts
import { LucideFileText } from '@lucide/angular';

@Component({
  selector: 'app',
  template: '<svg lucideFileText></svg>',
  imports: [LucideFileText],
})
export class App {}
```

Não é utilizada uma camada de abstração própria para os ícones. A biblioteca é consumida diretamente pelos componentes enquanto não houver uma necessidade concreta de desacoplamento.

Os ícones seguem preferencialmente o estilo **outline/stroke**, mantendo uma identidade visual consistente em toda a aplicação. O `stroke-width` padrão adotado pelo projeto é `1.5`.

A cor dos ícones deve ser controlada preferencialmente pelo CSS e pelas variáveis do tema, permitindo que os ícones acompanhem automaticamente a identidade visual da aplicação sem a necessidade de definir cores diretamente em cada utilização.

O tamanho do ícone deve ser definido de acordo com o contexto do componente, evitando a criação de um tamanho único obrigatório para toda a aplicação.
