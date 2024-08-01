import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  Designations,
  requestWithPermanentUser,
  requestWithQueryAndPermanentUser,
} from '../../types/types';
import { UserModel } from '../../models/users/userSchema';
import { encrypt } from '../../../security/secrets/encrypt';

const getEngineersUnderYou: sync_middleware_type = async_error_handler(
  async (req: requestWithQueryAndPermanentUser, res, next) => {
    console.log(req.dbQuery);
    const engineersUnderYou = await UserModel.find(req.dbQuery, {
      sessions: false,
      password: false,
    });
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
