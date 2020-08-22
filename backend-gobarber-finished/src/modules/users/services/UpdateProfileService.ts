import { injectable, inject } from 'tsyringe';
import AppErrors from '@shared/errors/AppErrors';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/Users';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfile {
  constructor(
    @inject('UserRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppErrors('User not found.');
    }

    const userWithUpdateEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user_id) {
      throw new AppErrors('E-mail already in use.');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppErrors(
        'You need to inform the old password to sen a new password',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppErrors('Old password does not match.');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}
export default UpdateProfile;
