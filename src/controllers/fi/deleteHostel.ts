import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { HostelModel } from '../../models/hostelModel';
const deleteHostel: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const { hostel } = req.body;
    if (req.permanentUser?.designation != Designations.FI_CONSTRUCTION_CELL)
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    if (!hostel)
      throw new Custom_error({
        errors: [{ message: 'hostelNameRequired' }],
        statusCode: 400,
      });
    const existingHostel = await HostelModel.findOne({ name: hostel });
    if (!existingHostel)
      throw new Custom_error({
        errors: [{ message: 'hostelNotFound' }],
        statusCode: 404,
      });
    await HostelModel.findOneAndDelete({ name: hostel });
    const response = new Custom_response(
      true,
      null,
      'hostelDeletedSuccessfully',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { deleteHostel };
