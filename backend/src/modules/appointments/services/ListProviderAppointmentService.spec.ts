import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmetRepository';

import ListProviderAppointmentService from './ListProviderAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentService(
      fakeAppointmentRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointments a specific day', async () => {
    const appointment_1 = await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 7, 20, 14, 0, 0),
    });

    const appointment_2 = await fakeAppointmentRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 7, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2021,
      month: 8,
      day: 20,
    });

    expect(appointments).toEqual([appointment_1, appointment_2]);
  });
});
