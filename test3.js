require('dotenv-safe').config();
const initMongo = require('./config/mongo');
const config = require('./config');

initMongo();
require('./helpers/db');
const Activities = require('./models/Activities');
const Planets = require('./models/Planets');
const Players = require('./models/Players');

(async () => {
  // let from = '2:200';
  // let to = '2:201';
  // let [galaxy, fromSystem] = from.split(':');
  // let [, toSystem] = to.split(':');
  // let planets = await Planets.find({
  //   galaxy,
  //   system: { $gte: fromSystem, $lte: toSystem },
  // }).sort({ system: 1, position: 1 });
  // console.log('🚀 Aqui *** -> galaxy', planets);
  // console.log('🚀 Aqui *** -> toSystem', toSystem);
  Activities.deleteMany({
    createdAt: { $lt: new Date(2021, 1, 6) },
  });
  await console.log('HECHO!');
})();
