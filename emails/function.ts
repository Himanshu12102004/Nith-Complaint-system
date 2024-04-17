import { modifyRequiredData } from './Acceptance-Rejection/acceptReject';
import { modifyOTP } from './OTP/otp';
import { handleAcceptance } from './ComplaintAssignment/function';
import { lostOTP } from './OTP-Lost/OTP-Lost';
import { SuccessfulPasswordReset } from './SuccessfulPasswordReset/SuccessfulPasswordReset';
import { tentativeDate } from './tentativeDate/tentativeDate';

type DataType = Record<string, any>;

type EmailType =
  | 'ACCEPT'
  | 'REJECT'
  | 'OTP'
  | 'COMPLAINT'
  | 'OTP_LOST'
  | 'PASSWORD_RESET'
  | 'TENTATIVE_DATE';

function getRequiredEmail(data: DataType = {}, type: EmailType): any {
  if (type === 'ACCEPT') {
    return modifyRequiredData(data, 'ACCEPT');
  } else if (type === 'REJECT') {
    return modifyRequiredData(data, 'REJECT');
  } else if (type === 'OTP') {
    return modifyOTP(data);
  } else if (type === 'COMPLAINT') {
    return handleAcceptance(data);
  } else if (type === 'OTP_LOST') {
    return lostOTP(data);
  } else if (type === 'PASSWORD_RESET') {
    return SuccessfulPasswordReset(data);
  } else if (type === 'TENTATIVE_DATE') {
    return tentativeDate(data);
  }
}

export { getRequiredEmail };
