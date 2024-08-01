import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { RequestedFor, requestWithTempUser } from '../../types/types';
import { checkPasswords } from '../../../security/passwords/password';
import { createJwt } from '../../../security/jwt/createJwt';
import { UserModel } from '../../models/users/userSchema';
const verifyOtpForgotPassword: sync_middleware_type = async_error_handler(
  async (req: requestWithTempUser, res, next) => {
    if (!req.tempUser)
      throw new Custom_error({
        errors: [{ message: 'noUserFound' }],
        statusCode: 401,
      });
    const { otp } = req.body;
    console.log(otp, req.deviceFingerprint);
    if (
      !(await checkPasswords(
        req.deviceFingerprint!,
        req.tempUser.deviceFingerprint
      ))
    )
      throw new Custom_error({
        errors: [{ message: 'invalidOtp' }],
        statusCode: 401,
      });
    if (req.tempUser.requestedFor != RequestedFor.FORGOT_PASSWORD)
      throw new Custom_error({
        errors: [{ message: 'sorryWrongRoute' }],
        statusCode: 401,
      });

    if (!(await checkPasswords(otp, req.tempUser.otp)))
      throw new Custom_error({
        errors: [{ message: 'invalidOtp' }],
        statusCode: 401,
      });
    const permanentUser = await UserModel.find_one({
      email: req.tempUser.email,
    });
    const token = await createJwt(
      { _id: req.tempUser?._id, permanentUser_id: permanentUser?._id },
      process.env.FORGOT_PASSWORD_SECRET_AFTER_OTP!,
      { expiresIn: process.env.CHANGE_PASSWORD_WINDOW }
    );
    const response = new Custom_response(
      true,
      null,
      { token },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { verifyOtpForgotPassword };
