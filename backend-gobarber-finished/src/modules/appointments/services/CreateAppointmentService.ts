import 'reflect-metadata';
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import AppErrors from '@shared/errors/AppErrors';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appoinment';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointementsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    // verificar se a data marcada esta no passado
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppErrors('Cannot create an appointment on a past date');
    }

    if (user_id === provider_id) {
      throw new AppErrors('You cannot create an appointment with yourself');
    }
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppErrors('This appointment is already booked');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppErrors(
        'You can only create an appointment between 8am and 5pm',
      );
    }

    // create agora, ele cria staticamente e ainda chama o outro metodo save por causa da interface
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    const dateFormated = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para ${dateFormated}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
