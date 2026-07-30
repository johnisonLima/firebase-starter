import { describe, it, expect } from 'vitest';
import {
  isValidCnpj,
  normalizeCnpj,
} from './cnpj';

describe('CNPJ', () => {

  describe('normalizeCnpj', () => {

    it('deve remover a máscara', () => {
      expect(
        normalizeCnpj('12.345.678/0001-95')
      ).toBe('12345678000195');
    });

    it('deve converter letras para maiúsculas', () => {
      expect(
        normalizeCnpj('12.abc.345/01de-35')
      ).toBe('12ABC34501DE35');
    });

  });

  describe('isValidCnpj', () => {

    it('deve validar um CNPJ numérico válido', () => {
      expect(
        isValidCnpj('11.444.777/0001-61')
      ).toBe(true);
    });

    it('deve rejeitar um CNPJ numérico inválido', () => {
      expect(
        isValidCnpj('11.444.777/0001-62')
      ).toBe(false);
    });

    it('deve validar o exemplo oficial do CNPJ alfanumérico', () => {
      expect(
        isValidCnpj('12ABC34501DE35')
      ).toBe(true);
    });

    it('deve aceitar máscara no CNPJ alfanumérico', () => {
      expect(
        isValidCnpj('12.ABC.345/01DE-35')
      ).toBe(true);
    });

    it('deve aceitar letras minúsculas', () => {
      expect(
        isValidCnpj('12.abc.345/01de-35')
      ).toBe(true);
    });

    it('deve rejeitar CNPJ com DV inválido', () => {
      expect(
        isValidCnpj('12ABC34501DE34')
      ).toBe(false);
    });

    it('deve rejeitar caracteres repetidos', () => {
      expect(
        isValidCnpj('AAAAAAAAAAAAAA')
      ).toBe(false);
    });

    it('deve rejeitar tamanho inválido', () => {
      expect(
        isValidCnpj('123')
      ).toBe(false);
    });

  });

});