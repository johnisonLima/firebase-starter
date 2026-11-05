import { FormControl } from '@angular/forms';

import { describe, expect, it } from 'vitest';

import { getControlErrorMessage } from './error-messages';

import { VALIDATION_ERRORS } from './validator-errors';

function expectMessage(errors: Record<string, unknown>, label: string, expected: string): void {
  const control = new FormControl('');

  control.setErrors(errors);

  expect(getControlErrorMessage(control, label)).toBe(expected);
}

describe('error-messages', () => {
  describe('erros nativos do Angular', () => {
    it('deve formatar required com o label informado', () => {
      expectMessage({ required: true }, 'Nome', 'Nome é obrigatório.');
    });

    it('deve formatar email', () => {
      expectMessage({ email: true }, 'E-mail', 'E-mail inválido.');
    });

    it('deve formatar minlength com o tamanho mínimo', () => {
      expectMessage(
        {
          minlength: {
            requiredLength: 3,
          },
        },
        'Senha',
        'Senha deve possuir no mínimo 3 caracteres.',
      );
    });

    it('deve formatar maxlength com o tamanho máximo', () => {
      expectMessage(
        {
          maxlength: {
            requiredLength: 20,
          },
        },
        'Nome',
        'Nome deve possuir no máximo 20 caracteres.',
      );
    });

    it('deve formatar min com o valor mínimo', () => {
      expectMessage(
        {
          min: {
            min: 1,
          },
        },
        'Idade',
        'Idade deve ser maior ou igual a 1.',
      );
    });

    it('deve formatar max com o valor máximo', () => {
      expectMessage(
        {
          max: {
            max: 10,
          },
        },
        'Idade',
        'Idade deve ser menor ou igual a 10.',
      );
    });

    it('deve formatar pattern com o label informado', () => {
      expectMessage({ pattern: true }, 'CEP', 'CEP possui um formato inválido.');
    });
  });

  describe('mensagens customizadas da aplicação', () => {
    it('deve retornar a mensagem de CPF', () => {
      expectMessage({ [VALIDATION_ERRORS.CPF]: true }, 'Documento', 'CPF inválido.');
    });

    it('deve retornar a mensagem de CNPJ', () => {
      expectMessage({ [VALIDATION_ERRORS.CNPJ]: true }, 'Documento', 'CNPJ inválido.');
    });

    it('deve retornar a mensagem de CPF ou CNPJ', () => {
      expectMessage(
        { [VALIDATION_ERRORS.CPF_OR_CNPJ]: true },
        'Documento',
        'CPF ou CNPJ inválido.',
      );
    });

    it('deve retornar a mensagem de CEP', () => {
      expectMessage({ [VALIDATION_ERRORS.CEP]: true }, 'Endereço', 'CEP inválido.');
    });

    it('deve retornar a mensagem de telefone', () => {
      expectMessage({ [VALIDATION_ERRORS.PHONE]: true }, 'Telefone', 'Telefone inválido.');
    });

    it('deve retornar a mensagem de celular', () => {
      expectMessage({ [VALIDATION_ERRORS.MOBILE_PHONE]: true }, 'Celular', 'Celular inválido.');
    });

    it('deve retornar a mensagem de valores diferentes', () => {
      expectMessage(
        { [VALIDATION_ERRORS.EQUALS_TO]: true },
        'Confirmação',
        'Os valores informados não coincidem.',
      );
    });

    it('deve retornar a mensagem de checkbox obrigatório', () => {
      expectMessage(
        { [VALIDATION_ERRORS.CHECKBOX_REQUIRED]: true },
        'Termos',
        'Este campo deve ser marcado.',
      );
    });
  });

  describe('ausência de mensagem', () => {
    it('deve retornar null para controle nulo', () => {
      expect(getControlErrorMessage(null, 'Nome')).toBeNull();
    });

    it('deve retornar null para controle sem erros', () => {
      const control = new FormControl('');

      expect(getControlErrorMessage(control, 'Nome')).toBeNull();
    });

    it('deve retornar null para objeto de erros vazio', () => {
      const control = new FormControl('');

      control.setErrors({});

      expect(getControlErrorMessage(control, 'Nome')).toBeNull();
    });

    it('deve retornar null para chave desconhecida', () => {
      const control = new FormControl('');

      control.setErrors({
        unknown: true,
      });

      expect(getControlErrorMessage(control, 'Nome')).toBeNull();
    });
  });

  describe('múltiplos erros', () => {
    it('deve retornar a mensagem do primeiro erro', () => {
      const control = new FormControl('');

      control.setErrors({
        required: true,
        minlength: {
          requiredLength: 3,
        },
      });

      expect(getControlErrorMessage(control, 'Nome')).toBe('Nome é obrigatório.');
    });

    it('deve respeitar a ordem de inserção dos erros', () => {
      const control = new FormControl('');

      control.setErrors({
        [VALIDATION_ERRORS.CPF]: true,
        required: true,
      });

      expect(getControlErrorMessage(control, 'Documento')).toBe('CPF inválido.');
    });
  });
});
