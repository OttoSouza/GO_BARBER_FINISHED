import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

// receber, levar para um arquivo e retorna uma resposta
export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    // criar um agendamento na aplicação
    const { provider_id, date } = request.body;

    // carregar o service, verificar no constructor dele se precisa injetar qualquer dependencia
    // vai no container que criamos em shared/container e verificar: "olha eu tenho"
    // e injeta.
    const service = container.resolve(CreateAppointmentService);

    const appointment = await service.execute({
      date,
      provider_id,
      user_id,
    });

    return response.json(appointment);
  }
}
