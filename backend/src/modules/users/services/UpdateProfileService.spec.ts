import AppError from '@shared/errors/AppError';

import FakeHasProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHasProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHasProvider();

    updateProfile = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jonh Stuarte',
      email: 'jonstuarte@example.com',
    });

    expect(updatedUser.name).toBe('Jonh Stuarte');
    expect(updatedUser.email).toBe('jonstuarte@example.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    const user = await fakeUserRepository.create({
      name: 'Test',
      email: 'test@example.com.br',
      password: '123444',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jonh Doe',
        email: 'jonhdoe@example.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jonh Stuarte',
      email: 'jonstuarte@example.com',
      old_password: '123444',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jonh Stuarte',
        email: 'jonstuarte@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jonh Stuarte',
        email: 'jonstuarte@example.com',
        old_password: '12',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able update the profile from non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing',
        name: 'Teste',
        email: 'teste@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
