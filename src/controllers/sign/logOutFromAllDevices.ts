import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermanentUser } from '../../types/types';
import { SessionModel } from '../../models/sessionModel';
import { UserModel } from '../../models/userSchema';
import { jwtVerification } from '../../../security/jwt/decodeJwt';

const logOutFromAllDevices: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const jwt: string = req.headers.authentication as string;
    if (!jwt)
      throw new Custom_error({
        errors: [{ message: 'noJWTFound' }],
        statusCode: 401,
      });
    if (!jwt.startsWith('Bearer'))
      throw new Custom_error({
        errors: [{ message: 'invalidJwt' }],
        statusCode: 400,
      });
    const token = jwt.split(' ')[1];
    const decodedJWT = (await jwtVerification(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    )) as { _id: string };
    const permanentUser = await UserModel.findById(decodedJWT._id).select(
      '+password'
    );
    if (!permanentUser)
      throw new Custom_error({
        errors: [{ message: 'youAreNotLoggedIn' }],
        statusCode: 401,
      });

    permanentUser?.sessions.forEach(async (elem) => {
      await SessionModel.deleteOne({ refreshToken: elem });
    });
    await UserModel.findByIdAndUpdate(permanentUser?._id, {
      $set: { sessions: [] },
    });
    const response = new Custom_response(
      true,
      null,
      'loggedOutSuccessFully',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { logOutFromAllDevices };
