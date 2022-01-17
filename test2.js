let axios = require('axios');

let data =
  'token=c1e5976b8e69f8d3d9157d222c7b0a5f&am207=2187&am214=7&am202=10000&am210=29380&galaxy=6&system=71&position=16&type=1&metal=0&crystal=0&deuterium=0&prioMetal=1&prioCrystal=2&prioDeuterium=3&mission=6&speed=10&retreatAfterDefenderRetreat=0&union=0&holdingtime=0';

let config = {
  method: 'post',
  url: 'https://s208-es.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch&action=sendFleet&ajax=1&asJson=1',
  headers: {
    Connection: 'keep-alive',
    'sec-ch-ua':
      '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
    Accept: '*/*',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    'sec-ch-ua-mobile': '?0',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
    'sec-ch-ua-platform': '"Windows"',
    Origin: 'https://s208-es.ogame.gameforge.com',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    Referer:
      'https://s208-es.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch',
    'Accept-Language': 'en,en-US;q=0.9,es-ES;q=0.8,es;q=0.7',
    Cookie:
      'locale=es; tabBoxFleets=%7B%22970228%22%3A%5B1%2C1642163282%5D%2C%22975619%22%3A%5B1%2C1642157233%5D%7D; visibleChats=%7B%22chatbar%22%3Afalse%2C%22players%22%3A%5B100012%5D%2C%22associations%22%3A%5B%5D%7D; maximizeId=null; __auc=0d49033a17e512274d05b6176a1; _ga=GA1.2.2000616038.1642038720; _gid=GA1.2.498502270.1642038720; gf-cookie-consent-4449562312=|7|1; gf-token-production=24e627bf-42ce-432a-a755-085dcd48f360; pc_idt=AKJDlD6aDpAs3iHgopbSEP33iPGgHhzsF29liOeMKHR2rJC3v2dgPRwg--4kUFpeul9tCwH6_hEx5OqlMarnpAi6CJYt3tl4NNoKcHEUKLZO_E0iOJ22qse-hksZVcRLK9YcPiNkBZVvpAE-ebOSwybn0j8pfLXDvg-Cyg; PHPSESSID=b369ee0d04169fa96a2c1ea49a84eec49e99fccf; prsess_102988=b86659a0aea77b40176c8557d5467071',
  },
  data,
};

axios(config)
  .then((response) => {
    let { data } = response;
    console.log('🚀 Aqui *** -> data', data);
    if (!data) {
      console.log('logeate...');
    }
  })
  .catch((error) => {
    console.log(error);
  });
