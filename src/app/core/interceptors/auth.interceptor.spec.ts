import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';


import { API_CONFIG } from '../config/api.config';
import { AuthService } from '../auth/auth.service';

import { authInterceptor } from './auth.interceptor';
import { afterEach, beforeEach, describe, it, vi } from 'vitest';

describe('AuthInterceptor', () => {
  const trustedOrigin = 'https://api.example.com';
  const trustedUrl = `${trustedOrigin}/users`;
  const externalUrl = 'https://external.example.com/users';
  const jsonPlaceholderUrl = 'https://jsonplaceholder.typicode.com/users';
  const token = 'firebase-id-token';

  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let originalTrustedOrigins: string[] = [];
  let baseElement: HTMLBaseElement | null = null;
  let originalBaseHref: string | null = null;
  let createdBaseElement = false;
  let authServiceMock: {
    getIdToken: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    originalTrustedOrigins = [...API_CONFIG.trustedOrigins];
    setTrustedOrigins(trustedOrigin);

    authServiceMock = {
      getIdToken: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([authInterceptor]),
        ),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    try {
      httpTestingController.verify();
    } finally {
      restoreDocumentBase();
      restoreTrustedOrigins();
    }
  });

  it('deve adicionar o Firebase ID Token para uma origem confiável', async () => {
    authServiceMock.getIdToken.mockResolvedValue(token);

    http.get(trustedUrl).subscribe();

    const request = await waitForRequest(trustedUrl);

    expect(request.request.headers.get('Authorization')).toBe(
      `Bearer ${token}`,
    );

    expect(authServiceMock.getIdToken).toHaveBeenCalledTimes(1);

    request.flush({});
  });

  it('não deve adicionar o token para uma origem externa', async () => {
    authServiceMock.getIdToken.mockResolvedValue(token);

    http.get(externalUrl).subscribe();

    const request = httpTestingController.expectOne(externalUrl);

    expect(request.request.headers.has('Authorization')).toBe(false);

    expect(authServiceMock.getIdToken).not.toHaveBeenCalled();

    request.flush({});
  });

  it.each([null, ''])(
    'não deve adicionar o token quando getIdToken retornar %s',
    async (tokenValue) => {
      authServiceMock.getIdToken.mockResolvedValue(tokenValue);

      http.get(trustedUrl).subscribe();

      const request = await waitForRequest(trustedUrl);

      expect(request.request.headers.has('Authorization')).toBe(false);

      expect(authServiceMock.getIdToken).toHaveBeenCalledTimes(1);

      request.flush({});
    },
  );

  it('não deve enviar o token para o JSONPlaceholder', async () => {
    authServiceMock.getIdToken.mockResolvedValue(token);

    http.get(jsonPlaceholderUrl).subscribe();

    const request = httpTestingController.expectOne(jsonPlaceholderUrl);

    expect(request.request.headers.has('Authorization')).toBe(false);

    expect(authServiceMock.getIdToken).not.toHaveBeenCalled();

    request.flush({});
  });

  it('não deve enviar o token quando a lista de origens confiáveis estiver vazia', async () => {
    setTrustedOrigins();
    authServiceMock.getIdToken.mockResolvedValue(token);

    http.get(trustedUrl).subscribe();

    const request = httpTestingController.expectOne(trustedUrl);

    expect(request.request.headers.has('Authorization')).toBe(false);

    expect(authServiceMock.getIdToken).not.toHaveBeenCalled();

    request.flush({});
  });

  it.each([
    ['domínio semelhante', 'https://api.example.com.evil.com/users'],
    ['domínio com prefixo semelhante', 'https://evil-api.example.com/users'],
    ['porta diferente', 'https://api.example.com:8443/users'],
    ['protocolo diferente', 'http://api.example.com/users'],
    ['credenciais apontando para outra origem', 'https://api.example.com@evil.com/users'],
  ])(
    'não deve adicionar o token para %s',
    async (_scenario, url) => {
      authServiceMock.getIdToken.mockResolvedValue(token);

      http.get(url).subscribe();

      const request = httpTestingController.expectOne(url);

      expect(request.request.headers.has('Authorization')).toBe(false);

      expect(authServiceMock.getIdToken).not.toHaveBeenCalled();

      request.flush({});
    },
  );

  it.each(['users', '/users'])(
    'deve resolver a URL relativa %s contra document.baseURI',
    async (relativeUrl) => {
      setTrustedOrigins('https://cdn.example.com');
      setDocumentBase('https://cdn.example.com/app/');
      authServiceMock.getIdToken.mockResolvedValue(token);

      http.get(relativeUrl).subscribe();

      const request = await waitForRequest(relativeUrl);

      expect(request.request.headers.get('Authorization')).toBe(
        `Bearer ${token}`,
      );

      expect(authServiceMock.getIdToken).toHaveBeenCalledTimes(1);

      request.flush({});
    },
  );

  it.each([
    'blob:https://api.example.com/123',
    'data:text/plain,hello',
  ])(
    'não deve adicionar o token para o protocolo não HTTP %s',
    async (url) => {
      authServiceMock.getIdToken.mockResolvedValue(token);

      http.get(url).subscribe();

      const request = httpTestingController.expectOne(url);

      expect(request.request.headers.has('Authorization')).toBe(false);

      expect(authServiceMock.getIdToken).not.toHaveBeenCalled();

      request.flush({});
    },
  );

  it.each([
    'http://',
    'https://api.example.com:bad/users',
  ])(
    'não deve adicionar o token para a URL inválida %s',
    async (url) => {
      authServiceMock.getIdToken.mockResolvedValue(token);

      http.get(url).subscribe();

      const request = httpTestingController.expectOne(url);

      expect(request.request.headers.has('Authorization')).toBe(false);

      expect(authServiceMock.getIdToken).not.toHaveBeenCalled();

      request.flush({});
    },
  );

  it.each([
    ['caminho', 'https://api.example.com/api', 'https://api.example.com/users'],
    ['query', 'https://api.example.com?x=1', 'https://api.example.com/users'],
    ['fragmento', 'https://api.example.com#frag', 'https://api.example.com/users'],
    ['barra final', 'https://api.example.com/', 'https://api.example.com/users'],
    ['protocolo não permitido', 'ftp://api.example.com', 'ftp://api.example.com/users'],
  ])(
    'não deve autorizar uma origem configurada com %s',
    async (_scenario, configuredOrigin, url) => {
      setTrustedOrigins(configuredOrigin);
      authServiceMock.getIdToken.mockResolvedValue(token);

      http.get(url).subscribe();

      const request = httpTestingController.expectOne(url);

      expect(request.request.headers.has('Authorization')).toBe(false);

      expect(authServiceMock.getIdToken).not.toHaveBeenCalled();

      request.flush({});
    },
  );

  async function waitForRequest(url: string) {
    let request: TestRequest | undefined;

    await vi.waitFor(() => {
      request = httpTestingController.expectOne(url);
    });

    return request!;
  }

  function setTrustedOrigins(...origins: string[]): void {
    API_CONFIG.trustedOrigins.splice(
      0,
      API_CONFIG.trustedOrigins.length,
      ...origins,
    );
  }

  function restoreTrustedOrigins(): void {
    API_CONFIG.trustedOrigins.splice(
      0,
      API_CONFIG.trustedOrigins.length,
      ...originalTrustedOrigins,
    );
  }

  function setDocumentBase(href: string): void {
    const existingBase = document.querySelector('base');

    if (existingBase) {
      baseElement = existingBase;
      originalBaseHref = existingBase.getAttribute('href');
      existingBase.setAttribute('href', href);
      return;
    }

    baseElement = document.createElement('base');
    baseElement.setAttribute('href', href);
    document.head.appendChild(baseElement);
    createdBaseElement = true;
  }

  function restoreDocumentBase(): void {
    if (!baseElement) {
      return;
    }

    if (createdBaseElement) {
      baseElement.remove();
    } else if (originalBaseHref === null) {
      baseElement.removeAttribute('href');
    } else {
      baseElement.setAttribute('href', originalBaseHref);
    }

    baseElement = null;
    originalBaseHref = null;
    createdBaseElement = false;
  }
});
