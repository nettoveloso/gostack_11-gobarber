import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmetRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 6, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2021, 6, 10, 12),
      provider_id: '123123',
      user_id: '1231232',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointment on the same time', async () => {
    const appointmentDate = new Date(2021, 6, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: '1231232',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123123',
        user_id: '1231232',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create an appointment on past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 5, 20, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 20, 11),
        provider_id: '123123',
        user_id: '1231232',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 5, 20, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 20, 11),
        provider_id: '123123',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 5, 20, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 20, 7),
        provider_id: 'user_id',
        user_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 20, 18),
        provider_id: 'user_id',
        user_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
