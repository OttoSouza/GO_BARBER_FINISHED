import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppoinmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;
describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentRepository,
      fakeCacheProvider,
    );
  });

  it('should be able show to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      day: 20,
      year: 2020,
      month: 5,
    });

    // espero que seja um array, os dias 20 e 21 com available false
    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
