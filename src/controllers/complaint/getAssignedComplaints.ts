import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  Designations,
  requestWithPermanentUserAndParsedFilters,
} from '../../types/types';
import { UserModel } from '../../models/userSchema';
const getAssignedComplaints: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUserAndParsedFilters, res, next) => {
    if (
      !(
        req.permanentUser!.designation == Designations.ASSISTANT_ENGINEER ||
        req.permanentUser!.designation ==
          Designations.CHIEF_EXECUTIVE_ENGINEER ||
        req.permanentUser!.designation == Designations.JUNIOR_ENGINEER
      )
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    console.log(req.parsedFilters);
    const userWithAssignedComplaints = await UserModel.findById(
      req.permanentUser!._id
    )
      .populate({
        path: 'assignedComplaints',
        match: req.parsedFilters,
        options: {
          sort: { lodgedOn: -1 },
        },
      })
      .exec();
    const complaints = userWithAssignedComplaints?.assignedComplaints;
    const complaintsPromiseArray = complaints?.map(async (elem: any) => {
      const lodgedBy = (
        await UserModel.findById(elem.lodgedBy, {
          complaints: false,
          sessions: false,
          assignedComplaints: false,
          password: false,
        })
      )?.toJSON();

      if (
        req.moreFilters &&
        req.moreFilters.hostel &&
        lodgedBy?.hostel !== req.moreFilters.hostel
      ) {
        return;
      }

      const currentlyAssignedTo = await UserModel.findById(
        elem.currentlyAssignedTo,
        {
          complaints: false,
          sessions: false,
          assignedComplaints: false,
          password: false,
        }
      );

      const historyOfComplaint = await Promise.all(
        elem.historyOfComplaint.map(async (historyItem: any) => {
          const assignedTo = await UserModel.findById(historyItem.assignedTo, {
            complaints: false,
            sessions: false,
            assignedComplaints: false,
            password: false,
          });
          return {
            assignedTo: assignedTo?.toJSON(),
            assignedOn: historyItem.assignedOn,
          };
        })
      );

      return {
        _id: elem._id,
        location: elem.location,
        natureOfComplaint: elem.natureOfComplaint,
        subNatureOfComplaint: elem.subNatureOfComplaint,
        description: elem.description,
        lodgedBy,
        currentlyAssignedTo: currentlyAssignedTo?.toJSON(),
        tentativeDateOfCompletion: elem.tentativeDateOfCompletion,
        lodgedOn: elem.lodgedOn,
        complaintId: elem.complaintId,
        isComplete: elem.isComplete,
        historyOfComplaint,
      };
    });

    let complaintsProcessed = await Promise.all(complaintsPromiseArray!);
    let finalComplaints = complaintsProcessed.filter((elem) => {
      if (elem) return true;
    });
    const { pageNo, pageSize } = req.moreFilters.pages;
    const totalComplatints = finalComplaints?.length;
    const totalPages = Math.ceil(totalComplatints! / pageSize);
    let complaintsToBeShown = complaintsProcessed?.slice(
      (pageNo - 1) * pageSize,
      (pageNo - 1) * pageSize + pageSize
    );
    const response = new Custom_response(
      true,
      null,
      { assignedComplaints: complaintsToBeShown, totalPages, totalComplatints },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
    return;
  }
);
export { getAssignedComplaints };
