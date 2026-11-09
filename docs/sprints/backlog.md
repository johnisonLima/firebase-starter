# Backlog futuro

Este documento registra itens futuros que ainda não fazem parte de uma Sprint. Ele diferencia requisitos já catalogados, itens específicos ainda não catalogados e pendências de escopo que não estão aprovadas para execução.

## Requisitos futuros catalogados

- Dashboard com indicadores e estatísticas — RF-070.
- Compressão de imagens — RF-071.
- Upload com progresso — RF-072.
- Drag & drop de arquivos — RF-073.

## Itens futuros específicos ainda não catalogados

- **Implementar a validação do Firebase ID Token no backend da futura API utilizando o Firebase Admin SDK.** O `AuthInterceptor` do frontend restringe o envio do token a origens confiáveis, mas essa medida não garante, por si só, que as requisições recebidas pela API sejam legítimas. Quando a API própria for desenvolvida, o backend deverá verificar a autenticidade e a validade do token antes de autorizar o acesso aos recursos protegidos, evitando confiar apenas no token enviado pelo cliente.

## Pendências de escopo não aprovadas para execução

Os itens abaixo não possuem priorização, escopo detalhado nem critérios de aceite. Eles não são requisitos aprovados e dependem de definição do responsável pelo projeto antes de qualquer planejamento ou implementação.

- Otimizações de performance.
- Melhorias adicionais de interface.
- Melhorias na listagem.
- Avaliação de novos recursos do Firebase.
