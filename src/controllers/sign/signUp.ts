import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { TemporaryUserModel } from '../../models/users/temporaryUser';
import {
  requestWithDeviceFingerprint,
  Designations,
  RequestedFor,
} from '../../types/types';
import { getOtp } from '../../../security/otp/otp';
import { createJwt } from '../../../security/jwt/createJwt';
import { hashPassword } from '../../../security/passwords/password';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';
import { UserModel } from '../../models/users/userSchema';
import { encrypt } from '../../../security/secrets/encrypt';
export const signUp: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    const { name, phone, email, designation, hostel, department, password } =
      req.body;
    const ceeCivil = await UserModel.find({
      designation: encrypt(Designations.EXECUTIVE_ENGINEER_CIVIL),
    });
    const fiCivil = await UserModel.find({
      designation: encrypt(Designations.ASSOCIATE_DEAN_CIVIL),
    });
    const ceeElectrical = await UserModel.find({
      designation: encrypt(Designations.EXECUTIVE_ENGINEER_ELECTRICAL),
    });
    const fiElectrical = await UserModel.find({
      designation: encrypt(Designations.ASSOCIATE_DEAN_ELECTRICAl),
    });
    let ch = (email as string).charAt(0);
    // if (ch >= '0' && ch <= '9')
    //   throw new Custom_error({
    //     errors: [{ message: 'emailShouldNotStartWithANumber' }],
    //     statusCode: 401,
    //   });
    // if (!(email as string).endsWith('@nith.ac.in'))
    //   throw new Custom_error({
    //     errors: [{ message: 'useNithEmail' }],
    //     statusCode: 401,
    //   });
    // console.log(ceeCivil);
    if (
      (ceeCivil.length == 1 &&
        designation == Designations.EXECUTIVE_ENGINEER_CIVIL) ||
      (ceeElectrical.length == 1 &&
        designation == Designations.EXECUTIVE_ENGINEER_ELECTRICAL) ||
      (fiElectrical.length == 1 &&
        designation == Designations.ASSOCIATE_DEAN_ELECTRICAl) ||
      (fiCivil.length == 1 && designation == Designations.ASSOCIATE_DEAN_CIVIL)
    ) {
      throw new Custom_error({
        errors: [{ message: 'thisPostIsAlreadyRegistered' }],
        statusCode: 401,
      });
    }
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
      subject: 'Construction Cell Complaint System',
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
