function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let msToTime = (duration) => {
  console.log('llego esta duracion: ', duration);
  let milliseconds = parseInt((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${
    (hours != 1 ? `${hours} horas ` : `${hours} hora `) + minutes
  } minutos ${seconds} segundos`;
};

function Random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setCommonHeaders({ Referer, Cookie, contentType } = {}) {
  let headers = {
    Connection: 'keep-alive',
    'sec-ch-ua':
      '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
    Accept: '*/*',
    'X-Requested-With': 'XMLHttpRequest',
    'sec-ch-ua-mobile': '?0',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
    'sec-ch-ua-platform': '"Windows"',
    Origin: `https://${config.SERVER}-es.ogame.gameforge.com`,
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    Referer,
    'Accept-Language': 'en,en-US;q=0.9,es-ES;q=0.8,es;q=0.7',
    Cookie,
  };
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  return headers;
}

module.exports = {
  timeout,
  msToTime,
  Random,
  setCommonHeaders,
};
