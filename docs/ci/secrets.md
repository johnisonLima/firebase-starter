# Secrets do CI

Este documento descreve os secrets necessários para os workflows de CI do Firebase Starter.

Os valores dos secrets nunca devem ser armazenados neste documento, enviados ao repositório ou expostos nos logs dos workflows.

## 1. Visão geral

O pipeline de CI utiliza GitHub Actions para executar o build da aplicação, os testes unitários e os testes end-to-end (E2E).

Alguns cenários E2E exigem autenticação com uma conta de teste dedicada. As credenciais correspondentes são armazenadas como secrets do GitHub Actions.

## 2. Secrets necessários

| Secret | Finalidade | Utilizado por | Status |
|---|---|---|---|
| `E2E_USER_EMAIL` | Endereço de e-mail da conta utilizada nos testes E2E | Testes E2E com Playwright | Configurado e validado |
| `E2E_USER_PASSWORD` | Senha da conta utilizada nos testes E2E | Testes E2E com Playwright | Configurado e validado |

### Escopo

Os secrets estão configurados no repositório GitHub.

Local de configuração:

`Settings → Secrets and variables → Actions → Secrets`

## 3. Utilização

Os secrets são disponibilizados como variáveis de ambiente na etapa de execução dos testes E2E do arquivo:

`.github/workflows/ci.yml`

```yaml
- name: Run E2E tests
  run: npm run test:e2e
  env:
    E2E_USER_EMAIL: ${{ secrets.E2E_USER_EMAIL }}
    E2E_USER_PASSWORD: ${{ secrets.E2E_USER_PASSWORD }}
```

As credenciais são utilizadas pelos testes Playwright que necessitam de autenticação.

Elas não devem ser disponibilizadas para etapas do workflow que não precisam delas.

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
| Secrets necessários configurados no GitHub | Aprovado |
| Conta E2E disponível e verificada | Aprovado |
| Testes E2E autenticados executados com sucesso | Aprovado |
| Configuração do workflow revisada | Aprovado |
| Logs revisados quanto à exposição de secrets | Aprovado |

O workflow de CI foi executado com sucesso, sem exposição dos valores dos secrets.

## 6. Manutenção

Sempre que um novo secret for introduzido:

1. Adicionar seu nome, finalidade e utilização a este documento.
2. Configurar o secret no escopo apropriado do GitHub Actions.
3. Garantir que o workflow utilize o secret de forma segura.
4. Validar a execução do CI relacionada.
5. Revisar os logs para garantir que nenhum valor secreto seja exposto.

Este documento deve conter apenas metadados dos secrets, nunca seus valores.