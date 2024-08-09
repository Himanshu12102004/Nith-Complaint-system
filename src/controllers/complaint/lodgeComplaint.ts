import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  BelongsTo,
  Designations,
  requestWithPermanentUser,
} from '../../types/types';
import { ComplaintModel } from '../../models/complaints/complaintModel';
import { UserModel } from '../../models/users/userSchema';
import { encrypt } from '../../../security/secrets/encrypt';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';
import { io } from '../../socket';
import { isEngineer } from '../../utils/hierarchy/isEngineer';
import mongoose from 'mongoose';
import { NatureModel } from '../../models/complaints/natureOfComplaintModel';
const lodgeComplaint: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    if (isEngineer(req.permanentUser!.designation))
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
    const complaintRegarding = await NatureModel.findOne({
      'nature.name': natureOfComplaint,
    });
    if (!complaintRegarding)
      throw new Custom_error({
        errors: [{ message: 'noSuchComplaintNature' }],
        statusCode: 400,
      });
    const belongsTo = complaintRegarding!.belongsTo;
    let executiveEngineerID: any;
    if (belongsTo == BelongsTo.CIVIL) {
      executiveEngineerID = (await UserModel.findOne({
        designation: encrypt(Designations.EXECUTIVE_ENGINEER_CIVIL),
      }))!._id;
    } else if (belongsTo == BelongsTo.ELECTRICAL) {
      executiveEngineerID = (await UserModel.findOne({
        designation: encrypt(Designations.EXECUTIVE_ENGINEER_ELECTRICAL),
      }))!._id;
    }
    const docsCount = await ComplaintModel.countDocuments();
    const complaint = ComplaintModel.build({
      lodgedBy: req.permanentUser?._id as mongoose.Types.ObjectId,
      location,
      natureOfComplaint,
      subNatureOfComplaint,
      description,
      currentlyAssignedTo: executiveEngineerID,
      tentativeDateOfCompletion: new Date(0),
      complaintId: `${docsCount + 1}`,
      historyOfComplaint: [
        {
          assignedTo: executiveEngineerID,
          assignedOn: new Date(Date.now()),
        },
      ],
    });
    await UserModel.findByIdAndUpdate(executiveEngineerID, {
      $push: { assignedComplaints: complaint._id },
    });
    await complaint.save();
    await UserModel.findByIdAndUpdate(req.permanentUser?._id, {
      $push: { complaints: complaint._id },
    });
    sendMailViaThread({
      text: `${req.permanentUser?.name},Your complaint with ID ${complaint.complaintId} has been successfully opened`,
      subject: 'Construction Cell',
      from_info: `${process.env.EMAIL}`,
      html: `<h1>${req.permanentUser?.name},\n Your complaint regarding ${complaint.natureOfComplaint} with ID: ${complaint.complaintId} has been successfully opened`,
      toSendMail: req.permanentUser?.email!,
      cc: null,
      attachment: null,
    });
    console.log(global.connectedUsers);
    console.log(
      '------------------------------------kjfkdjfkdfjkjkjj----------------------------------------'
    );
    console.log(executiveEngineerID.toString());
    if (
      global.connectedUsers.get(executiveEngineerID.toString()) != undefined
    ) {
      io.to(global.connectedUsers.get(executiveEngineerID.toString())!).emit(
        'newComplaint',
        'getAssignedComplaints'
      );
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
