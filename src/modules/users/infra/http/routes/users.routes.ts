import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import multer from 'multer';
import UsersController from '../controllers/UsersController';
import UsersAvatarController from '../controllers/UsersAvatarController';
import UploadConfig from '@config/upload';
const usersRouter = Router();
const upload = multer(UploadConfig)
const usersController = new UsersController();
const usersAvatarControler = new UsersAvatarController();

usersRouter.post('/', usersController.create);

usersRouter.patch('/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersAvatarControler.update

)

export default usersRouter;
