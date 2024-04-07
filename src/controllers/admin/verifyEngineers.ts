import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { UserModel } from '../../models/userSchema';

const verifyEngineers: sync_middleware_type = async_error_handler(
  async (req: requestWithPermanentUser, res, next) => {
    const userToBeVerified = req.body.userToBeVerified;
    const verify = req.body.verify;
    if (
      req.permanentUser?.designation != Designations.CHIEF_EXECUTIVE_ENGINEER
    ) {
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    }
    if (!userToBeVerified)
      throw new Custom_error({
        errors: [{ message: 'noUserToBeVerified' }],
        statusCode: 400,
      });

    const user = (await UserModel.findById(userToBeVerified))?.toJSON();
    if (
      !(
        user?.designation == Designations.ASSISTANT_ENGINEER ||
        user?.designation == Designations.JUNIOR_ENGINEER
      )
    )
      throw new Custom_error({
        errors: [{ message: 'verificationNotRequired' }],
        statusCode: 400,
      });
    if (verify) {
      await UserModel.findByIdAndUpdate(userToBeVerified, {
        $set: {
          isVerifiedByCEE: true,
        },
      });
    } else {
      await UserModel.findByIdAndDelete(userToBeVerified);
    }
    const response = new Custom_response(
      true,
      null,
      'verifiedSuccessfully',
      'success',
      200,
      null
    );

    res.status(response.statusCode).json(response);
  }
);
export { verifyEngineers };
