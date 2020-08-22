import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeRepository: FakeRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;
describe('ListProviders', () => {
  beforeEach(() => {
    fakeRepository = new FakeRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(fakeRepository, fakeCacheProvider);
  });

  it('should be able show to list providers', async () => {
    const user1 = await fakeRepository.create({
      name: 'Otto',
      email: 'otto@gmail.com',
      password: '123456',
    });

    const user2 = await fakeRepository.create({
      name: 'Joao',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const loggerUser = await fakeRepository.create({
      name: 'User logado',
      email: 'logado@gmail.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggerUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
