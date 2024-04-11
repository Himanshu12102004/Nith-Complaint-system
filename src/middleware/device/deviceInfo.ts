import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import useragent from 'express-useragent';
import { requestWithDeviceFingerprint } from '../../types/types';
const getDeviceInfo: sync_middleware_type = async_error_handler(
  async (req: requestWithDeviceFingerprint, res, next) => {
    try {
      const userAgentFromRequest = req.headers['user-agent'];
      if (!userAgentFromRequest) {
        throw new Custom_error({
          errors: [{ message: 'noUser-agentFound' }],
          statusCode: 400,
        });
      }
      const agent = useragent.parse(userAgentFromRequest);
      const deviceInfo = `Browser: ${agent.browser}Operating System: ${agent.os}Version: ${agent.version}Is Mobile: ${agent.isMobile}Is Desktop: ${agent.isDesktop}Platform: ${agent.platform}Source: ${userAgentFromRequest}`;
      req.deviceFingerprint = deviceInfo;

      next();
    } catch (err) {
      next(err);
    }
  }
);
export { getDeviceInfo };
