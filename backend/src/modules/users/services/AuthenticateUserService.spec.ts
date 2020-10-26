import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import AuthenticationUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  it('should be able to authentication', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const authenticationUser = new AuthenticationUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    const response = await authenticationUser.execute({
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authentication with non existing user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticationUser = new AuthenticationUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    expect(
      authenticationUser.execute({
        email: 'jonhdoe@example.com.br',
        password: '123444',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authentication with wrong password', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const authenticationUser = new AuthenticationUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    expect(
      authenticationUser.execute({
        email: 'jonhdoe@example.com.br',
        password: 'wron-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
