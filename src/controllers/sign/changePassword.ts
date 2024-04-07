import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermanentUser } from '../../types/types';
import {
  checkPasswords,
  hashPassword,
} from '../../../security/passwords/password';
import { UserModel } from '../../models/userSchema';
import { SessionModel } from '../../models/sessionModel';

const changePassword: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword)
      throw new Custom_error({
        errors: [{ message: 'pleaseSendOldPassword' }],
        statusCode: 400,
      });
    if (!newPassword)
      throw new Custom_error({
        errors: [{ message: 'pleaseSendNewPassword' }],
        statusCode: 400,
      });
    if (!(await checkPasswords(oldPassword, req.permanentUser?.password!)))
      throw new Custom_error({
        errors: [{ message: 'passwordDidNotMatch' }],
        statusCode: 401,
      });
    await UserModel.findByIdAndUpdate(req.permanentUser?._id, {
      $set: { password: await hashPassword(newPassword) },
    });
    req.permanentUser?.sessions.forEach(async (elem: string) => {
      await SessionModel.findOneAndDelete({ refreshToken: elem });
    });
    await UserModel.findByIdAndUpdate(req.permanentUser?._id, {
      $set: { sessions: [] },
    });
    const response = new Custom_response(
      true,
      null,
      'passwordChangedSuccessfully',
      'success',
      201,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { changePassword };
