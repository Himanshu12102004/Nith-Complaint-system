import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithEngineer } from '../../../types/types';

const isEngineerVerified: sync_middleware_type = async_error_handler(
  async (req: requestWithEngineer, res, next) => {
    const engineerInDatabase = req.engineer!;
    if (!engineerInDatabase.isVerifiedByCEE)
      throw new Custom_error({
        errors: [
          {
            message: 'engineerNotVerified',
          },
        ],
        statusCode: 400,
      });
    next();
  }
);
export { isEngineerVerified };
