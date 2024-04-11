import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  Designations,
  requestWithComplaintAndEngineer,
} from '../../types/types';
import { ComplaintModel } from '../../models/complaintModel';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';
import { UserModel } from '../../models/userSchema';
const closeComplaint: sync_middleware_type = async_error_handler(
  async (req: requestWithComplaintAndEngineer, res, next) => {
    const { complaint } = req.body;
    const permanentUser = req.permanentUser;
    if (req.complaint!.isComplete) {
      throw new Custom_error({
        errors: [{ message: 'complaintAlreadyCloses' }],
        statusCode: 400,
      });
    }
    if (
      permanentUser?.designation != Designations.JUNIOR_ENGINEER &&
      JSON.stringify(req.complaint?.lodgedBy) !=
        JSON.stringify(permanentUser!._id)
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    let lodgedBy = await UserModel.findById(req.complaint!.lodgedBy);
    lodgedBy = lodgedBy!.toJSON();
    if (
      JSON.stringify(req.complaint!.currentlyAssignedTo) ==
      JSON.stringify(req.permanentUser?._id)
    ) {
      await ComplaintModel.findByIdAndUpdate(complaint, {
        isComplete: true,
      });
      sendMailViaThread({
        text: `Your complaint with ID ${
          req.complaint!.complaintId
        } has been successfully closed`,
        subject: 'Construction Cell',
        from_info: `${process.env.EMAIL}`,
        html: `<h1>Your complaint with ID ${
          req.complaint!.complaintId
        } has been successfully closed`,
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
    } else if (
      JSON.stringify(permanentUser!._id) ==
      JSON.stringify(req.complaint!.lodgedBy)
    ) {
      await ComplaintModel.findByIdAndUpdate(complaint, {
        isComplete: true,
      });
      sendMailViaThread({
        text: `Your complaint with ID ${
          req.complaint!.complaintId
        } has been successfully closed`,
        subject: 'Construction Cell',
        from_info: `${process.env.EMAIL}`,
        html: `<h1>Your complaint with ID ${
          req.complaint!.complaintId
        } has been successfully closed`,
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
