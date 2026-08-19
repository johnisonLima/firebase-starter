# Decisão 017

### Título

Diferenciação entre Loading Global e Loading Local

### Contexto

O sistema possui diferentes necessidades para representação do estado de carregamento.

Operações que afetam a aplicação como um todo podem exigir que o usuário aguarde sua conclusão e, nesse caso, a interação com a interface deve ser temporariamente bloqueada.

Por outro lado, operações restritas a um componente específico, como o envio de um formulário através de um botão, não devem impedir que o usuário continue interagindo com as demais partes da aplicação.

Dessa forma, é necessário estabelecer uma distinção clara entre o comportamento do **Loading Global** e dos **Loadings Locais**.

### Alternativas consideradas

**1. Todos os loadings bloquearem a interface**

Qualquer indicador de loading utilizado na aplicação bloquearia a interação do usuário.

**Vantagens**

* Comportamento uniforme.
* Implementação mais simples.

**Desvantagens**

* Reduz desnecessariamente a interação do usuário.
* Operações locais poderiam bloquear funcionalidades não relacionadas.
* Piora a experiência de uso em operações independentes.

---

**2. Nenhum loading bloquear a interface**

Todos os indicadores seriam apenas visuais, sem impedir interações.

**Vantagens**

* Maior liberdade de interação.
* Implementação simples.

**Desvantagens**

* Operações globais poderiam receber novas interações enquanto ainda estão em andamento.
* Possibilidade de ações duplicadas ou inconsistentes.
* Não representa adequadamente operações que exigem exclusividade temporária da interface.

---

**3. Comportamentos diferentes para Loading Global e Local (Escolhido)**

O Loading Global utilizará um Overlay fullscreen que bloqueia a interação da aplicação, enquanto Loadings Locais permanecerão restritos ao componente responsável pela operação e não bloquearão a interface.

### Decisão

O sistema adotará **dois comportamentos distintos de loading**.

O **Loading Global** utilizará um **Overlay fullscreen** e bloqueará a interação da aplicação enquanto houver pelo menos uma operação global em andamento.

```text
Loading Global
    ↓
Overlay fullscreen
    ↓
Bloqueia interação
```

Os **Loadings Locais**, como o loading utilizado em botões, permanecerão restritos ao componente responsável pela operação e **não bloquearão a interface da aplicação**.

```text
Loading Local
    ↓
Componente específico
    ↓
Não bloqueia interação global
```

Essa distinção garante que o bloqueio da interface seja utilizado somente quando a natureza da operação justificar esse comportamento.

### Consequências

#### Positivas

✔ Operações globais podem impedir interações potencialmente conflitantes.

✔ Loadings locais não interrompem desnecessariamente a utilização da aplicação.

✔ Melhora a experiência do usuário em operações independentes.

✔ Define claramente a responsabilidade de cada tipo de loading.

✔ Permite que múltiplas operações locais ocorram sem bloquear a interface inteira.

✔ Mantém o Loading Global como mecanismo de bloqueio quando necessário.

#### Negativas

✖ A aplicação precisa manter dois comportamentos distintos de loading.

✖ O desenvolvedor precisa escolher corretamente entre Loading Global e Loading Local.

✖ O Overlay global exige cuidados adicionais com acessibilidade e gerenciamento da interação durante o bloqueio.

### Data

19/08/2026
