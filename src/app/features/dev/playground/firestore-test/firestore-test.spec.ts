import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@features/users/models/user';

import { FirestoreTest } from './firestore-test';
import { PlaygroundUserRepository } from './playground-user.repository';

const createPlaygroundUserRepositoryMock = () => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

describe('FirestoreTest', () => {
  let component: FirestoreTest;
  let fixture: ComponentFixture<FirestoreTest>;
  let repositoryMock: ReturnType<typeof createPlaygroundUserRepositoryMock>;

  beforeEach(async () => {
    repositoryMock = createPlaygroundUserRepositoryMock();

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: PlaygroundUserRepository,
          useValue: repositoryMock,
        },
      ],
      imports: [FirestoreTest],
    }).compileComponents();

    fixture = TestBed.createComponent(FirestoreTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('deve criar o componente sem depender do UserRepository', () => {
    expect(component).toBeTruthy();
  });

  it('deve criar um documento e armazenar o ID retornado', async () => {
    repositoryMock.create.mockResolvedValue('generated-id');
    component.email = 'playground@example.com';

    await component.create();

    expect(repositoryMock.create).toHaveBeenCalledTimes(1);
    expect(repositoryMock.create).toHaveBeenCalledWith({
      email: 'playground@example.com',
    });
    expect(component.id).toBe('generated-id');
    expect(component.result).toBe('User created with ID: generated-id');
  });

  it('deve consultar um documento pelo ID', async () => {
    const user: User = {
      id: 'doc-id',
      email: 'playground@example.com',
    };
    repositoryMock.findById.mockResolvedValue(user);
    component.id = 'doc-id';

    await component.findById();

    expect(repositoryMock.findById).toHaveBeenCalledWith('doc-id');
    expect(component.result).toEqual(user);
  });

  it('deve listar todos os documentos', async () => {
    const users: User[] = [
      { id: 'doc-1', email: 'one@example.com' },
      { id: 'doc-2', email: 'two@example.com' },
    ];
    repositoryMock.findAll.mockResolvedValue(users);

    await component.findAll();

    expect(repositoryMock.findAll).toHaveBeenCalledTimes(1);
    expect(component.result).toEqual(users);
  });

  it('deve atualizar o e-mail do documento', async () => {
    repositoryMock.update.mockResolvedValue(undefined);
    component.id = 'doc-id';
    component.updatedEmail = 'updated@example.com';

    await component.update();

    expect(repositoryMock.update).toHaveBeenCalledTimes(1);
    expect(repositoryMock.update).toHaveBeenCalledWith('doc-id', {
      email: 'updated@example.com',
    });
    expect(component.result).toBe(
      'User with ID: doc-id updated successfully.',
    );
  });

  it('deve excluir o documento', async () => {
    repositoryMock.delete.mockResolvedValue(undefined);
    component.id = 'doc-id';

    await component.delete();

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith('doc-id');
    expect(component.result).toBe(
      'User with ID: doc-id deleted successfully.',
    );
  });

  it('deve armazenar o erro quando uma operação falhar', async () => {
    const error = new Error('permission-denied');
    repositoryMock.create.mockRejectedValue(error);
    component.email = 'playground@example.com';

    await component.create();

    expect(component.result).toBe(error);
    expect(component.id).toBe('');
  });

  it('deve limpar os campos e o resultado', () => {
    component.id = 'doc-id';
    component.email = 'playground@example.com';
    component.updatedEmail = 'updated@example.com';
    component.result = { id: 'doc-id' };

    component.onClear();

    expect(component.id).toBe('');
    expect(component.email).toBe('');
    expect(component.updatedEmail).toBe('');
    expect(component.result).toBeNull();
  });
});
