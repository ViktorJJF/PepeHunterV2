const callMeBot = require('./callMeBot');
const config = require('../config');

let accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
let authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken, {
  lazyLoading: true,
});

// Function to send message to WhatsApp
const makePhoneCall = async (number) =>
  new Promise((resolve, reject) => {
    client.calls
      .create({
        to: number,
        url: 'http://demo.twilio.com/docs/voice.xml',
        from: `(252) 429-5033`, // numero del bot
        timeout: 15,
        timeLimit: 15,
      })
      .then((call) => resolve(call.sid))
      .catch((err) => {
        console.log(err);
        reject(err);
        // si hubiese error, usar llamada callmeBot
        callMeBot(config.TELEGRAM_OWN_USERNAME, 'ERROR EN TWILIO');
      });
  });

// (async () => {
//   console.log(await makePhoneCall("+51951342603"));
// })();

module.exports = {
  makePhoneCall,
};
