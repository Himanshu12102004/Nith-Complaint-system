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
import { UserModel } from '../../models/userSchema';
import { sendMailViaThread } from '../../utils/mail/sendMailViaThread';

const verifyEngineers: sync_middleware_type = async_error_handler(
  async (req: requestWithEngineer, res, next) => {
    const engineerToBeVerified = req.body.engineer;
    const verify = req.body.verify;
    if (
      req.permanentUser?.designation != Designations.CHIEF_EXECUTIVE_ENGINEER
    ) {
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    }

    if (verify == true) {
      await UserModel.findByIdAndUpdate(engineerToBeVerified, {
        $set: {
          isVerifiedByCEE: true,
        },
      });
      sendMailViaThread({
        text: `Dear ${
          req.engineer!.name
        } you have been successfully verified as a ${
          req.engineer!.designation
        }`,
        subject: 'Construction Cell',
        from_info: `${process.env.EMAIL}`,
        html: `Dear ${
          req.engineer!.name
        } you have been successfully verified as a ${
          req.engineer!.designation
        }`,
        toSendMail: req.engineer!.email,
        cc: null,
        attachment: null,
      });
    } else if (verify == false) {
      await UserModel.findByIdAndDelete(engineerToBeVerified);
      sendMailViaThread({
        text: `Dear ${req.engineer!.name} you have been rejected as a ${
          req.engineer!.designation
        }`,
        subject: 'Construction Cell',
        from_info: `${process.env.EMAIL}`,
        html: `Dear ${req.engineer!.name} you have been rejected as a ${
          req.engineer!.designation
        }`,
        toSendMail: req.engineer!!.email,
        cc: null,
        attachment: null,
      });
    } else
      throw new Custom_error({
        errors: [{ message: 'invalidOptionForVarify' }],
        statusCode: 400,
      });
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
