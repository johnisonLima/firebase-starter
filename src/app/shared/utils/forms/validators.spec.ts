import { FormControl, FormGroup } from '@angular/forms';

import { describe, expect, it } from 'vitest';

import { VALIDATION_ERRORS } from './validator-errors';

import { cnpjValidator, cpfOrCnpjValidator, cpfValidator, equalsToValidator } from './validators';

const VALID_CPF = '52998224725';
const VALID_MASKED_CPF = '529.982.247-25';
const INVALID_CPF = '52998224724';

const VALID_CNPJ = '11444777000161';
const VALID_ALPHANUMERIC_CNPJ = '12ABC34501DE35';
const INVALID_CNPJ = '11444777000162';

describe('validators', () => {
  describe('cpfValidator', () => {
    it('deve aceitar CPF válido sem máscara', () => {
      const control = new FormControl(VALID_CPF);

      expect(cpfValidator()(control)).toBeNull();
    });

    it('deve aceitar CPF válido com máscara', () => {
      const control = new FormControl(VALID_MASKED_CPF);

      expect(cpfValidator()(control)).toBeNull();
    });

    it('deve rejeitar CPF inválido com a chave esperada', () => {
      const control = new FormControl(INVALID_CPF);

      expect(cpfValidator()(control)).toEqual({
        [VALIDATION_ERRORS.CPF]: true,
      });
    });

    it('deve ignorar string vazia', () => {
      const control = new FormControl('');

      expect(cpfValidator()(control)).toBeNull();
    });

    it('deve ignorar null', () => {
      const control = new FormControl(null);

      expect(cpfValidator()(control)).toBeNull();
    });

    it('deve ignorar undefined', () => {
      const control = new FormControl(undefined);

      expect(cpfValidator()(control)).toBeNull();
    });

    it('deve ignorar controle desabilitado mesmo com CPF inválido', () => {
      const control = new FormControl(INVALID_CPF);
      control.disable();

      expect(cpfValidator()(control)).toBeNull();
    });

    it('deve caracterizar o valor numérico zero como ausente', () => {
      const control = new FormControl(0);

      expect(cpfValidator()(control)).toBeNull();
    });
  });

  describe('cnpjValidator', () => {
    it('deve aceitar CNPJ numérico válido', () => {
      const control = new FormControl(VALID_CNPJ);

      expect(cnpjValidator()(control)).toBeNull();
    });

    it('deve aceitar CNPJ alfanumérico válido', () => {
      const control = new FormControl(VALID_ALPHANUMERIC_CNPJ);

      expect(cnpjValidator()(control)).toBeNull();
    });

    it('deve rejeitar CNPJ inválido com a chave esperada', () => {
      const control = new FormControl(INVALID_CNPJ);

      expect(cnpjValidator()(control)).toEqual({
        [VALIDATION_ERRORS.CNPJ]: true,
      });
    });

    it('deve ignorar string vazia', () => {
      const control = new FormControl('');

      expect(cnpjValidator()(control)).toBeNull();
    });

    it('deve ignorar null', () => {
      const control = new FormControl(null);

      expect(cnpjValidator()(control)).toBeNull();
    });

    it('deve ignorar undefined', () => {
      const control = new FormControl(undefined);

      expect(cnpjValidator()(control)).toBeNull();
    });

    it('deve ignorar controle desabilitado mesmo com CNPJ inválido', () => {
      const control = new FormControl(INVALID_CNPJ);
      control.disable();

      expect(cnpjValidator()(control)).toBeNull();
    });

    it('deve caracterizar o valor numérico zero como ausente', () => {
      const control = new FormControl(0);

      expect(cnpjValidator()(control)).toBeNull();
    });
  });

  describe('cpfOrCnpjValidator', () => {
    it('deve aceitar CPF válido', () => {
      const control = new FormControl(VALID_CPF);

      expect(cpfOrCnpjValidator()(control)).toBeNull();
    });

    it('deve aceitar CNPJ numérico válido', () => {
      const control = new FormControl(VALID_CNPJ);

      expect(cpfOrCnpjValidator()(control)).toBeNull();
    });

    it('deve aceitar CNPJ alfanumérico válido', () => {
      const control = new FormControl(VALID_ALPHANUMERIC_CNPJ);

      expect(cpfOrCnpjValidator()(control)).toBeNull();
    });

    it('deve rejeitar valor inválido para CPF e CNPJ com a chave esperada', () => {
      const control = new FormControl('123');

      expect(cpfOrCnpjValidator()(control)).toEqual({
        [VALIDATION_ERRORS.CPF_OR_CNPJ]: true,
      });
    });

    it('deve ignorar string vazia', () => {
      const control = new FormControl('');

      expect(cpfOrCnpjValidator()(control)).toBeNull();
    });

    it('deve ignorar null', () => {
      const control = new FormControl(null);

      expect(cpfOrCnpjValidator()(control)).toBeNull();
    });

    it('deve ignorar undefined', () => {
      const control = new FormControl(undefined);

      expect(cpfOrCnpjValidator()(control)).toBeNull();
    });

    it('deve ignorar controle desabilitado mesmo com valor inválido', () => {
      const control = new FormControl('123');
      control.disable();

      expect(cpfOrCnpjValidator()(control)).toBeNull();
    });

    it('deve caracterizar o valor numérico zero como ausente', () => {
      const control = new FormControl(0);

      expect(cpfOrCnpjValidator()(control)).toBeNull();
    });
  });

  describe('equalsToValidator', () => {
    it('deve aceitar valores iguais', () => {
      const group = new FormGroup({
        password: new FormControl('secret'),
        confirmPassword: new FormControl('secret'),
      });

      expect(equalsToValidator('password')(group.controls.confirmPassword)).toBeNull();
    });

    it('deve rejeitar valores diferentes com a chave esperada', () => {
      const group = new FormGroup({
        password: new FormControl('secret'),
        confirmPassword: new FormControl('different'),
      });

      expect(equalsToValidator('password')(group.controls.confirmPassword)).toEqual({
        [VALIDATION_ERRORS.EQUALS_TO]: true,
      });
    });

    it('deve aceitar dois campos vazios', () => {
      const group = new FormGroup({
        password: new FormControl(''),
        confirmPassword: new FormControl(''),
      });

      expect(equalsToValidator('password')(group.controls.confirmPassword)).toBeNull();
    });

    it('deve ignorar controle sem parent', () => {
      const control = new FormControl('secret');

      expect(equalsToValidator('password')(control)).toBeNull();
    });

    it('deve ignorar parent sem o controle comparado', () => {
      const group = new FormGroup({
        password: new FormControl('secret'),
      });

      expect(equalsToValidator('confirmPassword')(group.controls.password)).toBeNull();
    });

    it('deve comparar valores numéricos zero por igualdade', () => {
      const group = new FormGroup({
        password: new FormControl(0),
        confirmPassword: new FormControl(0),
      });

      expect(equalsToValidator('password')(group.controls.confirmPassword)).toBeNull();
    });

    it('deve caracterizar a comparação de controle desabilitado com valor diferente', () => {
      const group = new FormGroup({
        password: new FormControl('secret'),
        confirmPassword: new FormControl('different'),
      });
      group.controls.confirmPassword.disable();

      expect(equalsToValidator('password')(group.controls.confirmPassword)).toEqual({
        [VALIDATION_ERRORS.EQUALS_TO]: true,
      });
    });
  });
});
