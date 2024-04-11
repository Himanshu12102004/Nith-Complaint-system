import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermanentUserAndParsedFilters } from '../../types/types';
import { UserModel } from '../../models/userSchema';
const getYourComplaints: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUserAndParsedFilters, res, next) => {
    const yourComplaints = await UserModel.findById(req.permanentUser?._id)
      .populate({
        path: 'complaints',
        match: req.parsedFilters,
        options: {
          sort: { lodgedOn: -1 },
        },
      })
      .exec();
    let complaint = yourComplaints?.complaints;
    const { pageNo, pageSize } = req.moreFilters.pages;
    const totalComplatints = complaint?.length;
    const totalPages = Math.ceil(totalComplatints! / pageSize);
    complaint = complaint?.slice(
      (pageNo - 1) * pageSize,
      (pageNo - 1) * pageSize + pageSize
    );
    const response = new Custom_response(
      true,
      null,
      {
        complaints: complaint,
        totalComplatints: totalComplatints,
        totalPages,
      },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getYourComplaints };
