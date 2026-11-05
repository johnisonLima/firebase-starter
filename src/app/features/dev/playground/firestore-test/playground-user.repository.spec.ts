import type { Firestore } from 'firebase/firestore';

import { DataProvider } from '@core/data/providers/data-provider';

import { User } from '@features/users/models/user';

import { PlaygroundUserRepository } from './playground-user.repository';

/**
 * O provider é privado em `BaseRepository`. O acesso via reflexão permite
 * confirmar a coleção configurada sem inicializar o Firebase nem tocar
 * no Firestore remoto.
 */
function getProvider(repository: PlaygroundUserRepository) {
  return (repository as unknown as { provider: DataProvider<User> & { collection: string } }).provider;
}

describe('PlaygroundUserRepository', () => {
  it('deve utilizar a coleção exclusiva playground_users', () => {
    const repository = new PlaygroundUserRepository({} as Firestore);

    expect(getProvider(repository).collection).toBe('playground_users');
  });

  it('deve delegar as operações CRUD ao provider', async () => {
    const repository = new PlaygroundUserRepository({} as Firestore);
    const provider = getProvider(repository);

    const createSpy = vi
      .spyOn(provider, 'create')
      .mockResolvedValue('generated-id');
    const findAllSpy = vi.spyOn(provider, 'findAll').mockResolvedValue([]);

    await expect(
      repository.create({ email: 'playground@example.com' }),
    ).resolves.toBe('generated-id');
    await expect(repository.findAll()).resolves.toEqual([]);

    expect(createSpy).toHaveBeenCalledWith({
      email: 'playground@example.com',
    });
    expect(findAllSpy).toHaveBeenCalledTimes(1);
  });
});
