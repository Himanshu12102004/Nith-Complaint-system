import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { ComplaintModel } from '../../models/complaintModel';
const setTentativeDateOfCompletion: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const permanentUser = req.permanentUser;
    if (permanentUser?.designation != Designations.JUNIOR_ENGINEER)
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    const { complaintId, tentativeDateOfCompletion } = req.body.complaintId;
    if (!complaintId)
      throw new Custom_error({
        errors: [{ message: 'sendAComplaintId' }],
        statusCode: 400,
      });
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint)
      throw new Custom_error({
        errors: [{ message: 'noSuchComplaint' }],
        statusCode: 400,
      });
    if (tentativeDateOfCompletion < new Date(Date.now()))
      throw new Custom_error({
        errors: [{ message: 'invaliDDateOfTentaiveCompletion' }],
        statusCode: 400,
      });
    await ComplaintModel.findByIdAndUpdate(complaintId, {
      tentativeDateOfCompletion,
    });
    const response = new Custom_response(
      true,
      null,
      'tentatieDateOfCompltionDone',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { setTentativeDateOfCompletion };
