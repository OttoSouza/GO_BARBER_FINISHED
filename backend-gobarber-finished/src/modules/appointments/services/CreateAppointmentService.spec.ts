import AppErrors from '@shared/errors/AppErrors';
import FakeNotificaitonRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';
import FakeRepository from '../repositories/fakes/FakeAppoinmentsRepository';

let fakeRepository: FakeRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;
let fakeNotificationRepository: FakeNotificaitonRepository;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeRepository = new FakeRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeNotificationRepository = new FakeNotificaitonRepository();
    createAppointment = new CreateAppointmentService(
      fakeRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: '123456',
      provider_id: '12345',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12345');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 6, 24, 14);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await createAppointment.execute({
      date: appointmentDate,
      user_id: '123456',
      provider_id: '12345',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: '123456',
        provider_id: '12345',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: '123456',
        provider_id: '12345',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 10, 13),
        user_id: '123456',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 11, 7),
        user_id: '123456',
        provider_id: '12345',
      }),
    ).rejects.toBeInstanceOf(AppErrors);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 11, 18),
        user_id: '123456',
        provider_id: '12345',
      }),
    ).rejects.toBeInstanceOf(AppErrors);
  });
});
