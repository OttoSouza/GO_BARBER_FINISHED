import AppErrors from '@shared/errors/AppErrors';
import AuthenticateUserService from './AuthenticateService';
import FakeRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeRepository: FakeRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeRepository = new FakeRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeRepository,
      fakeHashProvider,
    );
  });
  it('should be able to authentitcate', async () => {
    const user = await fakeRepository.create({
      name: 'Otto',
      email: 'ottoquinho@gmail.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'ottoquinho@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'ottoquinho@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });
  it('should not be able to authentitcate with wrong passowrd', async () => {
    await fakeRepository.create({
      name: 'Otto',
      email: 'ottoquinho@gmail.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'ottoquinho@gmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });
});
