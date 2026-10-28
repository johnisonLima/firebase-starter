# 04 — Espaçamento

O Firebase Starter utiliza a escala de espaçamento fornecida pelo
Tailwind CSS como referência padrão para a construção da interface.

Não é criada uma escala de espaçamento própria enquanto os valores
disponibilizados pelo Tailwind atenderem às necessidades dos
componentes.

## 04.1 — Escala

O espaçamento deve ser definido preferencialmente utilizando as
classes de espaçamento do Tailwind.

Exemplos:

```html
<div class="p-4">
  ...
</div>

<div class="flex gap-4">
  ...
</div>

<section class="py-8">
  ...
</section>

Não criar uma escala de espaçamento paralela ao Tailwind enquanto a escala existente atender às necessidades do projeto.