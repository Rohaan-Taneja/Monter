import nodemailer from "nodemailer";
import bcrypt from "bcrypt"


const sendVerificationEmail = async (email  , userid) => {
  

    // from where this mail will go ? = smtp.ethereal server
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure:true,
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({

      from: `${process.env.EMAIL}` , // sender address
      to: email, // reciever's address
      subject: "email verification", // Subject
      text: `Hi! There, You have recently visited  
           our website and entered your email. 
           Please follow the given link to verify your email 
           http://localhost:8000/api/v1/users/verify/${userid}
           Thanks` 
    });


    console.log("Message sent: %s", info.messageId);
  }

//   if any eeor occurs 
  main().catch(console.error);
}

export { sendVerificationEmail };
