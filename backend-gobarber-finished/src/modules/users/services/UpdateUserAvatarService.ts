import User from '@modules/users/infra/typeorm/entities/Users';
import AppErrors from '@shared/errors/AppErrors';
import { injectable, inject } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
  user_id: string;
  avatarFilename: string;
}
@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UserRepository') private usersRepository: IUsersRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppErrors('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      this.storageProvider.deleteFile(user.avatar);
    }
    const fileName = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;
    await this.usersRepository.save(user);

    return user;
  }
}
export default UpdateUserAvatarService;
