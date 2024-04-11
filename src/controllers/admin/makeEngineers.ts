import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import crypto from 'crypto';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { UserModel } from '../../models/userSchema';
import { TemporaryUserModel } from '../../models/temporaryUser';
import { hashPassword } from '../../../security/passwords/password';

const makeEngineers: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    let { name, phone, email, designation, hostel, department, password } =
      req.body;
    password = hashPassword(password);
    const madeUser = UserModel.build({
      name,
      email,
      password,
      phone,
      designation,
      hostel,
      department,
    });
    await madeUser.save();
    const response = new Custom_response(
      true,
      null,
      'madeNewUserSuccessfully',
      'success',
      201,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { makeEngineers };
