import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  Designations,
  requestWithQueryAndPermanentUser,
} from '../../../types/types';
import { encrypt } from '../../../../security/secrets/encrypt';

const attachQueryOfEnggUnderYou: sync_middleware_type = async_error_handler(
  async (req: requestWithQueryAndPermanentUser, res, next) => {
    const designation = req.permanentUser?.designation;
    let dbQuery;
    if (
      designation == Designations.EXECUTIVE_ENGINEER_CIVIL ||
      designation == Designations.EXECUTIVE_ENGINEER_ELECTRICAL
    ) {
      dbQuery = {
        $or: [
          { designation: encrypt(Designations.ASSISTANT_ENGINEER) },
          { designation: encrypt(Designations.JUNIOR_ENGINEER) },
          { designation: encrypt(Designations.SUPERVISOR) },
        ],
        isVerifiedByCEE: true,
        isDeleted: false,
      };
    } else if (designation == Designations.ASSISTANT_ENGINEER) {
      dbQuery = {
        $or: [
          { designation: encrypt(Designations.JUNIOR_ENGINEER) },
          { designation: encrypt(Designations.SUPERVISOR) },
        ],
        isVerifiedByCEE: true,
        isDeleted: false,
      };
    } else if (designation == Designations.JUNIOR_ENGINEER) {
      dbQuery = {
        isVerifiedByCEE: true,
        designation: encrypt(Designations.SUPERVISOR),
        isDeleted: false,
      };
    } else {
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    }
    req.dbQuery = dbQuery;
    next();
  }
);
export { attachQueryOfEnggUnderYou };
