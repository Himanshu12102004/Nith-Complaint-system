import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermanentUser } from '../../types/types';
import { isEngineer } from '../../utils/hierarchy/isEngineer';
const isEngineerMiddleware: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    if (!isEngineer(req.permanentUser!.designation))
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    next();
  }
);
export { isEngineerMiddleware };
