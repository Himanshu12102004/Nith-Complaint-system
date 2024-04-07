import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  Designations,
  requestWithPermanentUserAndParsedFilters,
} from '../../types/types';
import { UserModel } from '../../models/userSchema';

const getYourComplaints: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUserAndParsedFilters, res, next) => {
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
    } catch (error) {
      next(error);
    }
  }
);
export { getYourComplaints };
