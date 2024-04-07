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
const setTentativeDateOfCompletion: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const permanentUser = req.permanentUser;
    if (permanentUser?.designation != Designations.JUNIOR_ENGINEER)
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    const { complaintId, tentativeDateOfCompletion } = req.body;
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
    if (
      JSON.stringify(complaint.currentlyAssignedTo) !=
      JSON.stringify(req.permanentUser?._id)
    ) {
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    }
    if (new Date(complaint.tentativeDateOfCompletion).getFullYear() != 1970)
      throw new Custom_error({
        errors: [{ message: 'cannotChangeTheTentativeDateAgain' }],
        statusCode: 400,
      });
    if (new Date(tentativeDateOfCompletion) < new Date(Date.now()))
      throw new Custom_error({
        errors: [{ message: 'invaliDDateOfTentaiveCompletion' }],
        statusCode: 400,
      });
    await ComplaintModel.findByIdAndUpdate(complaintId, {
      tentativeDateOfCompletion,
    });
    const lodgedBy = await UserModel.findById(complaint.lodgedBy);
    const newDate = new Date(tentativeDateOfCompletion);
    let formattedDate = newDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    sendMailViaThread({
      text: `Your complaint with ID ${complaint.complaintId} has been given a tentative date of completion of ${formattedDate}`,
      subject: 'Construction Cell',
      from_info: `${process.env.EMAIL}`,
      html: `<h1>Your complaint with ID ${complaint.complaintId} has been given a tentative date of completion of ${formattedDate}<h1>`,
      toSendMail: lodgedBy!.email,
      cc: null,
      attachment: null,
    });
    const response = new Custom_response(
      true,
      null,
      'successfullySetTentativeDateOfCompletion',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { setTentativeDateOfCompletion };
