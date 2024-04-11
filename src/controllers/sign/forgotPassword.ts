import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  Designations,
  RequestedFor,
  requestWithPermanentUser,
  requestWithPermanentUserAndDeviceFingerPrint,
  requestWithTempUser,
} from '../../types/types';
import { TemporaryUserModel } from '../../models/temporaryUser';
import { getOtp } from '../../../security/otp/otp';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';
import { createJwt } from '../../../security/jwt/createJwt';
import { UserModel } from '../../models/userSchema';
import { encrypt } from '../../../security/secrets/encrypt';
import { hashPassword } from '../../../security/passwords/password';

const forgotPassword: sync_middleware_type = async_error_handler(
  async (req: requestWithTempUser, res, next) => {
    const { emailForOtp } = req.body;
    if (!emailForOtp)
      throw new Custom_error({
        errors: [{ message: 'pleaseSendTheEmail' }],
        statusCode: 400,
      });
    let permanentUser = await UserModel.findOne({
      email: encrypt(emailForOtp.trim()),
    });
    if (!permanentUser)
      throw new Custom_error({
        errors: [{ message: 'noSuchUser' }],
        statusCode: 404,
      });
    permanentUser = permanentUser?.toJSON();
    console.log(permanentUser);
    const { name, phone, designation, hostel, department, email, password } =
      permanentUser;
    const alreadyUserEmail = await TemporaryUserModel.find_one({ email });
    if (alreadyUserEmail) {
      if (alreadyUserEmail.expires > new Date(Date.now()))
        throw new Custom_error({
          errors: [{ message: 'tryAfterSomeTime' }],
          statusCode: 400,
        });
      else await TemporaryUserModel.findByIdAndDelete(alreadyUserEmail._id);
    }
    const alreadyUserPhone = await TemporaryUserModel.find_one({ phone });
    console.log(alreadyUserPhone);
    if (alreadyUserPhone) {
      if (alreadyUserPhone.expires > new Date(Date.now()))
        throw new Custom_error({
          errors: [{ message: 'tryAfterSomeTime' }],
          statusCode: 400,
        });
      else await TemporaryUserModel.findByIdAndDelete(alreadyUserPhone._id);
    }
    const otp = await getOtp();

    const user = TemporaryUserModel.build({
      name,
      email,
      phone,
      department,
      designation: designation as Designations,
      hostel,
      password: password,
      requestedFor: RequestedFor.FORGOT_PASSWORD,
      deviceFingerprint: await hashPassword(req.deviceFingerprint!),
      otp: otp.hashedOtp,
      expires: new Date(
        Date.now() + parseInt(process.env.TIME_TO_LIVE!) * 1000
      ),
      otpSentTimes: 0,
    });
    await user.save();
    const jwt = await createJwt(
      { _id: user._id, permanentUser_id: permanentUser._id },
      process.env.FORGOT_PASSWORD_SECRET!,
      { expiresIn: process.env.TIME_TO_LIVE_JWT }
    );
    console.log(jwt, email);
    sendMailViaThread({
      text: `Your OTP for the NITH complaint system password change ${otp.generatedOtp}`,
      subject: 'HORIZON Complaint System',
      from_info: process.env.EMAIL!,
      toSendMail: email,
      html: `<h1>Your OTP for the NITH complaint system password change ${otp.generatedOtp}</h1>`,
      cc: null,
      attachment: null,
    });
    const response = new Custom_response(
      true,
      null,
      { token: jwt },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { forgotPassword };
