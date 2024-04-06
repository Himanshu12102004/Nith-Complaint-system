import crypto from 'crypto';

const createSecrets = (): void => {
  const secret: string = crypto.randomBytes(32).toString('hex');
  console.log(secret);
};

createSecrets();
