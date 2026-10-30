# Instruções para agentes de programação

## Contexto e stack

Este repositório é uma aplicação Angular 21 e TypeScript integrada ao Firebase SDK. A interface usa Tailwind CSS 4 e Spartan UI; os testes usam Vitest e Playwright. Consulte `package.json` e a configuração atual antes de assumir versões, comandos ou integrações.

## Arquitetura

- Preserve a organização existente em `src/app/core` (infraestrutura e serviços globais), `src/app/features` (funcionalidades) e `src/app/shared` (recursos reutilizados entre funcionalidades).
- Use componentes standalone e Angular Signals de acordo com os padrões existentes. Mantenha responsabilidades separadas e dependências direcionadas conforme a arquitetura documentada e o código atual.
- Antes de criar algo, procure componentes, serviços, providers, utilitários e padrões equivalentes já existentes. Evite abstrações, dependências e estruturas sem necessidade concreta.
- Não presuma funcionalidades só por aparecerem no roadmap ou na documentação. Confirme sua implementação no código.

## Decisões arquiteturais (ADRs)

Antes de uma mudança arquitetural ou que afete padrões definidos, consulte `docs/Architecture-v1.0.md` e as ADRs relevantes em `docs/adr/` (atualmente até ADR-023). Não contradiga nem altere silenciosamente uma decisão aprovada. Se uma mudança relevante exigir outra abordagem, explique a necessidade e proponha registrar uma nova ADR; não edite ADRs existentes sem solicitação explícita.

## Implementação

- Examine o código e as configurações relacionados antes de editar; limite as alterações ao pedido.
- Reutilize componentes e serviços existentes e siga as convenções observadas no código, sem introduzir dependências ou abstrações desnecessárias.
- Preserve acessibilidade, semântica HTML, tipagem estrita e consistência visual. Em testes E2E, prefira roles, labels e nomes acessíveis a seletores ligados à estrutura ou ao CSS.
- Explique o plano antes de mudanças relevantes. Se faltar informação essencial que não possa ser inferida do repositório, pergunte antes de tomar uma decisão de alto impacto.

## Qualidade e verificações

- Execute os testes e o build pertinentes às alterações, usando os scripts existentes (`npm run test:unit`, `npm run test:e2e` e `npm run build`, conforme aplicável). Não afirme que uma verificação passou sem executá-la.
- Ao concluir, informe os arquivos alterados, as verificações executadas e seus resultados. Registre também verificações que não puderam ser executadas e o motivo.

## Documentação

Mantenha a documentação coerente com o comportamento implementado. Roadmaps e planos de sprint representam trabalho planejado; não marque funcionalidades como concluídas sem confirmação no código ou em outra evidência verificável. Consulte a Architecture v1.0 e as ADRs sem duplicar seu conteúdo neste arquivo.

## Segurança

- Nunca revele, registre em logs ou versione segredos, tokens, senhas ou credenciais. Não leia nem exiba o conteúdo de `.env` sem necessidade direta para uma tarefa autorizada; prefira verificar a existência e os nomes das configurações sem imprimir seus valores.
- Não inclua `.env` em commits nem enfraqueça regras que o excluem do controle de versão.
- Não altere projetos, dados, regras, configurações ou outros recursos remotos do Firebase sem autorização explícita do usuário para essa alteração.
- Não executar comandos destrutivos ou operações irreversíveis fora do escopo solicitado sem explicar os riscos e obter autorização.

## Git e controle de versão

- Preserve alterações locais preexistentes do usuário; não as sobrescreva nem descarte sem autorização.
- Não execute git reset --hard, git clean, git checkout para descartar alterações ou comandos equivalentes sem autorização explícita.
- Não crie commits nem faça push sem solicitação do usuário.