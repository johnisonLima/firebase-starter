# Acessibilidade — Firebase Starter

**Status do documento:** inicial; avaliação formal não iniciada.  
**Padrão adotado:** WCAG 2.2, nível AA.  
**Conformidade:** não declarada.  
**Última atualização:** 2026-11-09.  
**Responsável:** responsável pelo projeto.

---

## 1. Objetivo

Este documento estabelece os critérios, o escopo, os métodos e os indicadores de acompanhamento da acessibilidade do Firebase Starter. Ele serve como referência comum para planejar correções, executar avaliações, registrar evidências e acompanhar a evolução da qualidade da interface.

O documento está relacionado ao RNF-022 do catálogo de requisitos e complementa a documentação de arquitetura, o Design System e a estratégia de testes. Ele não substitui esses documentos e não altera as decisões arquiteturais registradas nas ADRs.

Este documento **não constitui certificação, laudo de auditoria ou declaração de conformidade**. A conformidade WCAG 2.2 AA permanece não declarada até que uma avaliação completa seja executada, revisada e registrada com evidências suficientes. A existência deste documento, de uma matriz preenchida ou de resultados automatizados não autoriza, por si só, a declaração de conformidade.

---

## 2. Padrão de conformidade

| Item | Definição |
|---|---|
| Padrão | Web Content Accessibility Guidelines (WCAG) |
| Versão | 2.2 |
| Nível | AA |
| Referência oficial | https://www.w3.org/TR/WCAG22/ |
| Objetivo | Buscar conformidade WCAG 2.2 nível AA |
| Estado | Não declarada |

A WCAG 2.2 é uma Recomendação do W3C. O nível AA exige o atendimento de **todos os critérios de sucesso aplicáveis dos níveis A e AA**. Critérios não aplicáveis devem ser identificados e justificados; não podem ser omitidos sem registro.

A avaliação de conformidade considera:

- páginas completas, e não apenas fragmentos isolados;
- processos completos, incluindo etapas de autenticação, recuperação e verificação;
- tecnologias de acessibilidade suportadas;
- não interferência de conteúdo não conforme no restante da página;
- evidências adequadas para cada critério aplicável.

A conformidade é binária no nível do escopo: uma falha em critério aplicável impede a declaração de conformidade do conjunto. Indicadores percentuais, resultados automatizados ou uma lista parcial de verificações não substituem essa exigência.

---

## 3. Escopo da avaliação

### 3.1 Páginas de produção

| Página | Finalidade | Inclusão |
|---|---|---|
| `/login` | Autenticação de usuários | Incluída |
| `/register` | Cadastro de conta | Incluída |
| `/forgot-password` | Recuperação de senha | Incluída |
| `/verify-email` | Verificação de e-mail e reenvio | Incluída |
| `/dashboard` | Área autenticada | Incluída, ainda que atualmente seja um placeholder |

A rota raiz `/` redireciona para `/login` e não constitui página adicional. Rotas inexistentes e eventuais telas de erro devem ser incluídas caso venham a ser implementadas.

### 3.2 Componentes compartilhados

| Componente | Inclusão |
|---|---|
| Input | Incluído |
| FormError | Incluído |
| Button | Incluído |
| Dialog | Incluído como componente compartilhado |
| Toast | Incluído |
| Loading | Incluído |
| LoadingOverlay | Incluído |
| ThemeToggle | Incluído |
| AppLogo | Incluído |

A avaliação de componentes considera os estados e os usos reais nas páginas de produção. Componentes que ainda não são utilizados em uma página de produção, como o Dialog, devem ser avaliados como componente compartilhado e, quando houver uso futuro, reavaliados no fluxo correspondente.

### 3.3 Fluxos

- Login.
- Cadastro.
- Recuperação de senha.
- Verificação de e-mail.
- Logout.
- Redirecionamentos e guards de rota.

Cada fluxo deve ser avaliado do início ao fim, incluindo mensagens de erro, estados de carregamento, retorno ao fluxo e comportamento após sucesso.

### 3.4 Estados

- Padrão.
- Hover.
- Focus.
- Active.
- Disabled.
- Loading.
- Erro.
- Sucesso.
- Diálogo aberto.
- Toast visível.

Estados adicionais que surgirem durante a avaliação devem ser registrados, como formulário inválido, erro de servidor, sucesso de recuperação, fila de toasts e carregamento global.

### 3.5 Outras dimensões

- Tema claro e escuro.
- Navegação por teclado.
- Responsividade, incluindo viewport estreita, zoom e redimensionamento.
- Tecnologias assistivas, com Orca no Ubuntu como referência inicial.
- Navegadores Chromium, Firefox e WebKit, conforme disponibilidade do ambiente.

### 3.6 Exclusão do Playground

A rota `/playground` é uma área de desenvolvimento e demonstração. Ela **não faz parte da versão de produção** e, consequentemente, **não integra o escopo de conformidade do produto**.

Os componentes compartilhados continuam incluídos na avaliação quando utilizados nas páginas e fluxos de produção. O Playground pode ser usado como ambiente auxiliar de teste de componentes, mas seus resultados não contam como avaliação de página de produção.

O componente `FirestoreTest` também permanece fora do escopo enquanto não fizer parte da aplicação disponibilizada ao usuário.

A exclusão do Playground pressupõe que a rota não seja publicada na versão de produção. Caso ela permaneça acessível em produção, a decisão deve ser revista e a rota deve ser incluída no escopo.

### 3.7 Limites do escopo

Não fazem parte deste escopo:

- critérios de nível AAA;
- conteúdo de terceiros fora da aplicação, como cliente de e-mail, console do Firebase e provedores de identidade;
- sistema operacional, navegador e tecnologia assistiva em si;
- aplicativos nativos ou conteúdo não web;
- certificação legal ou declaração jurídica de conformidade;
- funcionalidades ainda não implementadas, como o drag and drop do RF-073, enquanto seu escopo não for definido.

---

## 4. Critérios WCAG

### 4.1 Como interpretar a matriz

A matriz abaixo relaciona os critérios de sucesso dos níveis A e AA da WCAG 2.2. Ela serve como base para a avaliação e deve ser detalhada, quando necessário, por página, componente, estado ou fluxo.

A coluna **Aplicabilidade** registra a decisão inicial. “Não aplicável” exige justificativa. “Aplicável” significa que o critério deve ser avaliado; não significa que já foi aprovado. Nenhum resultado é registrado nesta etapa.

O critério 4.1.1 (Parsing) foi removido na WCAG 2.2 e não integra esta matriz. Critérios AAA não fazem parte do nível adotado.

### 4.2 Matriz de critérios A e AA

| ID | Critério (nome oficial) | Nível | Aplicação no projeto | Aplicabilidade | Justificativa quando não aplicável |
|---|---|---|---:|---|---|
| 1.1.1 | Non-text Content | A | Logotipo, ícones e imagens devem ter alternativa textual ou serem decorativos; ícones Lucide sem título já usam `aria-hidden` quando aplicável. | Aplicável | — |
| 1.2.1 | Audio-only and Video-only (Prerecorded) | A | Não há áudio ou vídeo pré-gravado na aplicação. | Não aplicável | O projeto não disponibiliza conteúdo em áudio ou vídeo. |
| 1.2.2 | Captions (Prerecorded) | A | Não há vídeo pré-gravado com áudio. | Não aplicável | Não existe mídia pré-gravada que exija legendas. |
| 1.2.3 | Audio Description or Media Alternative (Prerecorded) | A | Não há vídeo pré-gravado. | Não aplicável | Não existe mídia que exija audiodescrição ou alternativa textual. |
| 1.2.4 | Captions (Live) | AA | Não há transmissão ao vivo. | Não aplicável | O projeto não oferece mídia ao vivo. |
| 1.2.5 | Audio Description (Prerecorded) | AA | Não há vídeo pré-gravado. | Não aplicável | Não existe mídia que exija audiodescrição. |
| 1.3.1 | Info and Relationships | A | Landmarks, headings, labels, listas, tabelas e relações do diálogo devem representar corretamente a estrutura. | Aplicável | — |
| 1.3.2 | Meaningful Sequence | A | A ordem de leitura e de foco deve ser coerente nas páginas, formulários e diálogo. | Aplicável | — |
| 1.3.3 | Sensory Characteristics | A | Instruções não devem depender apenas de forma, cor, tamanho, posição ou som. | Aplicável | — |
| 1.3.4 | Orientation | AA | O layout não deve bloquear retrato ou paisagem. | Aplicável | — |
| 1.3.5 | Identify Input Purpose | AA | Campos de e-mail e senha devem usar `autocomplete` adequado ao propósito. | Aplicável | — |
| 1.4.1 | Use of Color | A | Erros, estados e links não podem depender exclusivamente de cor. | Aplicável | — |
| 1.4.2 | Audio Control | A | Não há áudio reproduzido automaticamente. | Não aplicável | O projeto não reproduz áudio. |
| 1.4.3 | Contrast (Minimum) | AA | Texto normal deve ter 4,5:1 e texto grande 3:1, nos temas claro e escuro. | Aplicável | — |
| 1.4.4 | Resize Text | AA | O texto deve poder ser ampliado em 200% sem perda de conteúdo ou funcionalidade. | Aplicável | — |
| 1.4.5 | Images of Text | AA | O logotipo e os ícones não devem substituir texto essencial; imagens de texto devem ser evitadas. | Aplicável | — |
| 1.4.10 | Reflow | AA | O conteúdo deve se reorganizar em viewport de 320 px e com 400% de zoom sem rolagem horizontal indevida. | Aplicável | — |
| 1.4.11 | Non-text Contrast | AA | Bordas de input, indicadores de foco, ícones e estados devem ter pelo menos 3:1 contra as cores adjacentes. | Aplicável | — |
| 1.4.12 | Text Spacing | AA | O aumento de espaçamento de texto não deve causar clipping ou perda de conteúdo em inputs, botões e diálogo. | Aplicável | — |
| 1.4.13 | Content on Hover or Focus | AA | Conteúdo adicional exibido em hover ou foco deve ser dispensável, acionável e persistente quando necessário. | Aplicável | — |
| 2.1.1 | Keyboard | A | Todos os controles devem ser operáveis por teclado. | Aplicável | — |
| 2.1.2 | No Keyboard Trap | A | O diálogo e qualquer foco contido devem permitir saída, inclusive por `Esc`. | Aplicável | — |
| 2.1.4 | Character Key Shortcuts | A | Não há atalhos de caractere; o diálogo usa apenas `Esc`. | Não aplicável | `Esc` não é um atalho de caractere e não há `accesskey` ou atalho de uma tecla alfabética. |
| 2.2.1 | Timing Adjustable | A | Toasts de sucesso e informação expiram em 5 segundos; verificar se são o único feedback e se o tempo pode ser ajustado. | Aplicável | — |
| 2.2.2 | Pause, Stop, Hide | A | Animações e estados de carregamento devem ser avaliados quanto a movimento e duração. | Aplicável | — |
| 2.3.1 | Three Flashes or Below Threshold | A | Não há conteúdo piscante identificado; confirmar durante a avaliação. | Aplicável | — |
| 2.4.1 | Bypass Blocks | A | Verificar se existem blocos repetidos que exijam mecanismo de salto; se não houver, reclassificar como não aplicável. | Aplicável | — |
| 2.4.2 | Page Titled | A | Cada página deve ter título descritivo, incluindo mudanças de rota da SPA. | Aplicável | — |
| 2.4.3 | Focus Order | A | A ordem de foco deve ser lógica em formulários, diálogo e após navegação. | Aplicável | — |
| 2.4.4 | Link Purpose (In Context) | A | O propósito dos links deve ser identificável pelo texto ou pelo contexto. | Aplicável | — |
| 2.4.5 | Multiple Ways | AA | Avaliar se o conjunto de páginas oferece mais de uma forma de localização; a aplicação é pequena e pode justificar não aplicabilidade. | Aplicável | — |
| 2.4.6 | Headings and Labels | AA | Headings e labels devem descrever o assunto ou a finalidade. | Aplicável | — |
| 2.4.7 | Focus Visible | AA | Todo elemento interativo deve ter foco visível, com contraste adequado, nos dois temas. | Aplicável | — |
| 2.4.11 | Focus Not Obscured (Minimum) | AA | O foco não pode ficar totalmente encoberto por toasts, loading overlay ou outros elementos criados pela interface. | Aplicável | — |
| 2.5.1 | Pointer Gestures | A | Não há gestos multiponto ou baseados em trajeto. | Não aplicável | A aplicação usa controles convencionais de ponteiro. |
| 2.5.2 | Pointer Cancellation | A | Ações devem ser acionadas de forma que permitam cancelamento ou não ocorram no `pointerdown`. | Aplicável | — |
| 2.5.3 | Label in Name | A | O nome acessível deve conter o texto visível do controle. | Aplicável | — |
| 2.5.4 | Motion Actuation | A | Não há acionamento por movimento do dispositivo. | Não aplicável | Não há funcionalidade baseada em sensor de movimento. |
| 2.5.7 | Dragging Movements | AA | Não há arrastar na versão de produção; o RF-073 permanece futuro. | Não aplicável | Nenhuma funcionalidade de produção exige arrastar. Se o RF-073 for implementado, o critério passa a ser aplicável. |
| 2.5.8 | Target Size (Minimum) | AA | Alvos de ponteiro devem ter pelo menos 24 × 24 CSS px, observadas as exceções do critério. | Aplicável | — |
| 3.1.1 | Language of Page | A | O documento usa `lang="pt-br"`; confirmar em todas as páginas. | Aplicável | — |
| 3.1.2 | Language of Parts | AA | Trechos em outro idioma devem ser marcados; termos estrangeiros isolados devem ser avaliados. | Aplicável | — |
| 3.2.1 | On Focus | A | Receber foco não deve mudar o contexto inesperadamente. | Aplicável | — |
| 3.2.2 | On Input | A | Alterar o valor de um campo não deve mudar o contexto sem aviso. | Aplicável | — |
| 3.2.3 | Consistent Navigation | AA | A navegação deve ser consistente entre páginas, quando existir. | Aplicável | — |
| 3.2.4 | Consistent Identification | AA | Componentes com a mesma função devem ser identificados de forma consistente. | Aplicável | — |
| 3.2.6 | Consistent Help | A | Mecanismos de ajuda, como recuperação de senha, devem manter posição e identificação consistentes quando repetidos. | Aplicável | — |
| 3.3.1 | Error Identification | A | Erros de formulário devem ser identificados em texto e associados ao campo. | Aplicável | — |
| 3.3.2 | Labels or Instructions | A | Campos devem ter labels, instruções e indicação de obrigatoriedade quando necessário. | Aplicável | — |
| 3.3.3 | Error Suggestion | AA | Quando possível, a mensagem deve sugerir a correção do erro. | Aplicável | — |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | AA | Verificar se cadastro, recuperação ou alteração de dados exigem confirmação, revisão ou reversão. | Aplicável | — |
| 3.3.7 | Redundant Entry | A | Não exigir reentrada de informação já fornecida no mesmo processo, salvo quando essencial. | Aplicável | — |
| 3.3.8 | Accessible Authentication (Minimum) | AA | A autenticação não deve exigir teste cognitivo e deve permitir colar senha e usar gerenciadores. | Aplicável | — |
| 4.1.2 | Name, Role, Value | A | Botões, diálogo, toast, loading e demais controles devem expor nome, função e estado. | Aplicável | — |
| 4.1.3 | Status Messages | AA | Erros, toasts, loading e outras mensagens dinâmicas devem ser anunciados sem mover o foco. | Aplicável | — |

### 4.3 Critérios não aplicáveis

Os critérios abaixo estão fora do escopo atual por ausência de conteúdo ou interação correspondente. A classificação deve ser revista se o produto incorporar mídia, gestos, movimento ou arrastar.

| Critério | Motivo |
|---|---|
| 1.2.1 a 1.2.5 | Não há áudio ou vídeo pré-gravado ou ao vivo. |
| 1.4.2 | Não há áudio reproduzido automaticamente. |
| 2.1.4 | Não há atalhos de caractere; `Esc` é a única tecla de comando identificada. |
| 2.5.1 | Não há gestos multiponto ou de trajeto. |
| 2.5.4 | Não há acionamento por movimento do dispositivo. |
| 2.5.7 | Não há arrastar na versão de produção; o RF-073 permanece futuro. |

### 4.4 Critérios novos da WCAG 2.2

A avaliação deve incluir os critérios introduzidos na WCAG 2.2:

- 2.4.11 Focus Not Obscured (Minimum) — AA.
- 2.5.7 Dragging Movements — AA, atualmente não aplicável.
- 2.5.8 Target Size (Minimum) — AA.
- 3.2.6 Consistent Help — A.
- 3.3.7 Redundant Entry — A.
- 3.3.8 Accessible Authentication (Minimum) — AA.

---

## 5. Métodos de avaliação

### 5.1 Avaliação automatizada

A camada automatizada prevista utiliza `axe-core` integrado ao Playwright por meio de `@axe-core/playwright`. A ferramenta identifica violações detectáveis automaticamente, como determinados problemas de nome, role, estrutura, labels e contraste calculável.

A automação deve ser usada como mecanismo de prevenção de regressões e como triagem inicial, não como prova de conformidade.

**Estado atual:** o axe-core não está instalado. A dependência não deve ser instalada nesta etapa. A adoção, a versão e a configuração serão avaliadas na Sprint dedicada.

**Limitações:**

- cobre apenas parte dos critérios WCAG;
- não valida sozinho ordem de foco, navegação por teclado, leitura por tecnologia assistiva, reflow, ampliação de texto ou anúncio dinâmico;
- pode produzir resultados incompletos que exigem revisão manual;
- não substitui a avaliação de páginas e processos completos.

### 5.2 Avaliação manual

A avaliação manual deve cobrir, no mínimo:

- navegação por teclado;
- visibilidade e contraste do foco;
- ordem de navegação;
- contraste de texto e de componentes;
- zoom e redimensionamento;
- formulários, labels, instruções e mensagens de erro;
- diálogos e notificações;
- estados de carregamento;
- títulos, headings e landmarks;
- tamanho de alvos de interação;
- comportamento nos temas claro e escuro;
- responsividade.

**Limitações:**

- depende da experiência e da consistência de quem avalia;
- exige repetição em navegadores, viewports e estados diferentes;
- pode variar conforme o ambiente e a versão do navegador;
- não cobre automaticamente todos os critérios.

### 5.3 Tecnologias assistivas

A referência inicial é o Orca no Ubuntu. A avaliação deve verificar:

- nomes acessíveis;
- funções e estados dos elementos;
- identificação de formulários;
- comunicação de erros;
- anúncio de alterações dinâmicas;
- comportamento dos diálogos;
- navegação por landmarks, headings e links;
- mensagens de loading e de status.

**Limitações:**

- um leitor de tela e um sistema operacional não representam todas as combinações possíveis;
- o comportamento pode variar entre navegadores e versões;
- a avaliação com tecnologia assistiva é manual e exige roteiro e registro;
- resultados de um ambiente não devem ser generalizados sem verificação complementar.

### 5.4 Combinação dos métodos

Os três métodos são complementares. Um critério só deve ser considerado aprovado quando houver evidência adequada ao seu tipo. Resultados automatizados podem apoiar a decisão, mas não substituem a verificação manual e com tecnologia assistiva quando o critério exige interação, percepção ou anúncio.

---

## 6. Matriz de avaliação

### 6.1 Estrutura

A matriz de avaliação deve ser preenchida nas etapas futuras com os seguintes campos:

| Campo | Descrição |
|---|---|
| Critério WCAG | Identificador do critério, por exemplo `1.4.3` |
| Nome | Nome oficial do critério |
| Nível | A ou AA |
| Aplicabilidade | Aplicável ou não aplicável |
| Método | Automatizado, manual ou tecnologia assistiva |
| Escopo | Página, componente, estado ou fluxo |
| Resultado | Aprovado, Reprovado, Não aplicável ou Não avaliado |
| Evidência | Referência ao teste, relatório, checklist ou registro |
| Observações | Justificativas e problemas encontrados |

Campos adicionais recomendados:

- identificador do problema, quando houver;
- severidade;
- data da avaliação;
- responsável;
- versão do ambiente.

### 6.2 Regras de preenchimento

- “Não avaliado” não conta como aprovação.
- “Não aplicável” exige justificativa.
- “Reprovado” deve ser usado quando o critério aplicável não for atendido.
- Não usar “Parcial” como resultado de critério; a conformidade por critério é binária.
- Cada resultado deve ter evidência verificável.
- Resultados automatizados devem ser revisados antes de serem convertidos em aprovação.
- A matriz deve ser atualizada sempre que houver nova avaliação ou correção relevante.

### 6.3 Modelo de linha

| Critério WCAG | Nome | Nível | Aplicabilidade | Método | Escopo | Resultado | Evidência | Observações |
|---|---|---|---|---|---|---|---|---|
| 1.4.3 | Contrast (Minimum) | AA | Aplicável | Automatizado e manual | `/login`, tema claro | Não avaliado | A preencher | A preencher |

---

## 7. Indicadores

### 7.1 Cobertura da avaliação

\[
\text{Cobertura} = \frac{\text{critérios avaliados}}{\text{critérios aplicáveis}} \times 100
\]

- **Critérios aplicáveis:** critérios marcados como aplicáveis, excluindo os não aplicáveis com justificativa.
- **Critérios avaliados:** critérios com resultado “Aprovado” ou “Reprovado”; “Não avaliado” não entra no numerador.

### 7.2 Taxa de aprovação

\[
\text{Aprovação} = \frac{\text{critérios aprovados}}{\text{critérios avaliados}} \times 100
\]

### 7.3 Limites dos indicadores

Os indicadores são instrumentos de acompanhamento, priorização e comunicação. Eles não substituem os requisitos formais de conformidade WCAG.

Não é permitido declarar conformidade com base apenas em percentuais, resultados automatizados ou cobertura parcial. A declaração exige que todos os critérios aplicáveis estejam aprovados ou justificadamente não aplicáveis, com evidências adequadas e revisão do escopo.

---

## 8. Resultados

### 8.1 Estado inicial

- A avaliação formal de acessibilidade ainda não foi concluída.
- A conformidade WCAG 2.2 AA não está declarada.
- A matriz de avaliação ainda não possui resultados.
- Não há relatório de auditoria concluído.
- Não há dependência de axe instalada.
- As correções e validações serão planejadas em Sprint futura.

### 8.2 Pontos de atenção preliminares

A análise técnica da FIX-017 identificou pontos que devem ser investigados na avaliação. Eles **não são resultados de auditoria** e não devem ser tratados como reprovações confirmadas:

- contraste de textos e componentes em determinados tokens e no tema escuro;
- ausência de títulos de página por rota;
- possível ausência de `aria-invalid` e de estado obrigatório explícito nos formulários;
- mensagens de erro e sucesso sem anúncio dinâmico consistente;
- estrutura incompleta do dashboard, sem `main` e heading principal;
- gerenciamento de foco após navegação e em diálogos;
- comportamento de toasts, loading overlay e mensagens de status;
- tamanho de alvos de interação, especialmente o botão de mostrar ou ocultar senha;
- uso de `autocomplete` inadequado no cadastro e ausência de instruções de senha;
- possíveis diferenças de foco e contraste entre os temas claro e escuro.

Esses pontos devem ser confirmados com os métodos definidos neste documento e registrados na matriz apenas após a avaliação.

---

## 9. Problemas identificados

Os problemas encontrados nas avaliações futuras devem ser registrados de forma rastreável. Cada registro poderá conter:

| Campo | Descrição |
|---|---|
| Identificador | Identificador único, por exemplo `A11Y-001` |
| Critério WCAG | Critério relacionado |
| Descrição | Comportamento observado |
| Severidade | Bloqueador de conformidade, alto, médio ou baixo |
| Evidência | Teste, checklist ou registro que demonstra o problema |
| Recomendação | Correção sugerida |
| Referência à FIX | FIX de correção, quando criada |
| Status | Aberto, em correção, corrigido ou não aplicável |

A severidade deve considerar o impacto para pessoas usuárias e o efeito sobre a conformidade. Um problema que impede o atendimento de um critério aplicável é, no mínimo, um bloqueador de conformidade, independentemente da complexidade técnica da correção.

Nenhum problema de auditoria está registrado nesta etapa. Os pontos de atenção da seção 8.2 são preliminares.

---

## 10. Evidências

As evidências devem permitir verificar o resultado sem depender de memória ou de contexto informal. Serão aceitos:

- resultados de testes automatizados, com nome do teste, arquivo, navegador, data e versão;
- checklists manuais preenchidos, com passos, resultado esperado, resultado observado, avaliador e data;
- registros de testes com tecnologia assistiva, incluindo versão do leitor de tela, sistema, navegador, página e anúncio observado;
- referências a relatórios, arquivos de teste e registros versionados;
- versões dos navegadores e do ambiente;
- data e responsável pela avaliação.

**Capturas de tela e gravações não são evidências obrigatórias.** Registros textuais, relatórios automatizados e referências aos testes são suficientes como formato documental inicial, desde que permitam verificar o resultado. Capturas podem ser usadas como complemento quando disponíveis, sem se tornarem requisito.

As evidências devem ser referenciadas na matriz de avaliação e no histórico.

---

## 11. Histórico

### 11.1 Histórico de avaliações

| Data | Escopo | Métodos | Resultado | Responsável | Evidência |
|---|---|---|---|---|---|
| — | — | — | Avaliação não iniciada | — | — |

### 11.2 Histórico de alterações do documento

| Data | Versão | Alteração | Responsável |
|---|---|---|---|
| 2026-11-09 | 1.0 | Criação do documento; definição do padrão WCAG 2.2 AA, escopo, critérios, métodos, matriz, indicadores e estrutura de evidências. Conformidade não declarada. | Responsável pelo projeto |

---

## 12. Referências

- W3C. Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/
- `docs/requirements/requirements.md` — RNF-022 e requisitos relacionados.
- `docs/testing/e2e-strategy.md` — estratégia de testes E2E.
- `docs/ui/design-system/08-Estados.md` — orientações de foco, erro e estados.
- `docs/adr/ADR-023-playwright-e2e-testing.md` — decisão sobre Playwright.
- `docs/sprints/sprint-planning.md` — planejamento das Sprints.
