import {
  expect,
  type Page,
  type Request,
  type Route,
} from '@playwright/test';

export type FirebaseAuthOperation =
  | 'signUp'
  | 'signInWithPassword'
  | 'lookup'
  | 'sendPasswordResetEmail'
  | 'sendEmailVerification'
  | 'tokenRefresh';

export interface FirebaseAuthMockResponse {
  status?: number;
  body: unknown;
}

export interface FirebaseAuthMockOptions {
  /**
   * Operações permitidas no cenário. Qualquer outra operação do Firebase
   * Authentication será bloqueada (fail-closed).
   */
  allow: readonly FirebaseAuthOperation[];

  /**
   * Respostas específicas por operação. Quando omitida, é usada uma resposta
   * de sucesso padrão compatível com o contrato do SDK.
   */
  responses?: Partial<Record<FirebaseAuthOperation, FirebaseAuthMockResponse>>;
}

export interface FirebaseAuthMock {
  readonly handledOperations: FirebaseAuthOperation[];
  readonly blockedRequests: string[];

  /**
   * Substitui a resposta de uma operação durante o cenário. Útil para
   * transições de estado, como um usuário que passa de não verificado para
   * verificado entre duas consultas de `lookup`.
   *
   * Use `null` para restaurar a resposta padrão.
   */
  setResponse(
    operation: FirebaseAuthOperation,
    response: FirebaseAuthMockResponse | null,
  ): void;

  expectNoUnexpectedRequests(): void;
}

const AUTH_URL_PATTERNS = [
  'https://identitytoolkit.googleapis.com/**',
  'https://securetoken.googleapis.com/**',
] as const;

const JSON_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'content-type': 'application/json',
};

const DEFAULT_RESPONSES: Record<FirebaseAuthOperation, () => unknown> = {
  sendPasswordResetEmail: () => ({
    kind: 'identitytoolkit#GetOobConfirmationCodeResponse',
    email: 'e2e@example.com',
  }),

  sendEmailVerification: () => ({
    kind: 'identitytoolkit#GetOobConfirmationCodeResponse',
    email: 'e2e@example.com',
  }),

  signUp: () => ({
    kind: 'identitytoolkit#SignupNewUserResponse',
    localId: 'e2e-user',
    email: 'e2e@example.com',
    idToken: 'mock-id-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: '3600',
  }),

  signInWithPassword: () => ({
    kind: 'identitytoolkit#VerifyPasswordResponse',
    localId: 'e2e-user',
    email: 'e2e@example.com',
    displayName: 'E2E User',
    idToken: 'mock-id-token',
    registered: true,
    refreshToken: 'mock-refresh-token',
    expiresIn: '3600',
  }),

  lookup: () => ({
    kind: 'identitytoolkit#GetAccountInfoResponse',
    users: [
      {
        localId: 'e2e-user',
        email: 'e2e@example.com',
        displayName: 'E2E User',
        emailVerified: true,
      },
    ],
  }),

  tokenRefresh: () => ({
    access_token: 'mock-id-token',
    expires_in: '3600',
    token_type: 'Bearer',
    refresh_token: 'mock-refresh-token',
    id_token: 'mock-id-token',
    user_id: 'e2e-user',
    project_id: 'e2e-project',
  }),
};

export function firebaseAuthError(
  message: string,
  code = 400,
): FirebaseAuthMockResponse {
  return {
    status: code,
    body: {
      error: {
        code,
        message,
      },
    },
  };
}

/**
 * Intercepta as chamadas HTTP do Firebase Authentication usadas pela aplicação.
 *
 * As rotas são registradas apenas para os hosts do Firebase Authentication e
 * qualquer operação não listada em `allow` é respondida com erro, sem chegar
 * ao Firebase real.
 */
export async function mockFirebaseAuth(
  page: Page,
  options: FirebaseAuthMockOptions,
): Promise<FirebaseAuthMock> {
  const allowed = new Set(options.allow);
  const handledOperations: FirebaseAuthOperation[] = [];
  const blockedRequests: string[] = [];
  const responses = new Map<FirebaseAuthOperation, FirebaseAuthMockResponse>(
    Object.entries(options.responses ?? {}) as [
      FirebaseAuthOperation,
      FirebaseAuthMockResponse,
    ][],
  );

  const handleRoute = async (route: Route): Promise<void> => {
    const request = route.request();

    if (request.method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: preflightHeaders(request),
      });

      return;
    }

    const operation = resolveOperation(request);

    if (!operation || !allowed.has(operation)) {
      blockedRequests.push(describeRequest(request));

      await route.fulfill({
        status: 403,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: {
            code: 403,
            message: 'OPERATION_NOT_ALLOWED',
          },
        }),
      });

      return;
    }

    const response = responses.get(operation) ?? {
      body: DEFAULT_RESPONSES[operation](),
    };

    handledOperations.push(operation);

    await route.fulfill({
      status: response.status ?? 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(response.body),
    });
  };

  for (const pattern of AUTH_URL_PATTERNS) {
    await page.route(pattern, handleRoute);
  }

  return {
    handledOperations,
    blockedRequests,

    setResponse(
      operation: FirebaseAuthOperation,
      response: FirebaseAuthMockResponse | null,
    ): void {
      if (response === null) {
        responses.delete(operation);
        return;
      }

      responses.set(operation, response);
    },

    expectNoUnexpectedRequests(): void {
      expect(
        blockedRequests,
        'Operações do Firebase Authentication não autorizadas foram interceptadas',
      ).toEqual([]);
    },
  };
}

function preflightHeaders(request: Request): Record<string, string> {
  const requestedHeaders = request.headers()['access-control-request-headers'];

  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers':
      requestedHeaders ?? 'content-type, x-client-version, x-firebase-locale',
    'access-control-max-age': '600',
  };
}

function resolveOperation(request: Request): FirebaseAuthOperation | null {
  if (request.method() !== 'POST') {
    return null;
  }

  const url = new URL(request.url());

  if (
    url.hostname === 'securetoken.googleapis.com' &&
    url.pathname === '/v1/token'
  ) {
    return 'tokenRefresh';
  }

  if (url.hostname !== 'identitytoolkit.googleapis.com') {
    return null;
  }

  switch (url.pathname) {
    case '/v1/accounts:signUp':
      return 'signUp';

    case '/v1/accounts:signInWithPassword':
      return 'signInWithPassword';

    case '/v1/accounts:lookup':
      return 'lookup';

    case '/v1/accounts:sendOobCode':
      return resolveOobOperation(request);

    default:
      return null;
  }
}

function resolveOobOperation(request: Request): FirebaseAuthOperation | null {
  switch (getRequestType(request)) {
    case 'PASSWORD_RESET':
      return 'sendPasswordResetEmail';

    case 'VERIFY_EMAIL':
      return 'sendEmailVerification';

    default:
      return null;
  }
}

function getRequestType(request: Request): string | null {
  const body = parseJsonBody(request);

  if (typeof body !== 'object' || body === null) {
    return null;
  }

  const { requestType } = body as { requestType?: unknown };

  return typeof requestType === 'string' ? requestType : null;
}

function parseJsonBody(request: Request): unknown {
  try {
    return request.postDataJSON() as unknown;
  } catch {
    return null;
  }
}

function describeRequest(request: Request): string {
  const pathname = new URL(request.url()).pathname;
  const requestType = getRequestType(request);

  return requestType
    ? `${request.method()} ${pathname} (${requestType})`
    : `${request.method()} ${pathname}`;
}
