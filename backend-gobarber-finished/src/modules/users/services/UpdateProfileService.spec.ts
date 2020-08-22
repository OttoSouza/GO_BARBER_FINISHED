import AppErrors from '@shared/errors/AppErrors';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeRepository: FakeRepository;
let updateProfile: UpdateProfileService;
let fakeHashProvider: FakeHashProvider;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeRepository = new FakeRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeRepository, fakeHashProvider);
  });
  it('should be able to update the profile', async () => {
    const user = await fakeRepository.create({
      name: 'Otto',
      email: 'otto@gmail.com',
      password: '123456',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@exemple.com',
    });

    expect(updateUser.name).toBe('John Tre');
    expect(updateUser.email).toBe('johntre@exemple.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const user = await fakeRepository.create({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should be able to update the password', async () => {
    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const updateUser = updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect((await updateUser).password).toBe('123123');
  });

  it('should not be able to update the password  without old password', async () => {
    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        old_password: 'wrong-old-password',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'Test',
        email: 'otto@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });
});
