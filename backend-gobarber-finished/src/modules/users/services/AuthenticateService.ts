import 'reflect-metadata';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

import User from '@modules/users/infra/typeorm/entities/Users';
import AppErrors from '@shared/errors/AppErrors';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}
@injectable()
class AuthenticateService {
  constructor(
    @inject('UserRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppErrors('Incorrect email/password combination', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppErrors('Incorrect email/password combination', 401);
    }

    // Usuario esta autenticado
    // sign reporta dois parametros
    // primeiro: retorna alguma valor do usuario para usar depois: persmissoes: nomes, etc, (chamado de payload);
    // segundo : gerar  o token , a forma de como ira ser gerado
    // terceiro: dizer qual foi usuario que gerou o token. obs: ele nao passa nas credenciais

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateService;
