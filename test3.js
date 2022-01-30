require('dotenv-safe').config();
const initMongo = require('./config/mongo');
const config = require('./config');

initMongo();
require('./helpers/db');
const Activities = require('./models/Activities');
const Planets = require('./models/Planets');
const Players = require('./models/Players');

(async () => {
  let nickname = 'DES';
  let regex = new RegExp(`^${nickname}$`, 'i');
  let planets = [];
  if (nickname) {
    planets = await Planets.find({ playerName: { $regex: regex } });
    console.log('🚀 Aqui *** -> planets', planets);
  }
})();
