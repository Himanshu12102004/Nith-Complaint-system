import fs from 'fs';
import path from 'path';

function readTextFiles(
  type: 'ACCEPT' | 'REJECT' = 'ACCEPT'
): string | undefined {
  let html: string | undefined;
  try {
    if (type === 'ACCEPT') {
      html = fs.readFileSync(path.resolve(__dirname, './accept.html'), 'utf8');
    } else if (type === 'REJECT') {
      html = fs.readFileSync(path.resolve(__dirname, './reject.html'), 'utf8');
    }
  } catch (err) {
    console.error(err);
  }
  return html;
}

interface Data {
  [key: string]: any;
}

function modifyRequiredData(
  data: Data,
  type: 'ACCEPT' | 'REJECT' = 'ACCEPT'
): string | undefined {
  let html = readTextFiles(type);
  if (!html) return undefined;

  Object.keys(data).forEach((key) => {
    html = html!.replaceAll(`**{{${key.toUpperCase()}}}**`, data[key]);
  });
  return html;
}

export { modifyRequiredData };
