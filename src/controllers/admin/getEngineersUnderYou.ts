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
    const all = req.query;

    let engineersUnderYou;
    if (designation == Designations.CHIEF_EXECUTIVE_ENGINEER) {
      engineersUnderYou = await UserModel.find(
        {
          $or: [
            { designation: encrypt(Designations.ASSISTANT_ENGINEER) },
            { designation: encrypt(Designations.JUNIOR_ENGINEER) },
            { designation: encrypt(Designations.SUPERVISOR) },
          ],
          isVerifiedByCEE: true,
        },
        { password: false, sessions: false }
      );
    } else if (designation == Designations.ASSISTANT_ENGINEER)
      engineersUnderYou = await UserModel.find(
        {
          $or: [
            { designation: encrypt(Designations.JUNIOR_ENGINEER) },
            { designation: encrypt(Designations.SUPERVISOR) },
          ],
          isVerifiedByCEE: true,
        },
        { password: false, sessions: false }
      );
    else if (designation == Designations.JUNIOR_ENGINEER)
      engineersUnderYou = await UserModel.find(
        {
          isVerifiedByCEE: true,
          designation: encrypt(Designations.SUPERVISOR),
        },
        { password: false, sessions: false }
      );
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
