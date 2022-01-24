/**
 *
 * @param {number} playerId Id de ogame del jugador
 */

const axios = require('axios');
const { sendTelegramMessage } = require('../utils/utils');
const config = require('../config');

async function autoWatchdog(playerName, playerId) {
  try {
    await axios.post(`${config.PEPEBOTDOMAIN}/api/autowatchdog`, { playerId });
    await sendTelegramMessage(
      `<b>${playerName}</b> activé tu <b>watchDog</b> 🦮 porque estuviste off en mi último escaneo`,
    );
  } catch (error) {
    console.log(error);
    sendTelegramMessage(
      '',
      `${playerName} intenté activar tu watchdog porque estuviste off en mi último escaneo, pero algo <b>salió mal</b>`,
      true,
    );
  }
}

module.exports = autoWatchdog;
