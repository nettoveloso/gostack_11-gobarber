import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import AuthenticationUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let authenticationUser: AuthenticationUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticationUser = new AuthenticationUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authentication', async () => {
    const user = await fakeUserRepository.create({
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
    await expect(
      authenticationUser.execute({
        email: 'jonhdoe@example.com.br',
        password: '123444',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authentication with wrong password', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    await expect(
      authenticationUser.execute({
        email: 'jonhdoe@example.com.br',
        password: 'wron-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
