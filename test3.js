const initMongo = require('./config/mongo');

initMongo();
const Planets = require('./models/Planets');

(async () => {
  let planets = await Planets.find({
    $and: [
      { galaxy: 1 },
      { system: { $gte: 1, $lte: 1 } },
      { playerId: { $exists: true } },
      { state: { $ne: 'admin' } },
      { rank: { $lte: 200 } },
    ],
  });
  console.log('🚀 Aqui *** -> planets', planets);
})();
