import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermanentUser } from '../../types/types';
import { UserModel } from '../../models/users/userSchema';
import { jwtVerification } from '../../../security/jwt/decodeJwt';
const getUserFromPermanent: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
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
    const decodedJWT = (await jwtVerification(
      jwt.split(' ')[1],
      process.env.ACCESS_TOKEN_SECRET!
    )) as { _id: string };
    const permanentUser = await UserModel.findById(decodedJWT._id).select(
      '+password'
    );
    if (!permanentUser)
      throw new Custom_error({
        errors: [{ message: 'youAreNotLoggedIn' }],
        statusCode: 401,
      });
    req.permanentUser = permanentUser.toJSON();
    next();
  }
);
export { getUserFromPermanent };
