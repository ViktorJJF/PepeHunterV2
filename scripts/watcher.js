const db = require('../helpers/db');
const Alarms = require('../models/Alarms');
const Players = require('../models/Players');
const callMeBot = require('../services/callMeBot');
const { timeout, scanPlayer, sendTelegramMessage } = require('../utils/utils');

async function startWatcher() {
  if (process.env.NODE_ENV === 'development') return;
  // await timeout(10 * 1000);
  console.log('EMPEZANDO WATCHER');
  const alarms = await Alarms.find({});
  for (const alarm of alarms) {
    selectActions(alarm);
  }
}

async function selectActions(alarm) {
  switch (alarm.action) {
    case 'watchPlayerOff':
      watchPlayerOff(alarm);
      break;

    default:
      break;
  }
}

async function watchPlayerOff(alarm) {
  console.log('🚀 Aqui *** -> alarm', alarm);
  // buscando jugador
  let player = await Players.findOne({ _id: alarm.playerId });
  let isPlayerOn = true;
  while (isPlayerOn) {
    // escaneando a jugador
    let activities = await scanPlayer({ nickname: player.name });
    let isOn = activities.some((activity) => activity.lastActivity === 'on');
    if (!isOn) {
      isPlayerOn = false;
    }
    // esperar 2 min para siguiente revision
    await timeout(2 * 60 * 1000);
  }
  // el jugador se quedó off, eliminar alarma de bd
  db.deleteItem(alarm._id, Alarms);
  // mandar mensaje telegram
  sendTelegramMessage(
    '',
    `👁️ El jugador ${player.name} se quedó off ! 💤`,
    true,
  );
  // llamar con callmebot
  callMeBot(alarm.telegramUsername);
}

module.exports = startWatcher;
