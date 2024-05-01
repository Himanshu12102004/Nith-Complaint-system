import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { NatureModel } from '../../models/natureOfComplaintModel';

const deleteNatureAndSubNatureOfComplaint: sync_middleware_type =
  async_error_handler(async (req: requestWithPermanentUser, res, next) => {
    if (
      req.permanentUser!.designation != Designations.CHIEF_EXECUTIVE_ENGINEER
    ) {
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    }
    if (!req.body.nature)
      throw new Custom_error({
        errors: [{ message: 'pleaseSendANatureOfComplaint' }],
        statusCode: 400,
      });
    const { nature, subNature } = req.body;

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
