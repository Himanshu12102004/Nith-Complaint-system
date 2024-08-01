import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  Designations,
  requestWithEngineer,
  requestWithPermanentUser,
} from '../../types/types';
import { UserModel } from '../../models/users/userSchema';

const deleteEngineer: sync_middleware_type = async_error_handler(
  async (req: requestWithEngineer, res, next) => {
    const { engineer } = req.body;
    if (req.permanentUser?.designation != Designations.CHIEF_EXECUTIVE_ENGINEER)
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    if (
      req.engineer!.designation != Designations.JUNIOR_ENGINEER &&
      req.engineer!.designation != Designations.ASSISTANT_ENGINEER &&
      req.engineer!.designation != Designations.SUPERVISOR
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    await UserModel.findByIdAndDelete(engineer);
    const response = new Custom_response(
      true,
      null,
      'deletedSuccessfully',
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { deleteEngineer };
