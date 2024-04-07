import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { ComplaintModel } from '../../models/complaintModel';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';
import { UserModel } from '../../models/userSchema';
const closeComplaint: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const { complaintToBeClosed } = req.body;
    const permanentUser = req.permanentUser;
    if (
      permanentUser?.designation == Designations.ASSISTANT_ENGINEER ||
      permanentUser?.designation == Designations.CHIEF_EXECUTIVE_ENGINEER
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    const yourComplaint = await ComplaintModel.findById(complaintToBeClosed);
    if (!yourComplaint)
      throw new Custom_error({
        errors: [{ message: 'noSuchComplaint' }],
        statusCode: 401,
      });
    if (
      permanentUser?.designation == Designations.JUNIOR_ENGINEER &&
      JSON.stringify(yourComplaint.currentlyAssignedTo) ==
        JSON.stringify(req.permanentUser?._id)
    ) {
      await ComplaintModel.findByIdAndUpdate(complaintToBeClosed, {
        isComplete: true,
      });
      const response = new Custom_response(
        true,
        null,
        'closedComplaintSuccessfully',
        'success',
        200,
        null
      );
      res.status(response.statusCode).json(response);
      return;
    } else if (
      JSON.stringify(permanentUser!._id) ==
      JSON.stringify(yourComplaint.lodgedBy)
    ) {
      await ComplaintModel.findByIdAndUpdate(complaintToBeClosed, {
        isComplete: true,
      });
      const lodgedBy = await UserModel.findById(yourComplaint.lodgedBy);
      sendMailViaThread({
        text: `Your complaint with ID ${yourComplaint.complaintId} has been successfully closed`,
        subject: 'Construction Cell',
        from_info: `${process.env.EMAIL}`,
        html: `<h1>Your complaint with ID ${yourComplaint.complaintId} has been successfully closed`,
        toSendMail: lodgedBy!.email,
        cc: null,
        attachment: null,
      });
      const response = new Custom_response(
        true,
        null,
        'closedComplaintSuccessfully',
        'success',
        200,
        null
      );
      res.status(response.statusCode).json(response);
      return;
    } else
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
  }
);
export { closeComplaint };
