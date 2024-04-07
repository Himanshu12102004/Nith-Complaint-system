import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { UserModel } from '../../models/userSchema';

const getYourComplaints: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    try {
      if (
        req.permanentUser?.designation == Designations.ASSISTANT_ENGINEER ||
        req.permanentUser?.designation == Designations.JUNIOR_ENGINEER ||
        req.permanentUser?.designation == Designations.CHIEF_EXECUTIVE_ENGINEER
      )
        throw new Custom_error({
          errors: [{ message: 'notAllowedToSeeYourComplaints' }],
          statusCode: 403,
        });
      const yourComplaints = await UserModel.findById(
        req.permanentUser?._id
      ).populate('complaints');
      const response = new Custom_response(
        true,
        null,
        { complaints: yourComplaints?.complaints },
        'success',
        200,
        null
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);
export { getYourComplaints };
