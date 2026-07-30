/**
 * Chaves de erro utilizadas pelos validadores da aplicação.
 */
export const VALIDATION_ERRORS = {

  CPF: 'cpf',

  CNPJ: 'cnpj',

  CPF_OR_CNPJ: 'cpfOrCnpj',

  CEP: 'cep',

  PHONE: 'phone',

  MOBILE_PHONE: 'mobilePhone',

  EQUALS_TO: 'equalsTo',

  CHECKBOX_REQUIRED: 'checkboxRequired',

} as const;


/**
 * Nomes das constantes de erro.
 *
 * Exemplo:
 * 'CPF' | 'CNPJ' | 'CPF_OR_CNPJ' | ...
 */
export type ValidationErrorKey =
  keyof typeof VALIDATION_ERRORS;

/**
 * Valores das chaves de erro.
 *
 * Exemplo:
 * 'cpf' | 'cnpj' | 'cpfOrCnpj' | ...
 */
export type ValidationError =
  (typeof VALIDATION_ERRORS)[ValidationErrorKey];

