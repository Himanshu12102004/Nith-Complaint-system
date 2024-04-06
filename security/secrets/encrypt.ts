import fs from 'fs';
import path from 'path';
import { Custom_error } from '@himanshu_guptaorg/utils';

let parsedEncrypt: Record<
  number,
  Record<number, Record<number, string>>
> | null = null;

const lazyLoadEncryptFile = () => {
  if (!parsedEncrypt) {
    console.log('fileBeingRead');
    const forEncryptionFile = fs.readFileSync(
      path.resolve(__dirname, './forEncryption.json'),
      'utf-8'
    );
    parsedEncrypt = JSON.parse(forEncryptionFile);
  }
};

lazyLoadEncryptFile();
const encrypt = (stringToBeEncrypted: string): string => {
  try {
    if (!parsedEncrypt)
      throw new Custom_error({
        errors: [{ message: 'noEncryptionString' }],
        statusCode: 500,
      });
    const length = stringToBeEncrypted.length;
    const encryptedChars: string[] = [];

    for (let i = 0; i < length; i += 3) {
      let substring = stringToBeEncrypted.substring(i, i + 3);
      if (substring.length < 3) {
        substring += ' '.repeat(3 - substring.length);
      }
      const code1 = substring.charCodeAt(0) - 32;
      const code2 = substring.charCodeAt(1) - 32;
      const code3 = substring.charCodeAt(2) - 32;
      encryptedChars.push(parsedEncrypt[code1][code2][code3]);
    }
    return encryptedChars.join(' ');
  } catch (err) {
    console.log(err);
    return '';
  }
};

export { encrypt };
