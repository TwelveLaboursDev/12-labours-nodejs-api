
require('dotenv').config();

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

class SmtpSender {
  constructor(mailTo,subject,bodyText,bodyHtml) {
    this.mailTo =mailTo, 
    this.subject= subject,
    this.bodyText = bodyText,
    this.bodyHtml = bodyHtml
  }

  async sendEmail(){
    let sendResult=false;
    const msg = {
      to: this.mailTo,
      from: process.env.SENDGRID_VERIFIED_SENDER, 
      subject: this.subject,
      text: this.bodyText,
      html: this.bodyHtml,
    }
    if(!msg.to || !msg.from || !msg.subject || !msg.text || !msg.html)
      return false;

    await sgMail.send(msg)
    .then((response) => {
      sendResult=response[0].statusCode===202 ? true : false;
      console.log('SendGrid response: ' + response[0].statusCode);
    })
    .catch((error) => {
      console.error('SendGrid error: ' + error);
    })
    return sendResult;
  }
}


module.exports=SmtpSender;