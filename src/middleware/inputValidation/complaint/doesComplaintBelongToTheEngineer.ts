import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithComplaintAndEngineer } from '../../../types/types';

const doesComplaintBelongToTheEngineer: sync_middleware_type =
  async_error_handler(
    async (req: requestWithComplaintAndEngineer, res, next) => {
      console.log(req.engineer);
      if (
        JSON.stringify(req.permanentUser?._id) !=
        JSON.stringify(req.complaint!.currentlyAssignedTo)
      )
        throw new Custom_error({
          errors: [{ message: 'thisIsNotYourComplaint' }],
          statusCode: 401,
        });
      next();
    }
  );
export { doesComplaintBelongToTheEngineer };
