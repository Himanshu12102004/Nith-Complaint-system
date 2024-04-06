import { checkPasswords, hashPassword } from '../passwords/password';
const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};
const getOtp = async (): Promise<{
  hashedOtp: string;
  generatedOtp: string;
}> => {
  const otp = generateOTP();
  return { hashedOtp: await hashPassword(otp), generatedOtp: otp };
};
const checkOtp = async (
  enteredOtp: string,
  dataBaseOtp: string
): Promise<boolean> => {
  return await checkPasswords(enteredOtp, dataBaseOtp);
};
export { getOtp, checkOtp };
