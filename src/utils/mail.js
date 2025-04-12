import Mailgen from "mailgen";
import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  //1. Initialize mailgen instance
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanager.app",
    },
  })

  //2. Palin text email
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  //3. Generate HTML email 
  const emailHtml = mailGenerator.generate(options.mailgenContent);

 //4. nodemailer transporter => responsible to send a mail
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  })

  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email, // receiver's mail
    subject: options.subject, // mail subject
    text: emailTextual, // mailgen content textual variant
    html: emailHtml, // mailgen content html variant
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file",
    )
    console.error("Error: ", error)
  }
};


export const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
        body: {
          name: username,
          intro: "Welcome to our app! We're very excited to have you on board.",
          action: {
            instructions:
              "To verify your email please click on the following button:",
            button: {
              color: "#22BC66",
              text: "Verify your email",
              link: verificationUrl,
            },
          },
          outro:
            "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};


export const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};













