import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { HostelModel } from '../../models/hostel/hostelModel';

const makeHostel: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const { hostel } = req.body;
    let user = req.permanentUser;
    if (
      user?.designation != Designations.ASSOCIATE_DEAN_CIVIL &&
      user?.designation != Designations.ASSOCIATE_DEAN_ELECTRICAl
    )
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
    if (existingHostel)
      throw new Custom_error({
        errors: [{ message: 'hostelAlreadyExists' }],
        statusCode: 400,
      });
    const builtHostel = HostelModel.build({ name: hostel });
    await builtHostel.save();
    const response = new Custom_response(
      true,
      null,
      'hostelAddedSuccessfully',
      'success',
      201,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { makeHostel };
