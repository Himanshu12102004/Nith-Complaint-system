import { createTransporter as transporter } from './transporter';
import { SentMessageInfo, SendMailOptions } from 'nodemailer';
import { Worker, parentPort } from 'worker_threads';
parentPort?.on(
  'message',
  async (data: {
    text: string;
    subject: string;
    from_info: string;
    toSendMail: string;
    cc: string;
    html: string;
    attachment: any;
  }) => {
    const mail = await sendMail(
      data.text,
      data.subject,
      data.from_info,
      data.toSendMail,
      data.cc,
      data.html,
      data.attachment
    );
  }
);
export const sendMail = (
  text: string,
  subject: string,
  from_info: string,
  toSendMail: string,
  cc: string | undefined,
  html: string | null,
  attachment: any | null = null
): Promise<SentMessageInfo> => {
  return new Promise((resolve, reject) => {
    let mailOptions: SendMailOptions = {
      from: `${from_info} <${process.env.EMAIL}>`,
      to: toSendMail,
      subject: `${subject}`,
      text: `${text}`,
      cc: cc,
      html: html ? html : text,
      attachments: attachment,
    };
    transporter().sendMail(
      mailOptions,
      (err: Error | null, info: SentMessageInfo) => {
        if (err) {
          reject(err);
          parentPort?.postMessage(err);
        } else {
          resolve(info);
          parentPort?.postMessage('emailSent');
        }
      }
    );
  });
};
parentPort?.postMessage('hello');
