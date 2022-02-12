const Bot = require('./classes/Bot');
const Players = require('./models/Players');

(async () => {
  // init
  // require("./Scripts/updateTops");
  // require("./services/heroku");
  // if (config.environment === "development") return;
  let bot = new Bot(); // el bot sera el mismo para todo el proyecto
  global.bot = bot;
  try {
    await bot.begin();
    let login = await bot.login(process.env.USER, process.env.PASS);
    // if (login) {
    const cookies = await bot.getFormattedCookies();
    console.log('🚀 Aqui *** -> cookies', cookies);
  } catch (error) {
    console.log('🚀 Aqui *** -> error', error);
  } finally {
    require('./cronjobs');
  }

  // empezando tareas en segundo plano
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
  // } else {
  // console.log('ALGO SALIO MAL CON LOGIN ! COOKIE VENCIDA');
  // }
})();
