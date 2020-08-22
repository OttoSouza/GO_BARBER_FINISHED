import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppErrors from '@shared/errors/AppErrors';
import FakeRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeRepository: FakeRepository;
let fakeStorage: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatarService.spec', () => {
  beforeEach(() => {
    fakeRepository = new FakeRepository();
    fakeStorage = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(fakeRepository, fakeStorage);
  });
  it('should be able to update user avatar', async () => {
    const user = await fakeRepository.create({
      name: 'Otto',
      email: 'otto@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'otto.jpg',
    });

    expect(user.avatar).toBe('otto.jpg');
  });
  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'otto.jpg',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });
  it('should be delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorage, 'deleteFile');

    const user = await fakeRepository.create({
      name: 'Otto',
      email: 'otto@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'otto.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'otto2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('otto.jpg');
    expect(user.avatar).toBe('otto2.jpg');
  });
});
