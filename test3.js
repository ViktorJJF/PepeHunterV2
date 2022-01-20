const initMongo = require('./config/mongo');

initMongo();
const Planets = require('./models/Planets');

(async () => {
  await Planets.findOneAndUpdate(
    { coords: '5:382:13' },
    {
      server: 's183',
      galaxy: 5,
      system: 382,
      position: 13,
      coords: '5:382:13',
      allianceId: 0,
      allianceName: '',
      allianceTag: '',
      alliancememberCount: 0,
      highscorePositionAlliance: 0,
      name: 'Colonia',
      playerName: 'Nabucodonosor',
      rank: 31,
      isBanned: false,
      isAdmin: false,
      isBuddy: false,
      honor: true,
      state: 'starlord',
      rankTitle: 'Emperador',
      moon: true,
      moonDestroyed: false,
      playerId: 100545,
      planetActivity: 'on',
      moonActivity: 'on',
    },
  );
})();
