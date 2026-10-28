/**
 * Quantidade de caracteres sem os dígitos verificadores.
 */
const CNPJ_LENGTH = 12;

/**
 * Quantidade total de caracteres do CNPJ.
 */
const CNPJ_WITH_DV_LENGTH = 14;

/**
 * Base dos pesos utilizada pelo módulo 11.
 */
const MAX_WEIGHT = 9;

/**
 * Remove máscara e normaliza o valor.
 */
export function normalizeCnpj(value: string): string {

  return value
    .trim()
    .toUpperCase()
    .replace(/[.\-\/\s]/g, '');

}

/**
 * Converte um caractere em seu valor para cálculo do DV.
 *
 * Conforme especificação oficial:
 * valor = código ASCII - 48
 */
function charToValue(char: string): number {

  return char.charCodeAt(0) - 48;

}

/**
 * Verifica se todos os caracteres são iguais.
 */
function isRepeated(value: string): boolean {

  return new Set(value).size === 1;

}

/**
 * Calcula o peso de uma posição.
 *
 * Os pesos são distribuídos da direita para a esquerda
 * variando de 2 até 9.
 */
function getWeight(positionFromRight: number): number {

  return (positionFromRight % (MAX_WEIGHT - 1)) + 2;

}

/**
 * Calcula um dígito verificador.
 */
function calculateCheckDigit(value: string): number {

  let sum = 0;

  for (let i = value.length - 1, position = 0; i >= 0; i--, position++) {

    sum += charToValue(value[i]) * getWeight(position);

  }

  const remainder = sum % 11;

  return remainder < 2
    ? 0
    : 11 - remainder;

}

/**
 * Calcula os dois dígitos verificadores.
 */
function calculateCheckDigits(base: string): string {

  const firstDigit = calculateCheckDigit(base);

  const secondDigit = calculateCheckDigit(
    base + firstDigit,
  );

  return `${firstDigit}${secondDigit}`;

}

/**
 * Valida um CNPJ numérico ou alfanumérico.
 */
export function isValidCnpj(value: string): boolean {

  const cnpj = normalizeCnpj(value);

  if (cnpj.length !== CNPJ_WITH_DV_LENGTH) {
    return false;
  }

  if (isRepeated(cnpj)) {
    return false;
  }

  const base = cnpj.slice(0, CNPJ_LENGTH);

  const dv = cnpj.slice(CNPJ_LENGTH);

  return calculateCheckDigits(base) === dv;

}