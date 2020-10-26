import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreaUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create new user with some email from another', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    expect(
      createUser.execute({
        name: 'John Doe',
        email: 'jonhdoe@example.com.br',
        password: '123444',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
