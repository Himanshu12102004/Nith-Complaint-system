import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  requestWithDeviceFingerprint,
  Designations,
} from '../../../types/types';
import { TemporaryUserModel } from '../../../models/users/temporaryUser';
import { UserModel } from '../../../models/users/userSchema';
import { HostelModel } from '../../../models/hostel/hostelModel';
import { encrypt } from '../../../../security/secrets/encrypt';
const signUpValidation: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    const { name, phone, email, designation, hostel, department, password } =
      req.body;
    if (!name)
      throw new Custom_error({
        errors: [{ message: 'pleaseGiveYourName' }],
        statusCode: 400,
      });
    if (!password)
      throw new Custom_error({
        errors: [{ message: 'pleaseGivePassword' }],
        statusCode: 400,
      });
    if (!phone)
      throw new Custom_error({
        errors: [{ message: 'pleaseGiveYourPhone' }],
        statusCode: 400,
      });

    if (!email)
      throw new Custom_error({
        errors: [{ message: 'pleaseGiveYourEmail' }],
        statusCode: 400,
      });

    if (!designation)
      throw new Custom_error({
        errors: [{ message: 'pleaseGiveYourDesignation' }],
        statusCode: 400,
      });
    if (
      !(
        designation == Designations.WARDEN ||
        designation == Designations.JUNIOR_ENGINEER ||
        designation == Designations.ASSISTANT_ENGINEER ||
        designation == Designations.FACULTY ||
        designation == Designations.CHIEF_EXECUTIVE_ENGINEER ||
        designation == Designations.SUPERVISOR ||
        designation == Designations.FI_CONSTRUCTION_CELL
      )
    ) {
      throw new Custom_error({
        errors: [{ message: 'pleaseGiveAValidDesignation' }],
        statusCode: 400,
      });
    }
    if (designation == Designations.WARDEN && !hostel)
      throw new Custom_error({
        errors: [{ message: 'pleaseGiveYourHostel' }],
        statusCode: 400,
      });
    if (designation == Designations.WARDEN) {
      const existingHostel = await HostelModel.findOne({ name: hostel });
      const existingWarden = await UserModel.findOne({
        hostel: encrypt(hostel.trim()),
      });
      const existingWardenInTemp = await TemporaryUserModel.findOne({
        hostel: encrypt(hostel.trim()),
      });

      if (!existingHostel)
        throw new Custom_error({
          errors: [{ message: 'pleaseGiveAValidHostel' }],
          statusCode: 400,
        });
      if (existingWardenInTemp)
        if (existingWardenInTemp.expires > new Date(Date.now()))
          throw new Custom_error({
            errors: [{ message: 'tryAfterSomeTime' }],
            statusCode: 400,
          });
        else
          await TemporaryUserModel.findByIdAndDelete(existingWardenInTemp._id);
      if (existingWarden)
        throw new Custom_error({
          errors: [{ message: 'wardenAlreadyExists' }],
          statusCode: 400,
        });
    }

    if (designation == Designations.FACULTY && !department)
      throw new Custom_error({
        errors: [{ message: 'pleaseGiveYourDepartment' }],
        statusCode: 400,
      });
    const alreadyUserEmail = await TemporaryUserModel.find_one({ email });
    const alreadyUserPhone = await TemporaryUserModel.find_one({ phone });
    if (alreadyUserEmail) {
      if (alreadyUserEmail.expires > new Date(Date.now()))
        throw new Custom_error({
          errors: [{ message: 'tryAfterSomeTime' }],
          statusCode: 400,
        });
      else await TemporaryUserModel.findByIdAndDelete(alreadyUserEmail._id);
    }
    console.log(alreadyUserPhone);
    if (alreadyUserPhone) {
      if (alreadyUserPhone.expires > new Date(Date.now()))
        throw new Custom_error({
          errors: [{ message: 'tryAfterSomeTime' }],
          statusCode: 400,
        });
      else await TemporaryUserModel.findByIdAndDelete(alreadyUserPhone._id);
    }
    const permanentUserEmail = await UserModel.find_one({ email });
    const permanentUserPhone = await UserModel.find_one({ phone });
    if (permanentUserEmail)
      throw new Custom_error({
        errors: [{ message: 'emailAlreadyRegistered' }],
        statusCode: 400,
      });
    if (permanentUserPhone)
      throw new Custom_error({
        errors: [{ message: 'phoneAlreadyRegistered' }],
        statusCode: 400,
      });

    next();
  }
);
export { signUpValidation };
