/**
 *
 * @param {number} playerId Id de ogame del jugador
 */

const axios = require('axios');
const { sendTelegramMessage } = require('../utils/utils');
const config = require('../config');
const { makePhoneCall } = require('../services/twilioCalls');

async function autoWatchdog(playerName, playerId) {
  try {
    makePhoneCall(config.OWN_PHONE_NUMBER);
    await axios.post(`${config.PEPEBOTDOMAIN}/api/autowatchdog`, { playerId });
    await sendTelegramMessage(
      '',
      `<b>${playerName}</b> activé tu <b>watchDog</b> 🦮 porque estuviste off en mi último escaneo`,
      true,
    );
  } catch (error) {
    console.log(error);
    makePhoneCall(config.OWN_PHONE_NUMBER);
    sendTelegramMessage(
      '',
      `${playerName} intenté activar tu watchdog porque estuviste off en mi último escaneo, pero algo <b>salió mal</b>`,
      true,
    );
  }
}

module.exports = autoWatchdog;
