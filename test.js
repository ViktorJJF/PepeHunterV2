let axios = require('axios');
const cheerio = require('cheerio');

async function getPlayersMilitaryInformation(page = 1) {}

(async () => {
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    try {
      let players = await getPlayersMilitaryInformation(page);
      if (players.length > 0) {
        console.log('los jugadores: ', players);
        console.log('TERMINADA: ', page);
        page += 1;
      } else {
        hasNext = false;
      }
    } catch (error) {
      // no se suma la pagina
      console.log('Error obteniendo informacion: ', error);
    }
  }
  console.log('FINALIZADA INFO MILITAR');
})();
