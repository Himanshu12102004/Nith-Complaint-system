import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { UserModel } from '../../models/userSchema';
import { encrypt } from '../../../security/secrets/encrypt';

const getEngineersUnderYou: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const designation = req.permanentUser?.designation;
    let engineersUnderYou;
    if (designation == Designations.CHIEF_EXECUTIVE_ENGINEER)
      engineersUnderYou = await UserModel.find({
        designation: encrypt(Designations.ASSISTANT_ENGINEER),
        isVerifiedByCEE: true,
      });
    else if (designation == Designations.ASSISTANT_ENGINEER)
      engineersUnderYou = await UserModel.find({
        designation: encrypt(Designations.JUNIOR_ENGINEER),
        isVerifiedByCEE: true,
      });
    else {
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    }
    const response = new Custom_response(
      true,
      null,
      { engineersUnderYou },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getEngineersUnderYou };
