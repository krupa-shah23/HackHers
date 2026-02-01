// SMS Service - Handles sending text messages
// Currently mocked. To use real SMS, sign up for Twilio and fill in the keys.

/* 
// TWILIO SETUP (Uncomment to use)
import twilio from 'twilio';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
*/

export const sendSMS = async (to, message) => {
    try {
        console.log("---------------------------------------------------");
        console.log(`📱 [SMS SIMULATION] Sending to ${to}`);
        console.log(`💬 Message: "${message}"`);
        console.log("---------------------------------------------------");

        /*
        // REAL SENDING LOGIC
        if (process.env.TWILIO_ACCOUNT_SID) {
            await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: to
            });
            console.log('✅ Real SMS sent via Twilio');
        }
        */

        return true;
    } catch (error) {
        console.error("❌ SMS Failed:", error);
        return false;
    }
};
