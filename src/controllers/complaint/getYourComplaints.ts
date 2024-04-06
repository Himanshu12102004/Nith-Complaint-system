import {
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermanentUser } from '../../types/types';
import { UserModel } from '../../models/userSchema';

const getYourComplaints: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    try {
      const yourComplaints = await UserModel.findById(
        req.permanentUser?._id
      ).populate('complaints');
      res.status(200).json({ complaints: yourComplaints?.complaints });
    } catch (error) {
      next(error);
    }
  }
);
export { getYourComplaints };
