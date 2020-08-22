import ShowProfileService from '@modules/users/services/ShowProfileService';

import AppErrors from '@shared/errors/AppErrors';
import FakeRepository from '../repositories/fakes/FakeUsersRepository';

let fakeRepository: FakeRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeRepository = new FakeRepository();
    showProfile = new ShowProfileService(fakeRepository);
  });

  it('should be able show the profile', async () => {
    const user = await fakeRepository.create({
      name: 'Otto',
      email: 'otto@gmail.com',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Otto');
    expect(profile.email).toBe('otto@gmail.com');
  });

  it('should not be able show the profile from non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });
});
