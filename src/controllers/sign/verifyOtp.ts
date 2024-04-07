import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithTempUser } from '../../types/types';
import { checkPasswords } from '../../../security/passwords/password';
import { UserModel } from '../../models/userSchema';
import { TemporaryUserModel } from '../../models/temporaryUser';
import { createJwt } from '../../../security/jwt/createJwt';
import { SessionModel } from '../../models/sessionModel';
const verifyOtp: sync_middleware_type = async_error_handler(
  async (req: requestWithTempUser, res, next) => {
    if (!req.tempUser)
      throw new Custom_error({
        errors: [{ message: 'noUserFound' }],
        statusCode: 401,
      });
    const { otp } = req.body;
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
    if (!(await checkPasswords(otp, req.tempUser.otp)))
      throw new Custom_error({
        errors: [{ message: 'invalidOtp' }],
        statusCode: 401,
      });
    const { name, phone, email, designation, hostel, department, password } =
      req.tempUser;
    const user = UserModel.build({
      name,
      phone,
      email,
      designation: designation as Designations,
      hostel,
      department,
      password,
    });
    await user.save();
    await TemporaryUserModel.findByIdAndDelete(req.tempUser._id);
    const accessToken = await createJwt(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: process.env.ACCESS_TOKEN_TIME }
    );
    const refreshToken = await createJwt(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: process.env.REFRESH_TOKEN_TIME }
    );
    const thisSession = SessionModel.build({
      refreshToken,
      deviceFingerprint: req.deviceFingerprint!,
    });
    await thisSession.save();
    await UserModel.findByIdAndUpdate(user._id, {
      $push: { sessions: refreshToken },
    });
    const response = new Custom_response(
      true,
      null,
      { accessToken, refreshToken },
      'success',
      201,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { verifyOtp };
