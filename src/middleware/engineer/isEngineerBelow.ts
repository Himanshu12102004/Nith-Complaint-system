import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithComplaintAndEngineer } from '../../types/types';
import { isBelowInHierarchy } from '../../utils/hierarchy/isBelowInHierarchy';

const isEngineerBelow: sync_middleware_type = async_error_handler(
  async (req: requestWithComplaintAndEngineer, res, next) => {
    if (
      !isBelowInHierarchy(
        req.permanentUser!.designation,
        req.engineer!.designation
      )
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorizedToPassComplaintAbove' }],
        statusCode: 403,
      });
    next();
  }
);
export { isEngineerBelow };
