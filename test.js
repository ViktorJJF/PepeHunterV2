let axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const config = require('./config');

async function getPlayersMilitaryInformation(page = 1) {
  let players = [];

  const response = await axios({
    method: 'post',
    url: `https://${config.SERVER}-${config.LANGUAGE}.ogame.gameforge.com/game/index.php?page=highscoreContent&category=1&type=3&searchRelId=100545&site=${page}`,
    headers: {
      Connection: 'keep-alive',
      'Content-Length': '0',
      'sec-ch-ua':
        '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
      Accept: '*/*',
      'X-Requested-With': 'XMLHttpRequest',
      'sec-ch-ua-mobile': '?0',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
      'sec-ch-ua-platform': '"Windows"',
      Origin: `https://${config.SERVER}-${config.LANGUAGE}.ogame.gameforge.com`,
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      Referer: `https://${config.SERVER}-${config.LANGUAGE}.ogame.gameforge.com/game/index.php?page=highscore&site=3&category=1&searchRelId=${config.PLAYER_ID}`,
      'Accept-Language': 'en,en-US;q=0.9,es-ES;q=0.8,es;q=0.7',
      Cookie:
        'locale=es; maximizeId=null; tabBoxFleets=%7B%2290101%22%3A%5B1%2C1642473836%5D%2C%2289332%22%3A%5B1%2C1642474151%5D%2C%2289348%22%3A%5B1%2C1642474580%5D%2C%2290585%22%3A%5B1%2C1642475300%5D%2C%2290045%22%3A%5B1%2C1642475447%5D%2C%2289369%22%3A%5B1%2C1642476223%5D%7D; __auc=0d49033a17e512274d05b6176a1; _ga=GA1.2.2000616038.1642038720; _gid=GA1.2.498502270.1642038720; gf-cookie-consent-4449562312=|7|1; gf-token-production=751ce7db-bc97-4088-afbc-2535ca500b63; pc_idt=AG67nlP4XbPlYYufVaS5x-dnqB2t2TmCBgYNjszSqTdKwi2xPS5Hpuc67tgTkJA_0aJfqmPRs4XIuQyKbpTnTh4eff2JfEhvkzq-tHqXvTYtWW99xQTpNzDYeP4m--HBytRySUVOwTy1qGA-xFGFH00UDEeOq8CFYZgb0A; PHPSESSID=25317b2aa3729c5875decc94b6e69b2bb9313cfb; prsess_100545=b656c1e997a786c91a97bad81ede1967',
    },
  });
  if (response.data.includes('You need to enable JavaScript to run this app')) {
    console.log('LOGEATE');
    throw new Error('Cookie vencida');
  } else {
    let $ = cheerio.load(response.data);
    $('tbody tr').each((index, element) => {
      // console.log('El rank: ', $(element));
      let linkToPrincipal = $('.name>a', element)
        .attr('href')
        .trim()
        .match(/\d+/g);
      players.push({
        playerId: parseInt($(element).attr('id').replace('position', '')),
        allianceId: '',
        allianceName: '',
        allianceTag: '',
        alliancememberCount: '',
        highscorePositionAlliance: '',
        name: $('.playername', element).text().trim(),
        numberOfShips: parseInt(
          $('.score', element).attr('title').replace('Naves:', '').trim(),
        ),
        state: '',
        rankTitle: '',
        server: '',
        militaryPoints: parseInt($('.score', element).text().trim()),
        rankMilitary: parseInt($('.position', element).text().trim()),
        mainPlanet: `${linkToPrincipal[1]}:${linkToPrincipal[2]}:${linkToPrincipal[3]}`,
      });
    });
  }
  return players;
}

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
