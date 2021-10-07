import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreaUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create new user with some email from another', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'jonhdoe@example.com.br',
        password: '123444',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
