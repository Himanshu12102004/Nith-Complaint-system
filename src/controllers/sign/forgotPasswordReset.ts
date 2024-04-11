import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { jwtVerification } from '../../../security/jwt/decodeJwt';
import { UserModel } from '../../models/userSchema';
import {
  checkPasswords,
  hashPassword,
} from '../../../security/passwords/password';
import { SessionModel } from '../../models/sessionModel';
import { TemporaryUserModel } from '../../models/temporaryUser';
import { RequestedFor, requestWithDeviceFingerprint } from '../../types/types';

const forgotPasswordReset: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    const { newPassword } = req.body;
    if (!newPassword) {
      throw new Custom_error({
        errors: [{ message: 'newPasswordRequired' }],
        statusCode: 401,
      });
    }
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
      process.env.FORGOT_PASSWORD_SECRET_AFTER_OTP!
    )) as { _id: string; permanentUser_id: string };
    const temporaryUser = await TemporaryUserModel.findById(
      decodedJWT._id
    ).select('+deviceFingerprint');
    if (!temporaryUser)
      throw new Custom_error({
        errors: [{ message: 'notRequestedForPasswordChange' }],
        statusCode: 400,
      });
    if (temporaryUser.requestedFor != RequestedFor.FORGOT_PASSWORD) {
      throw new Custom_error({
        errors: [{ message: 'notRequestedForPasswordChange' }],
        statusCode: 400,
      });
    }
    console.log(req.deviceFingerprint, temporaryUser);
    if (
      !(await checkPasswords(
        req.deviceFingerprint!,
        temporaryUser.deviceFingerprint
      ))
    )
      throw new Custom_error({
        errors: [{ message: 'unAuthorizedDevice' }],
        statusCode: 400,
      });
    const permanentUser = await UserModel.findById(
      decodedJWT.permanentUser_id
    ).select('+password');
    if (!permanentUser)
      throw new Custom_error({
        errors: [{ message: 'noSuchUser' }],
        statusCode: 401,
      });
    await UserModel.findByIdAndUpdate(decodedJWT.permanentUser_id, {
      $set: { password: await hashPassword(newPassword) },
    });
    permanentUser?.sessions.forEach(async (elem: string) => {
      await SessionModel.findOneAndDelete({ refreshToken: elem });
    });
    await TemporaryUserModel.findByIdAndDelete(decodedJWT._id);
    await UserModel.findByIdAndUpdate(permanentUser?._id, {
      $set: { sessions: [] },
    });
    const response = new Custom_response(
      true,
      null,
      'passwordChangedSuccessfully',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { forgotPasswordReset };
