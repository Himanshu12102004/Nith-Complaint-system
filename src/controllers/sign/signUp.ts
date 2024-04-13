import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import path from 'path';
import { TemporaryUserModel } from '../../models/temporaryUser';
import {
  requestWithDeviceFingerprint,
  Designations,
  RequestedFor,
} from '../../types/types';
import { getOtp } from '../../../security/otp/otp';
import { Worker } from 'worker_threads';
import { createJwt } from '../../../security/jwt/createJwt';
import { hashPassword } from '../../../security/passwords/password';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';
import { UserModel } from '../../models/userSchema';
import { encrypt } from '../../../security/secrets/encrypt';
export const signUp: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    const { name, phone, email, designation, hostel, department, password } =
      req.body;
    const cee = await UserModel.findOne({
      designation: encrypt(Designations.CHIEF_EXECUTIVE_ENGINEER),
    });
    const fi = await UserModel.findOne({
      designation: encrypt(Designations.FI_CONSTRUCTION_CELL),
    });
    if (cee && designation == Designations.CHIEF_EXECUTIVE_ENGINEER)
      throw new Custom_error({
        errors: [{ message: 'ceeAlreadyExits' }],
        statusCode: 401,
      });
    if (fi && designation == Designations.FI_CONSTRUCTION_CELL)
      throw new Custom_error({
        errors: [{ message: 'fiAlreadyExits' }],
        statusCode: 401,
      });
    const otp = await getOtp();
    const user = TemporaryUserModel.build({
      name,
      email,
      phone,
      department,
      designation,
      hostel,
      password: await hashPassword(password),
      requestedFor: RequestedFor.EMAIL_VERIFICATION,
      deviceFingerprint: await hashPassword(req.deviceFingerprint!),
      otp: otp.hashedOtp,
      expires: new Date(
        Date.now() + parseInt(process.env.TIME_TO_LIVE!) * 1000
      ),
      otpSentTimes: 0,
    });
    await user.save();
    const thisUser = await TemporaryUserModel.find_one({ email });
    sendMailViaThread({
      text: `Your OTP for the NITH complaint system is ${otp.generatedOtp}`,
      subject: 'HORIZON Complaint System',
      from_info: process.env.EMAIL!,
      toSendMail: email,
      html: `<h1>Your OTP for the NITH complaint system is ${otp.generatedOtp}</h1>`,
      cc: null,
      attachment: null,
    });
    const jwtForOtp = await createJwt(
      { _id: thisUser!._id, otpTimes: thisUser!.otpSentTimes },
      process.env.OTP_JWT_SECRET!,
      { expiresIn: process.env.TIME_TO_LIVE_JWT }
    );
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
