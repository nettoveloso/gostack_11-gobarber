import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user_1 = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@example.com.br',
      password: '123444',
    });

    const user_2 = await fakeUserRepository.create({
      name: 'John Tre',
      email: 'jonhtre@example.com.br',
      password: '123444',
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'John Qua',
      email: 'jonhqua@example.com.br',
      password: '123444',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user_1, user_2]);
  });
});
