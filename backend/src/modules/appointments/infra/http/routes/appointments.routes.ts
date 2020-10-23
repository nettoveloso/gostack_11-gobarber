import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const appointmentsRespository = new AppointmentRepository();

appointmentsRouter.use(ensureAuthenticated);

/* appointmentsRouter.get('/', async (request, response) => {
  const appointments = await appointmentsRepository.find();
  return response.json(appointments);
}); */

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parserDate = parseISO(date);

  const createAppointment = new CreateAppointmentService(
    appointmentsRespository,
  );

  const appointment = await createAppointment.execute({
    date: parserDate,
    provider_id,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
