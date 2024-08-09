import {
  Custom_error,
  Custom_response,
  async_error_handler,
} from '@himanshu_guptaorg/utils';
import {
  BelongsTo,
  Designations,
  requestWithPermanentUser,
} from '../../types/types';
import { isThrowStatement } from 'typescript';
import { NatureModel } from '../../models/complaints/natureOfComplaintModel';

const getFullNatureDetails = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    let belongsTo: string;
    if (req.permanentUser?.designation == Designations.EXECUTIVE_ENGINEER_CIVIL)
      belongsTo = BelongsTo.CIVIL;
    else if (
      req.permanentUser?.designation ==
      Designations.EXECUTIVE_ENGINEER_ELECTRICAL
    )
      belongsTo = BelongsTo.ELECTRICAL;
    else
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    const natures = await NatureModel.find({ belongsTo: belongsTo });
    const formattedNatures = natures.map((elem) => {
      return {
        name: elem.nature.name,
        active: elem.nature.isActive,
        subNatures: elem.subNature.map((elem) => {
          return { name: elem.name, active: elem.isActive };
        }),
      };
    });
    const response = new Custom_response(
      true,
      null,
      { natureList: formattedNatures },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getFullNatureDetails };
