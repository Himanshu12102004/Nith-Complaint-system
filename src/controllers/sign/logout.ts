import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { jwtVerification } from '../../../security/jwt/decodeJwt';
import { UserModel } from '../../models/users/userSchema';
import { SessionModel } from '../../models/users/sessionModel';

const logout: sync_middleware_type = async_error_handler(
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

    await UserModel.updateOne(
      { _id: decodedJWT._id },
      { $pull: { sessions: token } }
    );

    await SessionModel.deleteOne({ refreshToken: token });

    const response = new Custom_response(
      true,
      null,
      'loggedOutSuccessfully',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);

export { logout };
