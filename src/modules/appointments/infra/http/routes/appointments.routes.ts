import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import AppointmentsController from '../controllers/AppointmentsController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';
const appoimentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerappointmentsController = new ProviderAppointmentsController();
appoimentsRouter.use(ensureAuthenticated);

appoimentsRouter.post('/', celebrate({
  [Segments.BODY]: {
    provider_id: Joi.string().uuid().required(),
    date: Joi.date(),
  }
}), appointmentsController.create);
appoimentsRouter.get('/me', providerappointmentsController.index);
export default appoimentsRouter;
