import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import {
  isValidCnpj,
  isValidCpf,
} from '../documents';

import { VALIDATION_ERRORS } from './validator-errors';

/**
 * Valida um CPF.
 */
export function cpfValidator(): ValidatorFn {

  return (
    control: AbstractControl,
  ): ValidationErrors | null => {

    if (control.disabled || !control.value) {
      return null;
    }

    const value = String(control.value);

    return isValidCpf(value)
      ? null
      : {
          [VALIDATION_ERRORS.CPF]: true,
        };

  };

}

/**
 * Valida um CNPJ.
 */
export function cnpjValidator(): ValidatorFn {

  return (
    control: AbstractControl,
  ): ValidationErrors | null => {

    if (control.disabled || !control.value) {
      return null;
    }

    const value = String(control.value);

    return isValidCnpj(value)
      ? null
      : {
          [VALIDATION_ERRORS.CNPJ]: true,
        };

  };

}

/**
 * Valida CPF ou CNPJ.
 */
export function cpfOrCnpjValidator(): ValidatorFn {

  return (
    control: AbstractControl,
  ): ValidationErrors | null => {

    if (control.disabled || !control.value) {
      return null;
    }

    const value = String(control.value);

    if (isValidCpf(value) || isValidCnpj(value)) {
      return null;
    }

    return {
      [VALIDATION_ERRORS.CPF_OR_CNPJ]: true,
    };

  };

}

/**
 * Valida se dois campos possuem o mesmo valor.
 */
export function equalsToValidator(
  otherControlName: string,
): ValidatorFn {

  return (
    control: AbstractControl,
  ): ValidationErrors | null => {

    if (!control.parent) {
      return null;
    }

    const otherControl =
      control.parent.get(otherControlName);

    if (!otherControl) {
      return null;
    }

    if (control.value === otherControl.value) {
      return null;
    }

    return {
      [VALIDATION_ERRORS.EQUALS_TO]: true,
    };

  };

}