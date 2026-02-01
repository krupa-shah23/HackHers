import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log("Testing Mail Configuration...");
console.log("Host:", process.env.MAIL_HOST);
console.log("Port:", process.env.MAIL_PORT);
console.log("User:", process.env.MAIL_USER);
console.log("Pass:", process.env.MAIL_PASS ? "****" : "MISSING");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const testEmail = async () => {
    try {
        console.log("Verifying connection...");
        await transporter.verify();
        console.log("✅ Connection verified!");

        console.log("Sending test email...");
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || 'test@example.com',
            to: 'test_recipient@example.com',
            subject: 'Test Email from Debug Script',
            text: 'If you see this, sending works!',
        });
        console.log("✅ Message sent: %s", info.messageId);
    } catch (error) {
        console.error("❌ Error:", error);
    }
};

testEmail();
