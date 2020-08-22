import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppErrors from '@shared/errors/AppErrors';
import routes from '@shared/infra/http/routes';

import '@shared/infra/database';
import '@shared/container/';
import { errors } from 'celebrate';
import rateLimiter from './middlewares/rateLimiter';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolde));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppErrors) {
    return response.status(err.statusCode).json({
      status: 'erros',
      message: err.message,
    });
  }
  console.error(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log(' 🚀️ Server Started');
});
