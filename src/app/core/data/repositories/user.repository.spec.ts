import { Firestore } from 'firebase/firestore';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { User } from '../models/user';
import { FirestoreUserDataProvider } from '../providers/firestore-user-data-provider';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  const firestore = {} as Firestore;
  const uid = 'auth-user-123';
  const email = 'person@example.com';
  const profile: User = { id: uid, email };
  const firestoreUserDataProvider = FirestoreUserDataProvider.prototype;
  let repository: UserRepository;
  let ensureProfileSpy: ReturnType<typeof vi.spyOn>;
  let findByIdSpy: ReturnType<typeof vi.spyOn>;
  let deleteSpy: ReturnType<typeof vi.spyOn>;
  let existsSpy: ReturnType<typeof vi.spyOn>;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    ensureProfileSpy = vi.spyOn(firestoreUserDataProvider, 'ensureProfile');
    findByIdSpy = vi.spyOn(firestoreUserDataProvider, 'findById');
    deleteSpy = vi.spyOn(firestoreUserDataProvider, 'delete');
    existsSpy = vi.spyOn(firestoreUserDataProvider, 'exists');
    repository = new UserRepository(firestore);
  });

  describe('ensureProfile()', () => {
    it('forwards UID and email and preserves the provider result', async () => {
      ensureProfileSpy.mockResolvedValue('created');

      await expect(repository.ensureProfile(uid, email)).resolves.toBe('created');
      expect(ensureProfileSpy).toHaveBeenCalledWith(uid, email);
    });

    it('preserves already-existed when the profile already exists', async () => {
      ensureProfileSpy.mockResolvedValue('already-existed');

      await expect(repository.ensureProfile(uid, email)).resolves.toBe('already-existed');
      expect(ensureProfileSpy).toHaveBeenCalledWith(uid, email);
    });

    it('propagates provider errors', async () => {
      const error = new Error('ensure failed');
      ensureProfileSpy.mockRejectedValue(error);

      await expect(repository.ensureProfile(uid, email)).rejects.toBe(error);
    });
  });

  describe('findById()', () => {
    it('forwards the UID and preserves the user result', async () => {
      findByIdSpy.mockResolvedValue(profile);

      await expect(repository.findById(uid)).resolves.toBe(profile);
      expect(findByIdSpy).toHaveBeenCalledWith(uid);
    });

    it('preserves null when no user exists for the UID', async () => {
      findByIdSpy.mockResolvedValue(null);

      await expect(repository.findById(uid)).resolves.toBeNull();
      expect(findByIdSpy).toHaveBeenCalledWith(uid);
    });

    it('propagates provider errors', async () => {
      const error = new Error('find failed');
      findByIdSpy.mockRejectedValue(error);

      await expect(repository.findById(uid)).rejects.toBe(error);
    });
  });

  describe('delete()', () => {
    it('forwards the UID and preserves the result', async () => {
      deleteSpy.mockResolvedValue(undefined);

      await expect(repository.delete(uid)).resolves.toBeUndefined();
      expect(deleteSpy).toHaveBeenCalledWith(uid);
    });

    it('propagates provider errors', async () => {
      const error = new Error('delete failed');
      deleteSpy.mockRejectedValue(error);

      await expect(repository.delete(uid)).rejects.toBe(error);
    });
  });

  describe('exists()', () => {
    it('forwards the UID and preserves the provider result', async () => {
      existsSpy.mockResolvedValue(true);

      await expect(repository.exists(uid)).resolves.toBe(true);
      expect(existsSpy).toHaveBeenCalledWith(uid);
    });

    it('preserves false when the user document does not exist', async () => {
      existsSpy.mockResolvedValue(false);

      await expect(repository.exists(uid)).resolves.toBe(false);
      expect(existsSpy).toHaveBeenCalledWith(uid);
    });

    it('propagates provider errors', async () => {
      const error = new Error('exists failed');
      existsSpy.mockRejectedValue(error);

      await expect(repository.exists(uid)).rejects.toBe(error);
    });
  });
});
