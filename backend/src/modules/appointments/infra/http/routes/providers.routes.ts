import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const providerRouter = Router();

const appointmentsController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

providerRouter.use(ensureAuthenticated);

providerRouter.get('/', appointmentsController.index);

providerRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilityController.index,
);
providerRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityController.index,
);

export default providerRouter;
