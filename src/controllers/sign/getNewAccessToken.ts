import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { SessionModel } from '../../models/sessionModel';
import { checkPasswords } from '../../../security/passwords/password';
import { requestWithDeviceFingerprint } from '../../types/types';
import { UserModel } from '../../models/userSchema';
import { createJwt } from '../../../security/jwt/createJwt';
import { jwtVerification } from '../../../security/jwt/decodeJwt';
const getNewAccessToken: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    const jwt: string = req.headers.authentication as string;
    if (!jwt)
      throw new Custom_error({
        errors: [{ message: 'noJWTFound' }],
        statusCode: 401,
      });
    if (!jwt.startsWith('Bearer'))
      throw new Custom_error({
        errors: [{ message: 'invalidJwt' }],
        statusCode: 400,
      });
    const oldRefreshToken = jwt.split(' ')[1];
    const session = await SessionModel.findOne({
      refreshToken: oldRefreshToken,
    });
    if (!session)
      throw new Custom_error({
        errors: [{ message: 'youHaveBeenLoggedOut' }],
        statusCode: 401,
      });
    if (
      !(await checkPasswords(req.deviceFingerprint!, session.deviceFingerprint))
    )
      throw new Custom_error({
        errors: [{ message: 'youHaveBeenLoggedOut' }],
        statusCode: 401,
      });
    const decodedJWT = (await jwtVerification(
      jwt.split(' ')[1],
      process.env.REFRESH_TOKEN_SECRET!
    )) as { _id: string };
    const user = await UserModel.findById(decodedJWT._id);
    if (!user)
      throw new Custom_error({
        errors: [{ message: 'youHaveBeenLoggedOut' }],
        statusCode: 401,
      });
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
    await SessionModel.findOneAndDelete({ refreshToken: oldRefreshToken });
    const thisSession = SessionModel.build({
      refreshToken: refreshToken,
      deviceFingerprint: req.deviceFingerprint!,
      operatingSystem: req.operatingSystem!,
    });
    await thisSession.save();
    await UserModel.findOneAndUpdate(
      { _id: decodedJWT._id },
      { $set: { 'sessions.$[elem]': refreshToken } },
      { arrayFilters: [{ elem: jwt.split(' ')[1] }], new: true }
    );

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
export { getNewAccessToken };
