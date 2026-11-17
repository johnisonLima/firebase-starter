import { Firestore } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { User } from '../models/user';
import { FirestoreUserDataProvider } from '../providers/firestore-user-data-provider';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  const firestore = {} as Firestore;
  const uid = 'auth-user-123';
  const email = 'person@example.com';
  const profile: User = { id: uid, email };
  let repository: UserRepository;
  let ensureProfileSpy: ReturnType<typeof vi.spyOn>;
  let findByIdSpy: ReturnType<typeof vi.spyOn>;
  let deleteSpy: ReturnType<typeof vi.spyOn>;
  let existsSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    ensureProfileSpy = vi.spyOn(FirestoreUserDataProvider.prototype, 'ensureProfile');
    findByIdSpy = vi.spyOn(FirestoreUserDataProvider.prototype, 'findById');
    deleteSpy = vi.spyOn(FirestoreUserDataProvider.prototype, 'delete');
    existsSpy = vi.spyOn(FirestoreUserDataProvider.prototype, 'exists');
    repository = new UserRepository(firestore);
  });

  it('constructs the specialized provider with the supplied Firestore instance', () => {
    expect(repository).toBeInstanceOf(UserRepository);
  });

  describe('ensureProfile()', () => {
    it('forwards UID and email and preserves the provider result', async () => {
      ensureProfileSpy.mockResolvedValue('created');

      await expect(repository.ensureProfile(uid, email)).resolves.toBe('created');
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

    it('propagates provider errors', async () => {
      const error = new Error('exists failed');
      existsSpy.mockRejectedValue(error);

      await expect(repository.exists(uid)).rejects.toBe(error);
    });
  });
});
