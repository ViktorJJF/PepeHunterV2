require('dotenv-safe').config();
const initMongo = require('./config/mongo');
const config = require('./config');

initMongo();
require('./helpers/db');
const Activities = require('./models/Activities');
const Players = require('./models/Players');

(async () => {
  const huntedPlayers = await Players.find({
    isHunted: true,
    server: config.SERVER,
  });
  let player = huntedPlayers[0];
  console.log('JUGADOR:', player.name);
  const recentActivities = await Activities.find({
    playerId: player._id,
    coords: { $in: [...player.planets.map((el) => el.coords)] },
  })
    .limit(player.planets.reduce((acc, el) => acc + (el.moon ? 2 : 1), 0))
    .sort({ createdAt: -1 });
  console.log('🚀 Aqui *** -> recentActivities', recentActivities);
  console.log(
    'cantidad de planetas con lunas: ',
    player.planets.reduce((acc, el) => acc + (el.moon ? 2 : 1), 0),
  );
})();
