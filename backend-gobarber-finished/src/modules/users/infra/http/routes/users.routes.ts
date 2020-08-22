import { Router } from 'express';
import multer from 'multer';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';
import UsersController from '../controllers/UsersController';
import UserAvartarController from '../controllers/UserAvatarController';

const usersRoutes = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvartarController();
const upload = multer(uploadConfig.multer);

usersRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRoutes;
