import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { UserModel } from '../../models/users/userSchema';
import { checkPasswords } from '../../../security/passwords/password';
import { createJwt } from '../../../security/jwt/createJwt';
import { SessionModel } from '../../models/users/sessionModel';
import { requestWithDeviceFingerprint } from '../../types/types';

const signIn: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
      throw new Custom_error({
        errors: [{ message: 'invalidEmailOrPassword' }],
        statusCode: 401,
      });
    const user = await UserModel.find_one({ email }, '+password');
    if (!user)
      throw new Custom_error({
        errors: [{ message: 'invalidEmailOrPassword' }],
        statusCode: 401,
      });
    console.log(password, user.password);
    if (!(await checkPasswords(password, user.password))) {
      throw new Custom_error({
        errors: [{ message: 'invalidEmailOrPassword' }],
        statusCode: 401,
      });
    }
    const accessToken = await createJwt(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: process.env.ACCESS_TOKEN_TIME }
    );
    const refreshToken = await createJwt(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: process.env.REFRESH_TOKEN_TIME }
    );
    const thisSession = SessionModel.build({
      refreshToken,
      deviceFingerprint: req.deviceFingerprint!,
      operatingSystem: req.operatingSystem!,
    });
    await thisSession.save();
    await UserModel.findByIdAndUpdate(user._id, {
      $push: { sessions: refreshToken },
    });
    const response = new Custom_response(
      true,
      null,
      { accessToken, refreshToken },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { signIn };
