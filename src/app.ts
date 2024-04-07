import { Custom_error, error_middleware } from '@himanshu_guptaorg/utils';
import express, { NextFunction, Request, Response } from 'express';
import { signUpInRouter } from './routers/signUpInRouter';
import cors from 'cors';
import { complaintRouter } from './routers/complaintRouter';
import { adminRouter } from './routers/adminRouter';
import { complaintControllerRouter } from './routers/complaintControlsRouter';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1', signUpInRouter);
app.use('/api/v1', complaintRouter);
app.use('/api/v1', adminRouter);
app.use('/api/v1', complaintControllerRouter);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Custom_error({
    errors: [{ message: 'pageNotFound' }],
    statusCode: 404,
  });
  next(err);
});
app.use(error_middleware);
export { app };
