import { Router } from 'express';
import AppointmentsController from '../controllers/AppointmentsController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appoimentsRouter = Router();
const appointmentsController = new AppointmentsController();

appoimentsRouter.use(ensureAuthenticated);

appoimentsRouter.post('/', appointmentsController.create);

export default appoimentsRouter;
