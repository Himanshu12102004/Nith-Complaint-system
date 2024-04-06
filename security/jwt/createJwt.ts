import jwt from 'jsonwebtoken';

const createJwt = (
  payload: any,
  secret: string,
  options?: jwt.SignOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const token: string = jwt.sign(payload, secret, options);
      resolve(token);
    } catch (err) {
      reject(err);
    }
  });
};

export { createJwt };
