import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';
import AppErrors from '@shared/errors/AppErrors';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UserRepository') private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);
    if (!userToken) {
      throw new AppErrors('User token does not exists');
    }
    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppErrors('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppErrors('Token expired');
    }
    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
