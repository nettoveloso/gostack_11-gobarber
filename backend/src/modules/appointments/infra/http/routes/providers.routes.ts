import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';

const providerRouter = Router();
const appointmentsController = new ProvidersController();

providerRouter.use(ensureAuthenticated);

providerRouter.get('/', appointmentsController.index);

export default providerRouter;
