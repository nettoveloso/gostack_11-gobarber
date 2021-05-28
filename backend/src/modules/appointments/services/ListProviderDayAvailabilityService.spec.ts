import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmetRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let listProvidersDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentsRepository();

    listProvidersDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentRepository.create({
      provider_id: 'user',
      date: new Date(2021, 4, 29, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      date: new Date(2021, 4, 29, 10, 0, 0),
    });

    const availability = await listProvidersDayAvailability.execute({
      provider_id: 'user',
      day: 29,
      year: 2021,
      month: 5,
    });

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
