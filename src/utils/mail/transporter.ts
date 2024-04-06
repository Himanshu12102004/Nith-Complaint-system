import nodemailer from 'nodemailer';

const createTransporter = (): nodemailer.Transporter => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });
    return transporter;
  } catch (err) {
    throw err;
  }
};

export { createTransporter };
