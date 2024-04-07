import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { ComplaintModel } from '../../models/complaintModel';
import { UserModel } from '../../models/userSchema';
import { encrypt } from '../../../security/secrets/encrypt';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';
import { io } from '../../socket';
const lodgeComplaint: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    console.log(req.permanentUser);
    if (
      req.permanentUser?.designation == Designations.ASSISTANT_ENGINEER ||
      req.permanentUser?.designation == Designations.JUNIOR_ENGINEER ||
      req.permanentUser?.designation == Designations.CHIEF_EXECUTIVE_ENGINEER
    )
      throw new Custom_error({
        errors: [{ message: 'notAllowedTolodgeComplaints' }],
        statusCode: 403,
      });
    const { location, natureOfComplaint, subNatureOfComplaint, description } =
      req.body;
    if (!location || !natureOfComplaint || !subNatureOfComplaint)
      throw new Custom_error({
        errors: [{ message: 'giveAllTheFields' }],
        statusCode: 403,
      });
    const chiefExecutiveEngineerID = (await UserModel.findOne({
      designation: encrypt(Designations.CHIEF_EXECUTIVE_ENGINEER),
    }))!._id;
    const complaint = ComplaintModel.build({
      lodgedBy: req.permanentUser?._id,
      location,
      natureOfComplaint,
      subNatureOfComplaint,
      description,
      currentlyAssignedTo: chiefExecutiveEngineerID,
      tentativeDateOfCompletion: new Date(0),
      historyOfComplaint: [
        {
          assignedTo: chiefExecutiveEngineerID,
          assignedOn: new Date(Date.now()),
        },
      ],
    });
    await UserModel.findByIdAndUpdate(chiefExecutiveEngineerID, {
      $push: { assignedComplaints: complaint._id },
    });
    await complaint.save();
    await UserModel.findByIdAndUpdate(req.permanentUser?._id, {
      $push: { complaints: complaint._id },
    });
    sendMailViaThread({
      text: `Your complaint with ID ${complaint.complaintId} has been successfully opened`,
      subject: 'Construction Cell',
      from_info: `${process.env.EMAIL}`,
      html: `<h1>Your complaint with ID ${complaint.complaintId} has been successfully opened`,
      toSendMail: req.permanentUser?.email!,
      cc: null,
      attachment: null,
    });
    if (
      global.connectedUsers.get(
        JSON.stringify(chiefExecutiveEngineerID).toString()
      ) != undefined
    ) {
      io.to(
        global.connectedUsers.get(chiefExecutiveEngineerID.toString())!
      ).emit('newComplaint', 'getAssignedComplaints');
    }
    const response = new Custom_response(
      true,
      null,
      'complaintLodgedSuccessfully',
      'success',
      201,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { lodgeComplaint };
