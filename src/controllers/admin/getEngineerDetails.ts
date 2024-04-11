import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithEngineer } from '../../types/types';
import { UserModel } from '../../models/userSchema';

const getEngineerDetails: sync_middleware_type = async_error_handler(
  async (req: requestWithEngineer, res, next) => {
    const { engineer } = req.body;
    const engineerInDatabase = await UserModel.findById(engineer, {
      sessions: false,
      password: false,
    })
      .populate({
        path: 'assignedComplaints',
        options: {
          sort: { lodgedOn: -1 },
        },
      })
      .exec();

    const response = new Custom_response(
      true,
      null,
      { engineer: engineerInDatabase },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getEngineerDetails };
