import express from 'express';
import { signUp } from '../controllers/sign/signUp';
import { signIn } from '../controllers/sign/signIn';
import { getDeviceInfo } from '../middleware/device/deviceInfo';
import { signUpValidation } from '../middleware/inputValidation/sign/signUpValidation';
import { verifyOtp } from '../controllers/sign/verifyOtp';
import { getUserFromTemp } from '../middleware/user/getUserFromTemp';
import { resendOtp } from '../controllers/sign/resendOtp';
import { changePassword } from '../controllers/sign/changePassword';
import { getUserFromPermanent } from '../middleware/user/getUserFromPermanent';
import { getNewAccessToken } from '../controllers/sign/getNewAccessToken';
import { getCurrentUser } from '../controllers/sign/getCurrentUser';
import { forgotPassword } from '../controllers/sign/forgotPassword';
import { verifyOtpForgotPassword } from '../controllers/sign/verifyOtpForgotPassword';
import { forgotPasswordReset } from '../controllers/sign/forgotPasswordReset';
import { logout } from '../controllers/sign/logout';
import { logOutFromAllDevices } from '../controllers/sign/logOutFromAllDevices';
export const signUpInRouter = express.Router();
signUpInRouter.post('/signup', getDeviceInfo, signUpValidation, signUp);
signUpInRouter.post('/signin', getDeviceInfo, signIn);
signUpInRouter.post('/verifyOtp', getDeviceInfo, getUserFromTemp, verifyOtp);
signUpInRouter.get('/resendOtp', getDeviceInfo, getUserFromTemp, resendOtp);
signUpInRouter.patch('/changePassword', getUserFromPermanent, changePassword);
signUpInRouter.get('/getNewAccessToken', getDeviceInfo, getNewAccessToken);
signUpInRouter.get('/getUser', getUserFromPermanent, getCurrentUser);
signUpInRouter.post('/forgotPassword', getDeviceInfo, forgotPassword);
signUpInRouter.post(
  '/verifyForgotPasswordOtp',
  getDeviceInfo,
  getUserFromTemp,
  verifyOtpForgotPassword
);
signUpInRouter.post('/forgotPasswordReset', getDeviceInfo, forgotPasswordReset);
signUpInRouter.get('/logout', logout);
signUpInRouter.get('/logOutFromAllDevices', logOutFromAllDevices);
