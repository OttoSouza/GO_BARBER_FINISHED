import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year, day } = request.query;

    // carregar o service, verificar no constructor dele se precisa injetar qualquer dependencia
    // vai no container que criamos em shared/container e verificar: "olha eu tenho"
    // e injeta.
    const listProvidersDay = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const availability = await listProvidersDay.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
