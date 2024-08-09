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
import { NatureModel } from '../../models/complaints/natureOfComplaintModel';

const deleteNatureAndSubNatureOfComplaint: sync_middleware_type =
  async_error_handler(async (req: requestWithPermanentUser, res, next) => {
    let belongsTo: string;
    if (
      req.permanentUser!.designation ==
      Designations.EXECUTIVE_ENGINEER_ELECTRICAL
    )
      belongsTo = BelongsTo.ELECTRICAL;
    else if (
      req.permanentUser!.designation == Designations.EXECUTIVE_ENGINEER_CIVIL
    )
      belongsTo = BelongsTo.CIVIL;
    else
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    if (!req.body.nature)
      throw new Custom_error({
        errors: [{ message: 'pleaseSendANatureOfComplaint' }],
        statusCode: 400,
      });
    const { nature, subNature } = req.body;
    const complaintNature = await NatureModel.findOne({
      'nature.name': nature,
    });
    console.log(complaintNature, belongsTo);
    if (complaintNature?.belongsTo != belongsTo)
      throw new Custom_error({
        errors: [{ message: 'doesNotBelongToYou' }],
        statusCode: 401,
      });
    if (subNature) {
      await NatureModel.updateOne(
        {
          'nature.name': nature,
          subNature: { $elemMatch: { name: subNature, isActive: true } },
        },
        { $set: { 'subNature.$.isActive': false } }
      );
    } else {
      await NatureModel.updateOne(
        { 'nature.name': nature, 'nature.isActive': true },
        { $set: { 'nature.isActive': false } }
      );
    }
    const response = new Custom_response(
      true,
      null,
      'deletedTheNature',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  });

export { deleteNatureAndSubNatureOfComplaint };
