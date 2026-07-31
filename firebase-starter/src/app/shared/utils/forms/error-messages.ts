import { AbstractControl } from '@angular/forms';

import { VALIDATION_ERRORS, ValidationError } from './validator-errors';

type AngularValidationError =
  | 'required'
  | 'email'
  | 'minlength'
  | 'maxlength'
  | 'min'
  | 'max'
  | 'pattern';

type ErrorKey = AngularValidationError | ValidationError;

type ErrorMessage = (label: string, error?: unknown) => string;

const ERROR_MESSAGES: Record<ErrorKey, ErrorMessage> = {

  required: (label) => `${label} é obrigatório.`,

  email: () => 'E-mail inválido.',

  minlength: (label, error) => {
    const { requiredLength } = error as {
      requiredLength: number;
    };

    return `${label} deve possuir no mínimo ${requiredLength} caracteres.`;

  },

  maxlength: (label, error) => {
    const { requiredLength } = error as {
      requiredLength: number;
    };

    return `${label} deve possuir no máximo ${requiredLength} caracteres.`;

  },

  min: (label, error) => {
    const { min } = error as {
      min: number;
    };

    return `${label} deve ser maior ou igual a ${min}.`;

  },

  max: (label, error) => {

    const { max } = error as {
      max: number;
    };

    return `${label} deve ser menor ou igual a ${max}.`;

  },

  pattern: (label) => `${label} possui um formato inválido.`,

  [VALIDATION_ERRORS.CPF]: () => 'CPF inválido.',

  [VALIDATION_ERRORS.CNPJ]: () => 'CNPJ inválido.',

  [VALIDATION_ERRORS.CPF_OR_CNPJ]: () => 'CPF ou CNPJ inválido.',

  [VALIDATION_ERRORS.CEP]: () => 'CEP inválido.',

  [VALIDATION_ERRORS.PHONE]: () => 'Telefone inválido.',

  [VALIDATION_ERRORS.MOBILE_PHONE]: () => 'Celular inválido.',

  [VALIDATION_ERRORS.EQUALS_TO]: () => 'Os valores informados não coincidem.',

  [VALIDATION_ERRORS.CHECKBOX_REQUIRED]: () => 'Este campo deve ser marcado.',

};

/**
 * Obtém a mensagem do primeiro erro encontrado.
 */
export function getControlErrorMessage(
  control: AbstractControl | null,
  label: string,
): string | null {

  if (!control || !control.errors) {
    return null;
  }

  const firstError = Object.entries(control.errors)[0];

  if (!firstError) {
    return null;
  }

  const [key, value] = firstError;

  if (!isKnownErrorKey(key)) {
    return null;
  }

  const message = ERROR_MESSAGES[key];

  return message
    ? message(label, value)
    : null;

}

function isKnownErrorKey(key: string): key is ErrorKey {
  return key in ERROR_MESSAGES;
}