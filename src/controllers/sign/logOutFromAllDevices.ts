import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermanentUser } from '../../types/types';
import { SessionModel } from '../../models/sessionModel';
import { UserModel } from '../../models/userSchema';

const logOutFromAllDevices: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    req.permanentUser?.sessions.forEach(async (elem) => {
      await SessionModel.deleteOne({ refreshToken: elem });
    });
    console.log(req.permanentUser);
    await UserModel.findByIdAndUpdate(req.permanentUser?._id, {
      $set: { sessions: [] },
    });
    const response = new Custom_response(
      true,
      null,
      'loggedOutSuccessFully',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { logOutFromAllDevices };
