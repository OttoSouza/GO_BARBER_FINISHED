import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateService from '@modules/users/services/AuthenticateService';

// vai pegar a class e verificar se tem algum metodo da class-transform para fazer alguma alteração
import { classToClass } from 'class-transformer';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateService);

    const { user, token } = await authenticateUser.execute({ email, password });

    return response.json({ user: classToClass(user), token });
  }
}
