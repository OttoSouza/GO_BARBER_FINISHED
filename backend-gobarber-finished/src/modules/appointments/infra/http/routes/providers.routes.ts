import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRoutes = Router();
const providersController = new ProvidersController();
const providersMonthController = new ProviderMonthAvailabilityController();
const providersDayController = new ProviderDayAvailabilityController();
// aplicando middleware de autenticação
providersRoutes.use(ensureAuthenticated);

providersRoutes.get('/', providersController.index);
providersRoutes.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providersMonthController.index,
);
providersRoutes.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providersDayController.index,
);

export default providersRoutes;
