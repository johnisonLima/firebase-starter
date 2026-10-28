import { describe, expect, it } from 'vitest';

import {
  isValidCpf,
  normalizeCpf,
} from './cpf';

describe('CPF', () => {

  describe('normalizeCpf', () => {

    it('deve remover a máscara', () => {

      expect(
        normalizeCpf('529.982.247-25'),
      ).toBe('52998224725');

    });

    it('deve remover espaços', () => {

      expect(
        normalizeCpf(' 529.982.247-25 '),
      ).toBe('52998224725');

    });

    it('deve remover qualquer caractere não numérico', () => {

      expect(
        normalizeCpf('529.982.247-25abc'),
      ).toBe('52998224725');

    });

  });

  describe('isValidCpf', () => {

    const validCases = [
      '52998224725',
      '529.982.247-25',
      '11144477735',
      '111.444.777-35',
    ];

    validCases.forEach(cpf => {

      it(`deve validar ${cpf}`, () => {

        expect(
          isValidCpf(cpf),
        ).toBe(true);

      });

    });

    const invalidCases = [
      '',
      '123',
      '52998224724',
      '11144477734',
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999',
    ];

    invalidCases.forEach(cpf => {

      it(`deve rejeitar ${cpf}`, () => {

        expect(
          isValidCpf(cpf),
        ).toBe(false);

      });

    });

  });

});