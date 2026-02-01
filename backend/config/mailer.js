import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
  });
  console.log(`📧 Email sent to ${to} via ${process.env.MAIL_HOST}:${process.env.MAIL_PORT}`);
};

// Verify connection configuration
export const verifyMailer = async () => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
    
    try {
        await transporter.verify();
        console.log("✅ Mailer Config Verified");
    } catch (error) {
        console.error("❌ Mailer Config Error:", error);
    }
};
