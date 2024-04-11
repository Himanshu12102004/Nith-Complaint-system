import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { jwtVerification } from '../../../security/jwt/decodeJwt';
import { TemporaryUserModel, UserDoc } from '../../models/temporaryUser';
import { requestWithTempUser } from '../../types/types';
const getUserFromTemp: sync_middleware_type = async_error_handler(
  async (req: requestWithTempUser, res, next) => {
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
    let decodedJWT;
    if (req.query.type == 'forgotPassword')
      decodedJWT = await jwtVerification(
        jwt.split(' ')[1],
        process.env.FORGOT_PASSWORD_SECRET!
      );
    else
      decodedJWT = await jwtVerification(
        jwt.split(' ')[1],
        process.env.OTP_JWT_SECRET!
      );
    const user = await TemporaryUserModel.findById(decodedJWT._id).select(
      '+password +deviceFingerprint'
    );
    if (!user) {
      throw new Custom_error({
        errors: [{ message: 'otpExpired' }],
        statusCode: 401,
      });
    }
    if (user.expires < new Date(Date.now()))
      throw new Custom_error({
        errors: [{ message: 'otpExpired' }],
        statusCode: 401,
      });
    req.tempUser = user.toJSON();
    console.log(req.tempUser);
    next();
  }
);
export { getUserFromTemp };
