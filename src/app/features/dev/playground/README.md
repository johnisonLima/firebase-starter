# Playground

O Playground é uma ferramenta exclusiva para desenvolvimento. Seu objetivo é validar manualmente integrações com serviços externos, infraestrutura e componentes reutilizáveis antes da criação de testes automatizados ou fluxos E2E.

Cada nova funcionalidade da infraestrutura pode receber uma seção no Playground para facilitar validações rápidas durante o desenvolvimento.

---

## Princípios

- Não contém regras de negócio.
- Não substitui testes unitários.
- Não substitui testes E2E.
- Deve ser mantido simples.
- Pode crescer junto com o projeto.

---

## Seções do Playground

### Firestore

- [x] Create
- [x] FindById
- [x] FindAll
- [x] Update
- [x] Delete

### Authentication

- [ ] Login
- [ ] Logout
- [ ] Refresh
- [ ] Verify Email

### Storage

- [ ] Upload
- [ ] Download

### Cloud Functions

- [ ] Execute

### Notifications

- [ ] Test Toast

### Dialogs

- [ ] Confirm
- [ ] Alert