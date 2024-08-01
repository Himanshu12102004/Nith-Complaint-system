import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';

const addMaterialList: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    if (
      req.permanentUser!.designation != Designations.CHIEF_EXECUTIVE_ENGINEER &&
      req.permanentUser!.designation != Designations.ASSISTANT_ENGINEER &&
      req.permanentUser!.designation != Designations.JUNIOR_ENGINEER
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 400,
      });
    const { typeOfMaterial, material } = req.body;
  }
);
