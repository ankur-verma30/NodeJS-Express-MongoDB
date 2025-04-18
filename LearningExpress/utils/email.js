const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2) Define the email options
  const mailOptions = {
    from: "Ankur Verma <ankurverma7619@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };
  await transporter.sendMail(mailOptions);
  //3) Send the email
};

module.exports = sendEmail;
