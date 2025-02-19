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
import { UserModel } from '../../models/users/userSchema';
import { ComplaintModel } from '../../models/complaints/complaintModel';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';
import { io } from '../../socket';
const assignComplaints: sync_middleware_type = async_error_handler(
  async (req: requestWithComplaintAndEngineer, res, next) => {
    const { engineer, complaint } = req.body;
    if (req.complaint!.isComplete)
      throw new Custom_error({
        errors: [{ message: 'complaintAlreadyClosed' }],
        statusCode: 400,
      });

    if (
      req.permanentUser?.designation == Designations.JUNIOR_ENGINEER &&
      new Date(req.complaint!.tentativeDateOfCompletion).getFullYear() == 1970
    )
      throw new Custom_error({
        errors: [{ message: 'assignATentativeDateFirst' }],
        statusCode: 400,
      });
    await UserModel.findByIdAndUpdate(engineer, {
      $push: { assignedComplaints: complaint },
    });
    await ComplaintModel.findByIdAndUpdate(complaint, {
      $set: { currentlyAssignedTo: engineer },
      $push: {
        historyOfComplaint: {
          assignedTo: engineer,
          assignedOn: new Date(Date.now()),
        },
      },
    });
    sendMailViaThread({
      text: `Dear ${
        req.engineer!.name
      } you have been assigned with a new complaint with id ${
        req.complaint!.complaintId
      } by${engineer}`,
      subject: 'Construction Cell',
      from_info: `${process.env.EMAIL}`,
      html: `Dear ${
        req.engineer!.name
      } you have been assigned with a new complaint with id ${
        req.complaint!.complaintId
      }`,
      toSendMail: req.engineer!.email,
      cc: null,
      attachment: null,
    });
    if (global.connectedUsers.get(engineer) != undefined) {
      io.to(global.connectedUsers.get(engineer)!).emit(
        'newComplaint',
        'getAssignedComplaints'
      );
    }
    const response = new Custom_response(
      true,
      null,
      'complaintAssignedSuccessfully',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { assignComplaints };
