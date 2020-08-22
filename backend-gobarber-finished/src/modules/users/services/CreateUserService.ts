import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import 'reflect-metadata';

import AppErrors from '@shared/errors/AppErrors';
import User from '@modules/users/infra/typeorm/entities/Users';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const ckeckUserExists = await this.usersRepository.findByEmail(email);

    if (ckeckUserExists) {
      throw new AppErrors('Email address alread used');
    }
    const hashPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    await this.cacheProvider.invalidadePrefix('providers-list');
    return user;
  }
}

export default CreateUserService;
