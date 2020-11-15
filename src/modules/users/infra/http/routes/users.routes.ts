import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import multer from 'multer';
import UsersController from '../controllers/UsersController';
import UsersAvatarController from '../controllers/UsersAvatarController';
import UploadConfig from '@config/upload';
const usersRouter = Router();
const upload = multer(UploadConfig)
const usersController = new UsersController();
const usersAvatarControler = new UsersAvatarController();

usersRouter.post('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }
}), usersController.create);

usersRouter.patch('/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersAvatarControler.update

)

export default usersRouter;
