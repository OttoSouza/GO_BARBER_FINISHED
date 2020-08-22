import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointementsRepository';
import '@modules/users/providers';
import './providers';
import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import IUsersTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import { container } from 'tsyringe';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
// IAppointmentsRepository garante que appointmentRepository venha do formato criado
container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>('UserRepository', UserRepository);

container.registerSingleton<IUsersTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
