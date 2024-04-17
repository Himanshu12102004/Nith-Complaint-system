import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermanentUser } from '../../types/types';
import { UserModel } from '../../models/userSchema';
import { hashPassword } from '../../../security/passwords/password';
import { encrypt } from '../../../security/secrets/encrypt';

const makeEngineers: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    let { name, phone, email, designation, hostel, department, password } =
      req.body;
    password = await hashPassword(password);
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
    await UserModel.updateOne(
      { email: encrypt(email) },
      { $set: { isVerifiedByCEE: true } }
    );
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
