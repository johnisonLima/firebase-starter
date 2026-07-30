/**
 * Quantidade de dígitos do CPF sem os verificadores.
 */
const CPF_LENGTH = 9;

/**
 * Quantidade total de dígitos do CPF.
 */
const CPF_WITH_DV_LENGTH = 11;

/**
 * Remove todos os caracteres que não são números.
 */
export function normalizeCpf(value: string): string {

  return value
    .trim()
    .replace(/\D/g, '');

}

/**
 * Verifica se todos os dígitos são iguais.
 */
function isRepeated(value: string): boolean {

  return new Set(value).size === 1;

}

/**
 * Calcula um dígito verificador.
 */
function calculateCheckDigit(
  value: string,
  initialWeight: number,
): number {

  let sum = 0;

  for (let i = 0; i < value.length; i++) {

    sum += Number(value[i]) * (initialWeight - i);

  }

  const remainder = sum % 11;

  return remainder < 2
    ? 0
    : 11 - remainder;

}

/**
 * Calcula os dois dígitos verificadores.
 */
function calculateCheckDigits(
  base: string,
): readonly [number, number] {

  const firstDigit = calculateCheckDigit(
    base,
    10,
  );

  const secondDigit = calculateCheckDigit(
    `${base}${firstDigit}`,
    11,
  );

  return [
    firstDigit,
    secondDigit,
  ] as const;

}

/**
 * Valida um CPF.
 */
export function isValidCpf(value: string): boolean {

  const cpf = normalizeCpf(value);

  if (cpf.length !== CPF_WITH_DV_LENGTH) {
    return false;
  }

  if (isRepeated(cpf)) {
    return false;
  }

  const base = cpf.slice(0, CPF_LENGTH);

  const dv = cpf.slice(CPF_LENGTH);

  const [dv1, dv2] = calculateCheckDigits(base);

  return dv === `${dv1}${dv2}`;

}