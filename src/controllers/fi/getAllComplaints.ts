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
import { ComplaintModel } from '../../models/complaints/complaintModel';

const getAllComplaints: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUserAndParsedFilters, res, next) => {
    if (req.permanentUser?.designation != Designations.FI_CONSTRUCTION_CELL)
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });

    const complaints = await ComplaintModel.find(req.parsedFilters!)
      .populate(
        'lodgedBy',
        '-sessions -password -complaints -assignedComplaints'
      )
      .populate(
        'historyOfComplaint.assignedTo',
        '-sessions -password -complaints -assignedComplaints'
      )
      .populate(
        'currentlyAssignedTo',
        '-sessions -password -complaints -assignedComplaints'
      );
    const { pageNo, pageSize } = req.moreFilters.pages;
    const totalComplatints = complaints?.length;
    const totalPages = Math.ceil(totalComplatints! / pageSize);
    let complaintsToBeShown = complaints?.slice(
      (pageNo - 1) * pageSize,
      (pageNo - 1) * pageSize + pageSize
    );
    const response = new Custom_response(
      true,
      null,
      { complaints: complaintsToBeShown, totalPages, totalComplatints },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
    return;
  }
);

export { getAllComplaints };
