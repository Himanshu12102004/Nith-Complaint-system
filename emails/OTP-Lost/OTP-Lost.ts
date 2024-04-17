import fs from 'fs';
import path from 'path';

function readTextFiles(): string | undefined {
  let html: string | undefined;
  try {
    html = fs.readFileSync(path.resolve(__dirname, './OTP-Lost.html'), 'utf8');
  } catch (err) {
    console.error(err);
  }
  return html;
}

interface Data {
  [key: string]: any;
}

function lostOTP(data: Data): string | undefined {
  let otp = data?.OTP + '';
  let html = readTextFiles();
  if (!html) return undefined;

  Object.keys(data).forEach((key) => {
    html = html!.replace(new RegExp(`\\*\\*{{${key.toUpperCase()}}}\\*\\*`, 'g'), data[key]);
  });
  otp.split('').forEach((num, index) => {
    html = html!.replace(new RegExp(`\\*\\*{{DIGIT${index + 1}}}\\*\\*`, 'g'), num);
  });
  return html;
}

export { lostOTP };
