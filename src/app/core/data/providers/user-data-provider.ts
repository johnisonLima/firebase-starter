import { User } from '../models/user';

export type EnsureProfileResult =
  | 'created'
  | 'already-existed';

export interface UserDataProvider {
  ensureProfile(
    uid: string,
    email: string
  ): Promise<EnsureProfileResult>;

  findById(uid: string): Promise<User | null>;

  delete(uid: string): Promise<void>;

  exists(uid: string): Promise<boolean>;
}