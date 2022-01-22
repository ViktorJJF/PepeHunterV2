const Players = require('../models/Players');
const Activities = require('../models/Activities');
const config = require('../config');
const { timeout } = require('../utils/utils');

async function startHunter() {
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
  const recentActivities = await Activities.find({
    playerId: player._id,
    coords: { $in: [...player.planets.map((el) => el.coords)] },
  })
    .limit(player.planets.length)
    .sort({ createdAt: 1 });
  for (const recentActivity of recentActivities) {
    console.log(
      `ULTIMA [${recentActivity.coords} - ${recentActivity.lastActivity}]`,
    );
  }
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
      console.log(
        `${player.name} -> [${activity.coords}]: ${activity.lastActivity}`,
      );
    }
    activities.push(...response);
  }
  Activities.insertMany(activities);
}

module.exports = startHunter;
