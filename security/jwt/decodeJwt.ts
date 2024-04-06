import jwt from 'jsonwebtoken';

const jwtVerification = (token: string, secretKey: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err: any, decodedToken: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    });
  });
};

export { jwtVerification };
