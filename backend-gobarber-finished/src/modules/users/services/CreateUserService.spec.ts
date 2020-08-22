import AppErrors from '@shared/errors/AppErrors';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import FakeRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeRepository: FakeRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeRepository = new FakeRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(
      fakeRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Otto',
      email: 'ottoquinho@gmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });
  it('should not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'Otto',
      email: 'ottoquinho@gmail.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Otto',
        email: 'ottoquinho@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });
});
