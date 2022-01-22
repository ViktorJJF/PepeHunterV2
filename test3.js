require('dotenv-safe').config();
const initMongo = require('./config/mongo');

initMongo();
const Planets = require('./models/Planets');

(async () => {
  let planets = await Planets.find({
    $and: [
      { galaxy: 4 },
      { system: { $gte: 170, $lte: 300 } },
      { playerId: { $exists: true } },
      { state: { $ne: 'admin' } },
      { rank: { $lte: 200 } },
    ],
  }).distinct('playerId');
  console.log('🚀 Aqui *** -> planets', planets);
})();
