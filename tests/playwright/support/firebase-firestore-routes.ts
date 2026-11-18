import {
  expect,
  type Page,
  type Request,
  type Route,
} from '@playwright/test';

export type FirebaseFirestoreOperation = 'batchGet' | 'commit';

interface FirestoreWrite {
  update?: {
    name?: string;
    fields?: Record<string, unknown>;
  };
  verify?: string;
  delete?: string;
  currentDocument?: {
    exists?: boolean;
  };
}

interface FirestoreOperationRecord {
  operation: FirebaseFirestoreOperation;
  documentPaths: string[];
  writes?: FirestoreWrite[];
}

export interface FirebaseFirestoreMock {
  readonly operations: FirestoreOperationRecord[];
  readonly blockedRequests: string[];
  readonly profileWrites: Array<{
    documentPath: string;
    fields: Record<string, unknown>;
  }>;
  getProfile(uid: string): Record<string, unknown> | undefined;
  expectNoUnexpectedRequests(): void;
}

const FIRESTORE_URL_PATTERN = 'https://firestore.googleapis.com/**';
const READ_TIME = '2026-01-01T00:00:00.000000Z';
const COMMIT_TIME = '2026-01-01T00:00:01.000000Z';

/**
 * Intercepts the Firestore REST operations used by ensureProfile transactions.
 * Documents live only for this Page and are never sent to Cloud Firestore.
 */
export async function mockFirebaseFirestore(
  page: Page,
): Promise<FirebaseFirestoreMock> {
  const operations: FirestoreOperationRecord[] = [];
  const blockedRequests: string[] = [];
  const profileWrites: FirebaseFirestoreMock['profileWrites'] = [];
  const documents = new Map<string, Record<string, unknown>>();

  const handleRoute = async (route: Route): Promise<void> => {
    const request = route.request();

    if (request.method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: preflightHeaders(request),
      });
      return;
    }

    const url = new URL(request.url());
    const operation = resolveOperation(request, url.pathname);
    if (!operation) {
      blockedRequests.push(describeRequest(request));
      await rejectRequest(route, request, 'Firestore operation not allowed');
      return;
    }

    const requestBody = parseRequestBody(request);
    if (!requestBody) {
      blockedRequests.push(describeRequest(request));
      await rejectRequest(route, request, 'Invalid Firestore request body', 400);
      return;
    }

    if (operation === 'batchGet') {
      await handleBatchGet(route, requestBody, url.pathname, documents, operations, blockedRequests, request);
      return;
    }

    await handleCommit(route, requestBody, url.pathname, documents, operations, profileWrites, blockedRequests, request);
  };

  await page.route(FIRESTORE_URL_PATTERN, handleRoute);

  return {
    operations,
    blockedRequests,
    profileWrites,
    getProfile(uid: string): Record<string, unknown> | undefined {
      const name = [...documents.keys()].find(path => path.endsWith(`/documents/users/${uid}`));
      const fields = name ? documents.get(name) : undefined;
      return fields ? decodeFields(fields) : undefined;
    },
    expectNoUnexpectedRequests(): void {
      expect(
        blockedRequests,
        'Operações do Cloud Firestore não autorizadas foram bloqueadas',
      ).toEqual([]);
    },
  };
}

async function handleBatchGet(
  route: Route,
  body: Record<string, unknown>,
  pathname: string,
  documents: Map<string, Record<string, unknown>>,
  operations: FirestoreOperationRecord[],
  blockedRequests: string[],
  request: Request,
): Promise<void> {
  const documentNames = body['documents'];
  const prefix = documentsPrefix(pathname);

  if (
    !prefix ||
    !Array.isArray(documentNames) ||
    documentNames.length === 0 ||
    !documentNames.every(
      (name): name is string =>
        typeof name === 'string' && isUserDocument(name, prefix),
    )
  ) {
    blockedRequests.push(describeRequest(request));
    await rejectRequest(route, request, 'Only user profile reads are supported', 400);
    return;
  }

  operations.push({
    operation: 'batchGet',
    documentPaths: documentNames.map(name => name.slice(prefix.length)),
  });

  const results = documentNames.map(name => {
    const fields = documents.get(name);
    return fields
      ? {
          found: {
            name,
            fields,
            createTime: READ_TIME,
            updateTime: READ_TIME,
          },
        }
      : { missing: name, readTime: READ_TIME };
  });

  await route.fulfill({
    status: 200,
    headers: jsonHeaders(request),
    body: JSON.stringify(results),
  });
}

async function handleCommit(
  route: Route,
  body: Record<string, unknown>,
  pathname: string,
  documents: Map<string, Record<string, unknown>>,
  operations: FirestoreOperationRecord[],
  profileWrites: FirebaseFirestoreMock['profileWrites'],
  blockedRequests: string[],
  request: Request,
): Promise<void> {
  const writes = body['writes'];
  const prefix = documentsPrefix(pathname);

  if (
    !prefix ||
    !Array.isArray(writes) ||
    !writes.every(
      (write): write is FirestoreWrite =>
        isRecord(write) && isSupportedWrite(write, prefix),
    )
  ) {
    blockedRequests.push(describeRequest(request));
    await rejectRequest(route, request, 'Only user profile commits are supported', 400);
    return;
  }

  const paths = writes.map(write => writeDocumentName(write).slice(prefix.length));
  operations.push({ operation: 'commit', documentPaths: paths, writes });

  const conflictingCreate = writes.find(
    write =>
      write.update?.name &&
      write.currentDocument?.exists === false &&
      documents.has(write.update.name),
  );
  if (conflictingCreate) {
    await route.fulfill({
      status: 409,
      headers: jsonHeaders(request),
      body: JSON.stringify({
        error: {
          code: 409,
          status: 'ABORTED',
          message: 'The user profile was created by another transaction.',
        },
      }),
    });
    return;
  }

  for (const write of writes) {
    if (write.update?.name && write.update.fields) {
      documents.set(write.update.name, write.update.fields);
      profileWrites.push({
        documentPath: write.update.name.slice(prefix.length),
        fields: decodeFields(write.update.fields),
      });
    } else if (write.delete) {
      documents.delete(write.delete);
    }
  }

  await route.fulfill({
    status: 200,
    headers: jsonHeaders(request),
    body: JSON.stringify({
      writeResults: writes.map(() => ({ updateTime: COMMIT_TIME })),
      commitTime: COMMIT_TIME,
    }),
  });
}

function resolveOperation(
  request: Request,
  pathname: string,
): FirebaseFirestoreOperation | null {
  if (request.method() !== 'POST') return null;
  if (/\/documents:batchGet$/.test(pathname)) return 'batchGet';
  if (/\/documents:commit$/.test(pathname)) return 'commit';
  return null;
}

function documentsPrefix(pathname: string): string | null {
  const match = pathname.match(
    /^\/v1\/projects\/([^/]+)\/databases\/\(default\)\/documents:/,
  );
  if (!match) return null;
  return `projects/${decodeURIComponent(match[1])}/databases/(default)/documents/`;
}

function isUserDocument(name: string, prefix: string): boolean {
  return new RegExp(`^${escapeRegExp(prefix)}users/[^/]+$`).test(name);
}

function isSupportedWrite(write: FirestoreWrite, prefix: string): boolean {
  const name = writeDocumentName(write);
  if (!name || !isUserDocument(name, prefix)) return false;

  if (write.update) {
    return isRecord(write.update.fields) && write.currentDocument?.exists === false;
  }

  return Boolean(write.verify || write.delete);
}

function writeDocumentName(write: FirestoreWrite): string {
  return write.update?.name ?? write.verify ?? write.delete ?? '';
}

function parseRequestBody(request: Request): Record<string, unknown> | null {
  try {
    const body: unknown = request.postDataJSON();
    return isRecord(body) ? body : null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function decodeFields(fields: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]),
  );
}

function decodeValue(value: unknown): unknown {
  if (!isRecord(value)) return value;
  if ('stringValue' in value) return value['stringValue'];
  if ('booleanValue' in value) return value['booleanValue'];
  if ('integerValue' in value) return Number(value['integerValue']);
  if ('doubleValue' in value) return value['doubleValue'];
  if ('nullValue' in value) return null;
  if (isRecord(value['mapValue']) && isRecord(value['mapValue']['fields'])) {
    return decodeFields(value['mapValue']['fields']);
  }
  if (isRecord(value['arrayValue']) && Array.isArray(value['arrayValue']['values'])) {
    return value['arrayValue']['values'].map(decodeValue);
  }
  return value;
}

function preflightHeaders(request: Request): Record<string, string> {
  const requestedHeaders = request.headers()['access-control-request-headers'];
  return {
    'access-control-allow-origin': request.headers().origin ?? '*',
    'access-control-allow-credentials': 'true',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': requestedHeaders ?? '*',
    'access-control-max-age': '600',
  };
}

function jsonHeaders(request: Request): Record<string, string> {
  return {
    'access-control-allow-origin': request.headers().origin ?? '*',
    'access-control-allow-credentials': 'true',
    'content-type': 'application/json',
  };
}

async function rejectRequest(
  route: Route,
  request: Request,
  message: string,
  status = 403,
): Promise<void> {
  await route.fulfill({
    status,
    headers: jsonHeaders(request),
    body: JSON.stringify({
      error: { code: status, status: 'PERMISSION_DENIED', message },
    }),
  });
}

function describeRequest(request: Request): string {
  return `${request.method()} ${new URL(request.url()).pathname}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
