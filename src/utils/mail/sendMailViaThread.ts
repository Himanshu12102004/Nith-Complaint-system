import path from 'path';
import { Worker } from 'worker_threads';
interface SendMailOptions {
  text: string;
  subject: string;
  from_info: string;
  toSendMail: string;
  html: string;
  cc: string | null;
  attachment: any;
}
const sendMailViaThread = (options: SendMailOptions) => {
  let worker = new Worker(path.resolve(__dirname, './sendMail.ts'));
  const { text, subject, from_info, toSendMail, html, cc, attachment } =
    options;
  worker.postMessage({
    text,
    subject,
    from_info,
    toSendMail,
    html,
    cc,
    attachment,
  });
  worker.on('message', (message) => {
    console.log(message);
  });
};
export { sendMailViaThread };
