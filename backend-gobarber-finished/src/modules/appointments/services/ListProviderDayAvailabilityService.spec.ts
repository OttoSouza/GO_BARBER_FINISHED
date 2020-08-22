import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppoinmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listListProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listListProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentRepository,
    );
  });

  it('should be able show to list the day availability from provider', async () => {
    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    const availability = await listListProviderDayAvailability.execute({
      provider_id: 'user',
      day: 20,
      year: 2020,
      month: 5,
    });

    // espero que seja um array, os dias 20 e 21 com available false
    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
      ]),
    );
  });
});
