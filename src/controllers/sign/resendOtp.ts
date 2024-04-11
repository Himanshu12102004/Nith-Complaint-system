import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  Designations,
  RequestedFor,
  requestWithTempUser,
} from '../../types/types';
import { getOtp } from '../../../security/otp/otp';
import { TemporaryUserModel } from '../../models/temporaryUser';
import { createJwt } from '../../../security/jwt/createJwt';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';
import { UserModel } from '../../models/userSchema';
const resendOtp: sync_middleware_type = async_error_handler(
  async (req: requestWithTempUser, res, next) => {
    const {
      name,
      email,
      phone,
      designation,
      hostel,
      department,
      password,
      deviceFingerprint,
      otpSentTimes,
      requestedFor,
      _id,
    } = req.tempUser!;
    if (otpSentTimes >= 3)
      throw new Custom_error({
        errors: [{ message: 'tryAgainAfterSomeTime' }],
        statusCode: 400,
      });
    const otp = await getOtp();
    await TemporaryUserModel.findByIdAndDelete(_id);
    const thisUser = TemporaryUserModel.build({
      name,
      email,
      phone,
      designation: designation as Designations,
      hostel,
      department,
      password,
      deviceFingerprint,
      requestedFor: requestedFor as RequestedFor,
      otp: otp.hashedOtp,
      expires: new Date(
        Date.now() + parseInt(process.env.TIME_TO_LIVE!) * 1000
      ),
      otpSentTimes: otpSentTimes + 1,
    });
    await thisUser.save();
    let jwtForOtp;
    if (requestedFor == RequestedFor.EMAIL_VERIFICATION) {
      jwtForOtp = await createJwt(
        { _id: thisUser!._id },
        process.env.OTP_JWT_SECRET!,
        { expiresIn: process.env.TIME_TO_LIVE_JWT }
      );
      sendMailViaThread({
        text: `Your OTP for the NITH complaint system is ${otp.generatedOtp}`,
        subject: 'HORIZON Complaint System',
        from_info: process.env.EMAIL!,
        toSendMail: email,
        html: `<h1>Your OTP for the NITH complaint system is ${otp.generatedOtp}</h1>`,
        cc: null,
        attachment: null,
      });
    }
    if (requestedFor == RequestedFor.FORGOT_PASSWORD) {
      const permanentUser = await UserModel.find_one({ email });
      if (!permanentUser)
        throw new Custom_error({
          errors: [{ message: 'noSuchUser' }],
          statusCode: 404,
        });
      jwtForOtp = await createJwt(
        { _id: thisUser!._id, permanentUser_id: permanentUser._id },
        process.env.FORGOT_PASSWORD_SECRET!,
        {
          expiresIn: process.env.TIME_TO_LIVE_JWT,
        }
      );
      sendMailViaThread({
        text: `Your OTP for the NITH complaint system password change ${otp.generatedOtp}`,
        subject: 'HORIZON Complaint System',
        from_info: process.env.EMAIL!,
        toSendMail: email,
        html: `<h1>Your OTP for the NITH complaint system password change ${otp.generatedOtp}</h1>`,
        cc: null,
        attachment: null,
      });
    }
    const response = new Custom_response(
      true,
      null,
      { token: jwtForOtp },
      'success',
      201,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { resendOtp };
