import { Custom_error } from '@himanshu_guptaorg/utils';
import fs from 'fs';
import path from 'path';

let parsedDecrypt: Record<string, string> | null = null;
const lazyLoadDecryptFile = () => {
  if (!parsedDecrypt) {
    console.log('fileBeingRead');
    const forDecryptionFile = fs.readFileSync(
      path.resolve(__dirname, './forDecryption.json'),
      'utf-8'
    );
    parsedDecrypt = JSON.parse(forDecryptionFile);
  }
};

lazyLoadDecryptFile();
const decrypt = (encryptedString: string): string => {
  try {
    if (!parsedDecrypt)
      throw new Custom_error({
        errors: [{ message: 'noDecryptionString' }],
        statusCode: 500,
      });
    const arrayEncrypted = encryptedString.trim().split(' ');
    let decrypted = '';

    for (const element of arrayEncrypted) {
      const decryptedChar = parsedDecrypt[element];
      decrypted += decryptedChar !== undefined ? decryptedChar : '';
    }
    return decrypted;
  } catch (err) {
    console.log(err);
  }
  return 'undefined';
};

export { decrypt };
