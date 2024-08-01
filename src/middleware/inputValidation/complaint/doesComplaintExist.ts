import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { ComplaintModel } from '../../../models/complaints/complaintModel';
import { requestWithComplaintAndEngineer } from '../../../types/types';
const doesComplaintExist: sync_middleware_type = async_error_handler(
  async (req: requestWithComplaintAndEngineer, res, next) => {
    const { complaint } = req.body;
    if (!complaint)
      throw new Custom_error({
        errors: [{ message: 'pleaseGiveComplaintID' }],
        statusCode: 400,
      });
    const complaintInDatabase = await ComplaintModel.findById(complaint);
    if (!complaintInDatabase)
      throw new Custom_error({
        errors: [{ message: 'noSuchComplaint' }],
        statusCode: 404,
      });
    req.complaint = complaintInDatabase;
    next();
  }
);
export { doesComplaintExist };
