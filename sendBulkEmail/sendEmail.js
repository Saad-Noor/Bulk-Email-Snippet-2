require('dotenv').config();
const mailgun = require('mailgun-js')({
  apiKey: process.env.APIKEY,
  domain: process.env.DOMAIN_NAME,
});

const _ = require('lodash');
const moment = require('moment');
const csv = require('csvtojson');

const params = process.argv;
const fromEmail = params[2];
const csvFile = params[3];

const currentPath = process.cwd();

console.log('fromEmail', fromEmail);
console.log('csvFile', csvFile);
console.log('Current path ',currentPath )


sendEmailMailgun = (fromEmail, emailId, emailBody, subject) => new Promise((resolve, reject) => {
  const data = {
    from: process.env.FROM_EMAIL_ID,
    to: emailId,
    subject,
    html: emailBody
  };
  mailgun.messages().send(data, (err, body) => {
    if(err) {
      console.error('[mailGun][sendMail]: error while triggering email', err);
      return reject(err);
    }
    return resolve(body);
  });
});

const csvFilePath = currentPath + '/' + csvFile;
console.log('File path ', csvFilePath)

csv()
.fromFile(csvFilePath)
  .then((jsonObj)=>{
    console.log('Json object...', jsonObj);
    jsonObj.map((i) => {
      const SUBJECT = `Hi ${i.name} - Wish you Happy Eid`;
      const emailId = i.email;
      console.log('emailId', emailId, 'subject', SUBJECT);
      const HTML_BODY = `
        Hi ${i.name},<br/><br/>
        Wishing you a happy day<br/>

      `;
      sendEmailMailgun(fromEmail, emailId, HTML_BODY, SUBJECT).then(() => {
        console.log('success:sent:::==', i.name);
      })
        .catch((e) => {
          console.log('error', e);
        });
    });
});