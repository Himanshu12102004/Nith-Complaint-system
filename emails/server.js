const express = require('express');
const { getRequiredEmail } = require('./function.js');

const app = express();
app.use(express.json());

const data = {
  ENGINEER_NAME: 'Himanshu Gupta', // Name of the Engineer - Used in accept, reject emails, complaint assignemnt
  ASSIGNED_BY: 'Rahul Kumar',
  ASSIGNED_TO: 'Himanshu Gupta',
  CUSTOMERNAME: 'Rahul Kumar',

  OTP: 123456,

  POST: 'Software Developer',
  TEAM: 'Construction Cell',
  PERSONPOST: 'Junior Engineer',
  COMPLAINT_ID: 'aks897asd23hajsdf78',
  COMPLAINT_TYPE: 'Electrical',
  WEBSITE_LINK: 'https://www.github.com/AdoredAgenda',
  MADE_BY: 'Made by Arnav Chhabra, Himanshu Gupta, and Parth Saini',
  TENTATIVE_COMPLETION: '12th August 2021',
};

// const dataSeparated = {
//   tentativedate: {
//     TEAM: 'Construction Cell',
//     CUSTOMERNAME: 'Rahul Kumar',
//     COMPLAINT_TYPE: 'Electrical',
//     COMPLAINT_ID: 'aks897asd23hajsdf78',
//     TENTATIVE_COMPLETION: '12th August 2021',
//     ASSIGNED_TO: 'Rahul Kumar',
//     MADE_BY: 'Made by Arnav Chhabra, Himanshu Gupta, and Parth Saini',
//   },
//   successPasswordReset: {
//     TEAM: 'Construction Cell',
//     WEBSITE_LINK: 'https://www.github.com/AdoredAgenda',
//     MADE_BY: 'Made by Arnav Chhabra, Himanshu Gupta, and Parth Saini',
//   },
//   lostOTP: {
//     TEAM: 'Construction Cell',
//     OTP: 123456,
//     MADE_BY: 'Made by Arnav Chhabra, Himanshu Gupta, and Parth Saini',
//   },
// };

app.get('/accept-email', (req, res) => {
  const html = getRequiredEmail(data, 'ACCEPT');
  res.send(html);
});
app.get('/reject-email', (req, res) => {
  const html = getRequiredEmail(data, 'REJECT');
  res.send(html);
});
app.get('/otp', (req, res) => {
  const html = getRequiredEmail(data, 'OTP');
  res.send(html);
});
app.get('/complaint-assignemnt', (req, res) => {
  const html = getRequiredEmail(data, 'COMPLAINT');
  res.send(html);
});
app.get('/lost-otp', (req, res) => {
  const html = getRequiredEmail(data, 'OTP_LOST');
  res.send(html);
});
app.get('/password-reset', (req, res) => {
  const html = getRequiredEmail(data, 'PASSWORD_RESET');
  res.send(html);
});
app.get('/tentative-date', (req, res) => {
  const html = getRequiredEmail(data, 'TENTATIVE_DATE');
  res.send(html);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
