import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { UserModel } from '../../models/users/userSchema';
import { encrypt } from '../../../security/secrets/encrypt';
const getUnverifiedEngineers: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    if (req.permanentUser?.designation != Designations.CHIEF_EXECUTIVE_ENGINEER)
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    const unverifiedEngineers = await UserModel.find(
      {
        isVerifiedByCEE: false,
        $or: [
          { designation: encrypt(Designations.ASSISTANT_ENGINEER) },
          { designation: encrypt(Designations.JUNIOR_ENGINEER) },
          { designation: encrypt(Designations.SUPERVISOR) },
        ],
      },
      { sessions: false, password: false }
    );
    const response = new Custom_response(
      true,
      null,
      { unverifiedEngineers },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getUnverifiedEngineers };
