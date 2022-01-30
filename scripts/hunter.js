const Players = require('../models/Players');
const Activities = require('../models/Activities');
const OverviewActivities = require('../models/OverviewActivities');
const config = require('../config');
const {
  timeout,
  sendTelegramMessageBroadcast,
  sendTelegramMessage,
} = require('../utils/utils');
const autoWatchdog = require('./autoWatchdog');

async function startHunter() {
  if (process.env.NODE_ENV === 'development') return;
  await timeout(10 * 1000);
  console.log('EMPEZANDO HUNTER');
  while (true) {
    const huntedPlayers = await Players.find({
      isHunted: true,
      server: config.SERVER,
    });
    for (const player of huntedPlayers) {
      await hunterPlayer(player);
    }
    // esperar 6 min
    await timeout(6 * 60 * 1000);
  }
}

async function hunterPlayer(player) {
  console.log('HUNTEANDO A: ', player.name);
  // obteniendo sus ultimas actividades
  if (player.state === 'vacation') {
    sendTelegramMessage(
      '',
      `El jugador <b>${player.name}</b> se puso modo vacaciones. Lo quitaré de la lista de hunteados`,
      true,
    );
    player.isHunted = false;
    player.save();
  } else {
    const recentActivities = await Activities.find({
      playerId: player._id,
      coords: { $in: [...player.planets.map((el) => el.coords)] },
    })
      .limit(player.planets.reduce((acc, el) => acc + (el.moon ? 2 : 1), 0))
      .sort({ createdAt: -1 });
    const { planets } = player;
    const { bot } = global;
    let activities = [];
    let promises = planets.map((planet) =>
      bot.checkPlanetActivity(planet.coords),
    );
    let responses = await Promise.all(promises);
    for (const response of responses) {
      for (const activity of response) {
        activity.playerId = player._id;
      }
      activities.push(...response);
    }
    // comparando y mandando mensajes telegram
    let isOff = activities.every((activity) => activity.lastActivity === 'off');
    let isPartiallyOff = activities.every(
      (activity) => activity.lastActivity !== 'on',
    );
    let hasOnInOneMoon =
      activities.filter(
        (activity) =>
          activity.lastActivity === 'on' && activity.type === 'moon',
      ).length === 1 &&
      activities.filter((activity) => activity.lastActivity === 'off')
        .length ===
        activities.length - 1;
    let hasMinutesInOneMoon =
      activities.filter(
        (activity) =>
          activity.lastActivity !== 'on' &&
          activity.lastActivity !== 'off' &&
          activity.type === 'moon',
      ).length === 1 &&
      activities.filter((activity) => activity.lastActivity === 'off')
        .length ===
        activities.length - 1;
    let isPartiallyOffPrev = recentActivities.every(
      (activity) => activity.lastActivity !== 'on',
    );
    if (isOff) {
      sendTelegramMessageBroadcast(
        `<b>${player.name}</b> está <b>completamente</b> dormido 😴💤🛌`,
      );
      new OverviewActivities({
        lastActivity: 'off',
        playerId: player._id,
      }).save();
    } else if (hasMinutesInOneMoon) {
      sendTelegramMessageBroadcast(
        `👁️ <b>${player.name}</b> tiene minutero solo en 1 luna y todo lo demás está off. Probablemente llegó su flota hace varios minutos`,
      );
    } else if (isPartiallyOffPrev && isPartiallyOff) {
      sendTelegramMessageBroadcast(
        `<b>${player.name}</b> está durmiendo 💤 desde el escaneo anterior 😴`,
      );
    } else if (isPartiallyOff) {
      sendTelegramMessageBroadcast(`<b>${player.name}</b> está durmiendo 😴💤`);
      // esta on
      new OverviewActivities({
        lastActivity: 'partiallyOff',
        playerId: player._id,
      }).save();
      // verificar si se trata de jugador amigo, para activar watchdog
      if (player.hasWatchdog) {
        autoWatchdog(player.name, player.playerId);
      }
    } else {
      // esta on
      if (hasOnInOneMoon) {
        sendTelegramMessageBroadcast(
          `👁️ <b>${player.name}</b> tiene actividad solo en 1 luna y todo lo demás está off. Probablemente acaba de llegar su flota`,
        );
      }
      new OverviewActivities({
        lastActivity: 'on',
        playerId: player._id,
      }).save();
    }

    Activities.insertMany(activities);
  }
}

module.exports = startHunter;
