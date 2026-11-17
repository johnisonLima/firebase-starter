import {
  deleteDoc,
  doc,
  getDoc,
  runTransaction,
} from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Collections } from '../collections/collections';
import { FirestoreUserDataProvider } from './firestore-user-data-provider';

vi.mock('firebase/firestore', () => ({
  deleteDoc: vi.fn(),
  doc: vi.fn(() => ({ path: 'users/test-uid' })),
  getDoc: vi.fn(),
  runTransaction: vi.fn(),
}));

describe('FirestoreUserDataProvider', () => {
  const firestore = { marker: 'firestore' } as never;
  const uid = 'auth-user-123';
  const email = 'person@example.com';
  let provider: FirestoreUserDataProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new FirestoreUserDataProvider(firestore);
    vi.mocked(doc).mockReturnValue({ path: `users/${uid}` } as never);
  });

  describe('ensureProfile()', () => {
    it('creates only the email at the UID path and returns created when absent', async () => {
      const transaction = {
        get: vi.fn().mockResolvedValue({ exists: () => false }),
        set: vi.fn(),
      };
      vi.mocked(runTransaction).mockImplementation(async (_db, callback) =>
        callback(transaction as never),
      );

      await expect(provider.ensureProfile(uid, email)).resolves.toBe('created');

      expect(doc).toHaveBeenCalledWith(firestore, Collections.USERS, uid);
      expect(runTransaction).toHaveBeenCalledWith(firestore, expect.any(Function));
      expect(transaction.get).toHaveBeenCalledWith({ path: `users/${uid}` });
      expect(transaction.set).toHaveBeenCalledWith(
        { path: `users/${uid}` },
        { email },
      );
    });

    it('returns already-existed and performs no write when the document exists', async () => {
      const transaction = {
        get: vi.fn().mockResolvedValue({ exists: () => true }),
        set: vi.fn(),
      };
      vi.mocked(runTransaction).mockImplementation(async (_db, callback) =>
        callback(transaction as never),
      );

      await expect(provider.ensureProfile(uid, email)).resolves.toBe('already-existed');

      expect(transaction.set).not.toHaveBeenCalled();
    });

    it('propagates transaction failures', async () => {
      const error = new Error('transaction failed');
      vi.mocked(runTransaction).mockRejectedValue(error);

      await expect(provider.ensureProfile(uid, email)).rejects.toBe(error);
    });

    it('uses a transaction for each concurrent ensure request', async () => {
      const transaction = {
        get: vi.fn().mockResolvedValue({ exists: () => true }),
        set: vi.fn(),
      };
      vi.mocked(runTransaction).mockImplementation(async (_db, callback) =>
        callback(transaction as never),
      );

      const results = await Promise.all([
        provider.ensureProfile(uid, email),
        provider.ensureProfile(uid, email),
      ]);

      expect(results).toEqual(['already-existed', 'already-existed']);
      expect(runTransaction).toHaveBeenCalledTimes(2);
      expect(transaction.set).not.toHaveBeenCalled();
    });
  });

  describe('findById()', () => {
    it('returns the document data and uses the document ID as User.id', async () => {
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => true,
        id: uid,
        data: () => ({ email }),
      } as never);

      await expect(provider.findById(uid)).resolves.toEqual({ id: uid, email });
      expect(doc).toHaveBeenCalledWith(firestore, Collections.USERS, uid);
      expect(getDoc).toHaveBeenCalledWith({ path: `users/${uid}` });
    });

    it('returns null when the document does not exist', async () => {
      vi.mocked(getDoc).mockResolvedValue({ exists: () => false } as never);

      await expect(provider.findById(uid)).resolves.toBeNull();
    });

    it('propagates read errors', async () => {
      const error = new Error('read failed');
      vi.mocked(getDoc).mockRejectedValue(error);

      await expect(provider.findById(uid)).rejects.toBe(error);
    });
  });

  describe('delete()', () => {
    it('deletes the document for the UID from the users collection', async () => {
      vi.mocked(deleteDoc).mockResolvedValue(undefined);

      await expect(provider.delete(uid)).resolves.toBeUndefined();

      expect(doc).toHaveBeenCalledWith(firestore, Collections.USERS, uid);
      expect(deleteDoc).toHaveBeenCalledWith({ path: `users/${uid}` });
    });

    it('propagates deletion errors', async () => {
      const error = new Error('delete failed');
      vi.mocked(deleteDoc).mockRejectedValue(error);

      await expect(provider.delete(uid)).rejects.toBe(error);
    });
  });

  describe('exists()', () => {
    it('returns true when the document exists', async () => {
      vi.mocked(getDoc).mockResolvedValue({ exists: () => true } as never);

      await expect(provider.exists(uid)).resolves.toBe(true);
    });

    it('returns false when the document does not exist', async () => {
      vi.mocked(getDoc).mockResolvedValue({ exists: () => false } as never);

      await expect(provider.exists(uid)).resolves.toBe(false);
    });

    it('propagates read errors', async () => {
      const error = new Error('existence check failed');
      vi.mocked(getDoc).mockRejectedValue(error);

      await expect(provider.exists(uid)).rejects.toBe(error);
    });
  });
});
