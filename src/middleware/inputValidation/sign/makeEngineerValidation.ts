import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../../types/types';
import crypto from 'crypto';
import { TemporaryUserModel } from '../../../models/temporaryUser';
import { UserModel } from '../../../models/userSchema';
const makeEngineerValidation: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const permanentUser = req.permanentUser;
    if (permanentUser?.designation != Designations.CHIEF_EXECUTIVE_ENGINEER)
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    let { name, phone, email, designation, hostel, department, password } =
      req.body;
    if (!name || !phone || !designation || !password)
      throw new Custom_error({
        errors: [{ message: 'giveAllCredentials' }],
        statusCode: 400,
      });
    if (!email) email = crypto.randomBytes(10).toString('hex');
    if (!department) department = '';
    if (
      !(
        designation == Designations.JUNIOR_ENGINEER ||
        designation == Designations.ASSISTANT_ENGINEER ||
        designation == Designations.SUPERVISOR
      )
    ) {
      throw new Custom_error({
        errors: [{ message: 'pleaseGiveAValidDesignation' }],
        statusCode: 400,
      });
    }
    const alreadyUserEmail = await TemporaryUserModel.find_one({ email });
    if (alreadyUserEmail) {
      if (alreadyUserEmail.expires > new Date(Date.now()))
        throw new Custom_error({
          errors: [{ message: 'tryAfterSomeTime' }],
          statusCode: 400,
        });
      else await TemporaryUserModel.findByIdAndDelete(alreadyUserEmail._id);
    }
    const alreadyUserPhone = await TemporaryUserModel.find_one({ email });
    if (alreadyUserPhone) {
      if (alreadyUserPhone.expires > new Date(Date.now()))
        throw new Custom_error({
          errors: [{ message: 'tryAfterSomeTime' }],
          statusCode: 400,
        });
      else await TemporaryUserModel.findByIdAndDelete(alreadyUserPhone._id);
    }
    const existingEmail = await UserModel.find_one({ email });
    const existingPhone = await UserModel.find_one({ phone });
    if (existingEmail)
      throw new Custom_error({
        errors: [{ message: 'emailAlreadyRegistered' }],
        statusCode: 400,
      });
    if (existingPhone)
      throw new Custom_error({
        errors: [{ message: 'phoneAlreadyRegistered' }],
        statusCode: 400,
      });
    next();
  }
);
export { makeEngineerValidation };
