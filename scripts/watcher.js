const db = require('../helpers/db');
const Alarms = require('../models/Alarms');
const Players = require('../models/Players');
const callMeBot = require('../services/callMeBot');
const { timeout, scanPlayer, sendTelegramMessage } = require('../utils/utils');

async function startWatcher() {
  // if (process.env.NODE_ENV === 'development') return;
  // await timeout(10 * 1000);
  let { bot } = global;
  console.log('EMPEZANDO WATCHER');

  await timeout(10 * 1000);
  while (true) {
    const alarms = await Alarms.find({});
    for (let i = 0; i < alarms.length; i++) {
      try {
        await selectActions(alarms[i]);
      } catch (error) {
        console.log('error en alarma...');
        await bot.checkOrWaitLogin();
        i -= 1;
      }
    }
    // esperar 3 min
    await timeout(1 * 60 * 1000);
  }
}

async function selectActions(alarm) {
  switch (alarm.action) {
    case 'watchPlayerOff':
      await watchPlayerOff(alarm);
      break;

    default:
      break;
  }
}

async function watchPlayerOff(alarm) {
  try {
    // buscando jugador
    let player = await Players.findOne({ _id: alarm.playerId });
    let isPlayerOff = false;
    // escaneando a jugador
    let result = await scanPlayer({ nickname: player.name });
    let isOn = result.activities.some(
      (activity) => activity.lastActivity === 'on',
    );
    if (!isOn) {
      isPlayerOff = true;
    }
    if (isPlayerOff) {
      // el jugador se quedó off, eliminar alarma de bd
      db.deleteItem(alarm._id, Alarms);
      // mandar mensaje telegram
      sendTelegramMessage(
        '',
        `👁️ El jugador ${player.name} se quedó off ! 💤`,
        true,
      );
      // llamar con callmebot
      callMeBot(alarm.telegramUsername, 'Jugador off');
    }
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = startWatcher;
