import fs from 'fs';
import path from 'path';

function readTextFiles(): string | undefined {
  let html: string | undefined;
  try {
    html = fs.readFileSync(
      path.resolve(__dirname, './tentativeDate.html'),
      'utf8'
    );
  } catch (err) {
    console.error(err);
  }
  return html;
}

interface Data {
  [key: string]: any;
}

function tentativeDate(data: Data): string | undefined {
  let html = readTextFiles();
  if (!html) return undefined;

  Object.keys(data).forEach((key) => {
    html = html!.replace(new RegExp(`\\*\\*{{${key.toUpperCase()}}}\\*\\*`, 'g'), data[key]);
  });
  return html;
}

export { tentativeDate };
