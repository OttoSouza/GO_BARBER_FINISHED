import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.query;

    // carregar o service, verificar no constructor dele se precisa injetar qualquer dependencia
    // vai no container que criamos em shared/container e verificar: "olha eu tenho"
    // e injeta.
    const listProvidersMonth = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    const availability = await listProvidersMonth.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
