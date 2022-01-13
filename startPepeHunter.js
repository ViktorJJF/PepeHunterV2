const Bot = require('./classes/Bot');

(async () => {
  // init
  // require("./Scripts/updateTops");
  // require("./services/heroku");
  // if (config.environment === "development") return;
  let bot = new Bot(); // el bot sera el mismo para todo el proyecto
  global.bot = bot;
  await bot.begin();
  await bot.login(process.env.USER, process.env.PASS);
  const cookies = await bot.getFormattedCookies();
  console.log('🚀 Aqui *** -> cookies', cookies);
  // if (config.environment === 'development') return;
  // let playersFromDB = await Player.find(
  //   {
  //     server: config.SERVER,
  //   },
  //   ['nickname', 'hunt'],
  // );
  // // console.log("players from db es:", playersFromDB);
  // // change
  // playersFromDB.forEach((player) => {
  //   if (player.hunt) {
  //     playersToHunt.push(player.nickname);
  //   }
  // });
  // playersFromDB = null;
  // while (1 === 1) {
  //   for (const playerToHunt of playersToHunt) {
  //     await hunter(playerToHunt, bot);
  //   }
  //   await timeout(0 * 60 * 1000);
  // }
})();
