import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { UserModel } from '../../../models/userSchema';
import { isEngineer } from '../../../utils/hierarchy/isEngineer';
import { requestWithComplaintAndEngineer } from '../../../types/types';

const doesEngineerExist: sync_middleware_type = async_error_handler(
  async (req: requestWithComplaintAndEngineer, res, next) => {
    const { engineer } = req.body;
    if (!engineer)
      throw new Custom_error({
        errors: [
          {
            message: 'pleaseGiveEngineerID',
          },
        ],
        statusCode: 400,
      });
    let engineerInDatabase = await UserModel.findById(engineer);
    if (!engineerInDatabase)
      throw new Custom_error({
        errors: [
          {
            message: 'noSuchEngineer',
          },
        ],
        statusCode: 400,
      });
    engineerInDatabase = engineerInDatabase?.toJSON();
    if (!isEngineer(engineerInDatabase.designation)) {
      throw new Custom_error({
        errors: [
          {
            message: 'thisIsNotAnEngineer',
          },
        ],
        statusCode: 400,
      });
    }
    req.engineer = engineerInDatabase;
    next();
  }
);
export { doesEngineerExist };
