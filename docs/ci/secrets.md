# Secrets do CI

Este documento descreve os secrets necessários para os workflows de CI do Firebase Starter.

Os valores dos secrets nunca devem ser armazenados neste documento, enviados ao repositório ou expostos nos logs dos workflows.

## 1. Visão geral

O pipeline de CI utiliza GitHub Actions para executar o build da aplicação, os testes unitários, o type-check dos testes Playwright e os testes end-to-end (E2E).

Alguns cenários E2E exigem autenticação com uma conta de teste dedicada. As credenciais correspondentes são armazenadas como secrets do GitHub Actions.

## 2. Secrets necessários

| Secret | Finalidade | Utilizado por | Status |
|---|---|---|---|
| `E2E_USER_EMAIL` | Endereço de e-mail da conta utilizada nos testes E2E | Testes E2E com Playwright | Configurado; validado em execuções anteriores |
| `E2E_USER_PASSWORD` | Senha da conta utilizada nos testes E2E | Testes E2E com Playwright | Configurado; validado em execuções anteriores |

### Escopo

Os secrets estão configurados no repositório GitHub.

Local de configuração:

`Settings → Secrets and variables → Actions → Secrets`

## 3. Utilização

Os secrets são disponibilizados como variáveis de ambiente no job `e2e` do arquivo `.github/workflows/ci.yml`:

```yaml
e2e:
  needs: verify
  if: needs.verify.outputs.e2e_enabled == 'true'

  steps:
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        E2E_USER_EMAIL: ${{ secrets.E2E_USER_EMAIL }}
        E2E_USER_PASSWORD: ${{ secrets.E2E_USER_PASSWORD }}
```

Antes disso, o job `verify` verifica a disponibilidade dos dois secrets em um passo com `env` e publica `e2e_enabled` em `$GITHUB_OUTPUT`. O job `e2e` só executa quando o valor é `true`.

As credenciais são utilizadas pelo projeto `setup` do Playwright, que realiza o login real pela interface e gera `test-results/auth-state.json` para reutilização nos três navegadores. A conta dedicada deve estar com o e-mail verificado.

Elas não devem ser disponibilizadas para etapas do workflow que não precisam delas.

### 3.1 Secrets indisponíveis

Quando `E2E_USER_EMAIL` ou `E2E_USER_PASSWORD` não estão disponíveis, o workflow:

- emite um warning;
- registra no `$GITHUB_STEP_SUMMARY` que a suíte E2E foi ignorada;
- mantém a execução de build, testes unitários e type-check;
- marca o job `e2e` como `skipped`.

Esse é o comportamento esperado em Pull Requests de fork e de Dependabot, que não recebem secrets do repositório. O workflow não utiliza `pull_request_target`.

## 4. Requisitos de segurança

Os seguintes requisitos devem ser observados para todos os secrets do CI:

- Nunca enviar valores de secrets ao repositório.
- Nunca imprimir valores de secrets nos logs dos workflows.
- Nunca incluir credenciais em mensagens de erro, capturas de tela ou relatórios de testes.
- Evitar disponibilizar secrets para workflows acionados por pull requests não confiáveis.
- Utilizar contas dedicadas para testes, evitando contas pessoais.
- Revisar a utilização dos secrets sempre que os workflows do CI forem modificados.

O GitHub Actions mascara automaticamente secrets registrados nos logs. Entretanto, esse mascaramento não deve ser considerado uma substituição para impedir que informações sensíveis sejam impressas.

## 5. Validação

As seguintes verificações foram realizadas para os secrets E2E:

| Verificação | Resultado |
|---|---|
| Secrets necessários configurados no GitHub | Aprovado em execuções anteriores |
| Conta E2E disponível e verificada | Aprovado em execuções anteriores |
| Testes E2E autenticados executados localmente | Aprovado na FIX-020 |
| Execução normal do workflow no GitHub Actions | Aprovado na FIX-020 |
| Comportamento em Pull Requests de fork e de Dependabot sem secrets | Não validado diretamente |
| Configuração do workflow revisada | Aprovado |
| Logs revisados quanto à exposição de secrets | Aprovado em execuções anteriores |

Os secrets foram configurados e utilizados com sucesso em execuções anteriores do workflow. A estrutura de jobs `verify` e `e2e` e a execução condicional por secrets introduzidas na FIX-020 foram validadas com sucesso na execução normal do workflow no GitHub Actions. O comportamento em Pull Requests de fork e de Dependabot sem secrets não foi validado diretamente.

## 6. Manutenção

Sempre que um novo secret for introduzido:

1. Adicionar seu nome, finalidade e utilização a este documento.
2. Configurar o secret no escopo apropriado do GitHub Actions.
3. Garantir que o workflow utilize o secret de forma segura.
4. Validar a execução do CI relacionada.
5. Revisar os logs para garantir que nenhum valor secreto seja exposto.
6. Revisar o comportamento do workflow quando os secrets não estiverem disponíveis.

Este documento deve conter apenas metadados dos secrets, nunca seus valores.
