import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermanentUser } from '../../types/types';

const getCurrentUser: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const user = req.permanentUser;
    const userToBeSent = {
      name: user?.name,
      phone: user?.phone,
      email: user?.email,
      designation: user?.designation,
      hostel: user?.hostel,
      department: user?.department,
      isVerifiedByCEE: user?.isVerifiedByCEE,
      _id: user?._id,
    };
    const response = new Custom_response(
      true,
      null,
      { user: userToBeSent },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getCurrentUser };
