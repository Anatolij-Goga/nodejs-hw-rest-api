const nodemailer = require("nodemailer");
require("dotenv").config();

const { YAHOO_COM_MAIL, YAHOO_COM_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: 465,
  secure: true,
  auth: {
    user: YAHOO_COM_MAIL,
    pass: YAHOO_COM_PASSWORD,
  },
});

const sendEmail = async (data) => {
  const email = { ...data, from: YAHOO_COM_MAIL };
  await transport.sendMail(email);
  console.log("Email send success");
  return true;
};

module.exports = sendEmail;
