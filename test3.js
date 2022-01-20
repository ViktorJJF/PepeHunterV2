const initMongo = require('./config/mongo');

initMongo();
const Players = require('./models/Players');

(async () => {
  await Players.deleteMany({ rankMilitary: { $gte: 89 } });
  console.log('hecho');
})();
