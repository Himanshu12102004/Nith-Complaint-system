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
import { checkPasswords } from '../../../security/passwords/password';
import { UserModel } from '../../models/users/userSchema';
import { TemporaryUserModel } from '../../models/users/temporaryUser';
import { createJwt } from '../../../security/jwt/createJwt';
import { SessionModel } from '../../models/users/sessionModel';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';
import { encrypt } from '../../../security/secrets/encrypt';
import { io } from '../../socket';
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
    if (req.tempUser.requestedFor != RequestedFor.EMAIL_VERIFICATION)
      throw new Custom_error({
        errors: [{ message: 'sorryWrongRoute' }],
        statusCode: 401,
      });
    const permanentUserEmail = await UserModel.find_one({ email });
    const permanentUserPhone = await UserModel.find_one({ phone });
    let user: any;
    if (permanentUserEmail && permanentUserEmail.isDeleted) {
      user = permanentUserEmail;
      await UserModel.updateOne(permanentUserEmail._id, {
        isDeleted: false,
        isVerifiedByCEE: false,
      });
    } else if (permanentUserPhone && permanentUserPhone.isDeleted) {
      user = permanentUserPhone;
      await UserModel.updateOne(permanentUserPhone._id, {
        isDeleted: false,
        isVerifiedByCEE: false,
      });
    } else {
      user = UserModel.build({
        name,
        phone,
        email,
        designation: designation as Designations,
        hostel,
        department,
        password,
      });
      await user.save();
    }
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
      operatingSystem: req.operatingSystem!,
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
    if (
      designation == Designations.ASSISTANT_ENGINEER ||
      designation == Designations.JUNIOR_ENGINEER ||
      designation == Designations.SUPERVISOR
    ) {
      const ceeIdCivil: any = await UserModel.findOne({
        designation: encrypt(Designations.EXECUTIVE_ENGINEER_CIVIL),
      });
      if (global.connectedUsers.get(ceeIdCivil!._id.toString()))
        io.to(global.connectedUsers.get(ceeIdCivil!._id.toString())!).emit(
          'newEngineer',
          'getUnverifiedEngineers'
        );
      const ceeIdElectrical: any = await UserModel.findOne({
        designation: encrypt(Designations.EXECUTIVE_ENGINEER_ELECTRICAL),
      });
      if (global.connectedUsers.get(ceeIdElectrical!._id.toString()))
        io.to(global.connectedUsers.get(ceeIdElectrical!._id.toString())!).emit(
          'newEngineer',
          'getUnverifiedEngineers'
        );
    }
    sendMailViaThread({
      text: 'Thank You For Choosing Us',
      subject: 'Construction Cell',
      from_info: `${process.env.EMAIL}`,
      html: '<h1>Thank You For Choosing Us<h1>',
      toSendMail: email,
      cc: null,
      attachment: null,
    });
    res.status(response.statusCode).json(response);
  }
);
export { verifyOtp };
