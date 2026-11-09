**# Backlog futuro**

Os itens abaixo permanecem disponíveis para avaliação em futuras sprints.

- Dashboard com indicadores e estatísticas.
- Otimizações de performance.
- Melhorias adicionais de interface.
- Compressão de imagens.
- Upload com progresso.
- Drag & Drop.
- Avaliação de novos recursos do Firebase.
- **Implementar a validação do Firebase ID Token no backend da futura API utilizando o Firebase Admin SDK.** O `AuthInterceptor` do frontend restringe o envio do token a origens confiáveis, mas essa medida não garante, por si só, que as requisições recebidas pela API sejam legítimas. Quando a API própria for desenvolvida, o backend deverá verificar a autenticidade e a validade do token antes de autorizar o acesso aos recursos protegidos, evitando confiar apenas no token enviado pelo cliente.