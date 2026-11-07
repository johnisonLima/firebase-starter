import { FirebaseError } from 'firebase/app';

import { describe, expect, it } from 'vitest';

import { getAuthErrorMessage } from './auth.errors';

describe('getAuthErrorMessage', () => {
  it.each([
    ['auth/email-already-in-use', 'Este e-mail já está em uso.'],
    ['auth/invalid-email', 'O e-mail informado é inválido.'],
    ['auth/invalid-credential', 'E-mail ou senha inválidos.'],
    ['auth/user-disabled', 'Esta conta foi desativada.'],
    ['auth/too-many-requests', 'Muitas tentativas. Tente novamente mais tarde.'],
    [
      'auth/network-request-failed',
      'Erro de conexão. Verifique sua internet.',
    ],
  ])('deve mapear o código %s para a mensagem esperada', (code, message) => {
    const error = new FirebaseError(code, 'Erro de autenticação');

    expect(getAuthErrorMessage(error)).toBe(message);
  });

  it('deve retornar a mensagem genérica de autenticação para código desconhecido', () => {
    const error = new FirebaseError('auth/codigo-desconhecido', 'Erro');

    expect(getAuthErrorMessage(error)).toBe(
      'Ocorreu um erro durante a autenticação.',
    );
  });

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['string', 'auth/invalid-credential'],
    ['Error comum', new Error('falha')],
    ['objeto com code', { code: 'auth/invalid-credential' }],
  ])('deve retornar a mensagem inesperada para %s', (_label, error) => {
    expect(getAuthErrorMessage(error)).toBe('Ocorreu um erro inesperado.');
  });
});
