import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { UserModel } from '../../models/userSchema';
import { ComplaintModel } from '../../models/complaintModel';
import mongoose from 'mongoose';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';
import { io } from '../../socket';
const assignComplaints: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const assignTo = req.body.assignTo;
    const complaintToBeAssigned = req.body.complaintToBeAssigned;
    const complaint = await ComplaintModel.findById(complaintToBeAssigned);
    if (!complaint)
      throw new Custom_error({
        errors: [{ message: 'noSuchComplaint' }],
        statusCode: 404,
      });
    const engineerToBeAssignedTo = (
      await UserModel.findById(assignTo)
    )?.toJSON();
    if (!engineerToBeAssignedTo)
      throw new Custom_error({
        errors: [{ message: 'noSuchEngineer' }],
        statusCode: 404,
      });
    if (!engineerToBeAssignedTo.isVerifiedByCEE)
      throw new Custom_error({
        errors: [{ message: 'engineerNotVerified' }],
        statusCode: 404,
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
    if (
      req.permanentUser?.designation == Designations.CHIEF_EXECUTIVE_ENGINEER &&
      engineerToBeAssignedTo?.designation != Designations.ASSISTANT_ENGINEER
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    if (
      req.permanentUser?.designation == Designations.ASSISTANT_ENGINEER &&
      engineerToBeAssignedTo?.designation != Designations.JUNIOR_ENGINEER
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    await UserModel.findByIdAndUpdate(assignTo, {
      $push: { assignedComplaints: complaintToBeAssigned },
    });
    await ComplaintModel.findByIdAndUpdate(complaintToBeAssigned, {
      $set: { currentlyAssignedTo: assignTo },
      $push: {
        historyOfComplaint: {
          assignedTo: assignTo,
          assignedOn: new Date(Date.now()),
        },
      },
    });
    sendMailViaThread({
      text: `Dear ${engineerToBeAssignedTo.name} you have been assigned with a new complaint with id ${complaint.complaintId}`,
      subject: 'Construction Cell',
      from_info: `${process.env.EMAIL}`,
      html: `Dear ${engineerToBeAssignedTo.name} you have been assigned with a new complaint with id ${complaint.complaintId}`,
      toSendMail: engineerToBeAssignedTo.email,
      cc: null,
      attachment: null,
    });
    if (global.connectedUsers.get(assignTo) != undefined) {
      io.to(global.connectedUsers.get(assignTo)!).emit(
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
