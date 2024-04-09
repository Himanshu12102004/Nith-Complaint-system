import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { UserModel } from '../../models/userSchema';

const getEngineerDetails: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const { engineerToGet } = req.body;
    if (
      req.permanentUser?.designation == Designations.FACULTY ||
      req.permanentUser?.designation == Designations.WARDEN
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    if (!engineerToGet)
      throw new Custom_error({
        errors: [{ message: 'noEngineerToGet' }],
        statusCode: 400,
      });
    const engineer = await UserModel.findById(engineerToGet, {
      sessions: false,
      password: false,
    })
      .populate({
        path: 'assignedComplaints',
        options: {
          sort: { lodgedOn: -1 },
        },
      })
      .exec();
    if (!engineer)
      throw new Custom_error({
        errors: [{ message: 'noSuchEngineer' }],
        statusCode: 404,
      });
    engineer?.toJSON();
    if (
      engineer.designation == Designations.WARDEN ||
      engineer.designation == Designations.FACULTY
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    if (
      req.permanentUser?.designation == Designations.ASSISTANT_ENGINEER &&
      (engineer?.designation == Designations.CHIEF_EXECUTIVE_ENGINEER ||
        engineer.designation == Designations.ASSISTANT_ENGINEER)
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    if (
      req.permanentUser?.designation == Designations.JUNIOR_ENGINEER &&
      (engineer?.designation == Designations.CHIEF_EXECUTIVE_ENGINEER ||
        engineer?.designation == Designations.ASSISTANT_ENGINEER ||
        engineer?.designation == Designations.JUNIOR_ENGINEER)
    )
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    if (req.permanentUser?.designation == Designations.SUPERVISOR)
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    const response = new Custom_response(
      true,
      null,
      { engineer },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getEngineerDetails };
