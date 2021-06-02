import FakeAppoimentsRepository from '../repositories/fakes/FakeAppointmetRepository';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppoimentsRepository;
let listProvidersMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppoimentsRepository();
    listProvidersMonthAvailability = new ListProviderMonthAvailabilityService();
  });

  it('should be able to list the month availibily from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2021, 5, 20, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2021, 5, 21, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2021, 5, 22, 8, 0, 0),
    });

    const availability = listProvidersMonthAvailability.execute({
      user_id: 'user',
      year: 2021,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: false },
        { day: 22, available: true },
      ]),
    );
  });
});
