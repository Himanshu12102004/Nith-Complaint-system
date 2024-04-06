import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithDeviceFingerprint, Designations } from '../types/types';
import { TemporaryUserModel } from '../models/temporaryUser';
import { UserModel } from '../models/userSchema';
const signUpValidation: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    const { name, phone, email, designation, hostel, department, password } =
      req.body;
    if (!name)
      next(
        new Custom_error({
          errors: [{ message: 'pleaseGiveYourName' }],
          statusCode: 400,
        })
      );
    if (!password)
      next(
        new Custom_error({
          errors: [{ message: 'pleaseGivePassword' }],
          statusCode: 400,
        })
      );
    if (!phone)
      next(
        new Custom_error({
          errors: [{ message: 'pleaseGiveYourPhone' }],
          statusCode: 400,
        })
      );

    if (!email)
      next(
        new Custom_error({
          errors: [{ message: 'pleaseGiveYourEmail' }],
          statusCode: 400,
        })
      );

    if (!designation)
      next(
        new Custom_error({
          errors: [{ message: 'pleaseGiveYourDesignation' }],
          statusCode: 400,
        })
      );
    if (
      !(
        designation == Designations.WARDEN ||
        designation == Designations.JUNIOR_ENGINEER ||
        designation == Designations.ASSISTANT_ENGINEER ||
        designation == Designations.FACULTY ||
        designation == Designations.CHIEF_EXECUTIVE_ENGINEER
      )
    ) {
      next(
        new Custom_error({
          errors: [{ message: 'pleaseGiveAValidDesignation' }],
          statusCode: 400,
        })
      );
    }
    if (designation == Designations.WARDEN && !hostel)
      next(
        new Custom_error({
          errors: [{ message: 'pleaseGiveYourHostel' }],
          statusCode: 400,
        })
      );
    if (designation == Designations.FACULTY && !department)
      next(
        new Custom_error({
          errors: [{ message: 'pleaseGiveYourDepartment' }],
          statusCode: 400,
        })
      );
    const alreadyUser = await TemporaryUserModel.find_one({ email });
    if (alreadyUser) {
      if (alreadyUser.expires > new Date(Date.now()))
        next(
          new Custom_error({
            errors: [{ message: 'tryAfterSomeTime' }],
            statusCode: 400,
          })
        );
      else await TemporaryUserModel.findByIdAndDelete(alreadyUser._id);
    }
    const permanentUserEmail = await UserModel.find_one({ email });
    const permanentUserPhone = await UserModel.find_one({ phone });
    if (permanentUserEmail)
      next(
        new Custom_error({
          errors: [{ message: 'emailAlreadyRegistered' }],
          statusCode: 400,
        })
      );
    if (permanentUserPhone)
      next(
        new Custom_error({
          errors: [{ message: 'phoneAlreadyRegistered' }],
          statusCode: 400,
        })
      );

    next();
  }
);
export { signUpValidation };
