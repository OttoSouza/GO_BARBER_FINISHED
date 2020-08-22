import { Router } from 'express';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointements.routes';
import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionRoutes from '@modules/users/infra/http/routes/sessions.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';
import profileRoutes from '@modules/users/infra/http/routes/profile.routes';
import providersRoutes from '@modules/appointments/infra/http/routes/providers.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRoutes);
routes.use('/sessions', sessionRoutes);
routes.use('/password', passwordRoutes);
routes.use('/profile', profileRoutes);
routes.use('/providers', providersRoutes);

export default routes;
