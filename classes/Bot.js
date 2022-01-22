const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const { timeout, convertToInt } = require('../utils/utils');
const config = require('../config');

module.exports = class Bot {
  constructor() {
    // check mongoose model
    this.BASE_URL = 'https://pl.ogame.gameforge.com/';
    this.LOGIN_URL = 'https://lobby.ogame.gameforge.com/es_ES/';
    this._id = null;
    this.server = null;
    this.language = null;
    this.telegramGroupId = null;
    this.telegramId = null;
    this.ogameEmail = process.env.USER;
    this.ogamePassword = process.env.PASS;
    this.state = null;
    this.userId = null;
    this.page = null;
    this.browser = null;
    this.navigationPromise = null;
    this.typingDelay = 50;
    this.currentPage = 0;
    this.actions = [];
    this.cookies = null;

    // currentPage
    // 0 -- > mainPage
    // 1 -- > Galaxy
    // this.HEADERS = [('User-agent', 'Mozilla/5.0 (Windows NT 6.2; WOW64)\
    //  AppleWebKit/537.15 (KHTML, like Gecko) Chrome/24.0.1295.0 Safari/537.15')]
  }

  async begin() {
    console.log('iniciando bot...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    this.page = await this.browser.newPage();
    this.page.setDefaultTimeout(30000);
    this.navigationPromise = this.page.waitForNavigation();

    await this.page.goto(this.LOGIN_URL);

    console.log('se termino el inicio');
  }

  async login(ogameEmail, ogamePassword, page) {
    try {
      page = page || this.page;
      console.log(`Empezando Logeo...`);
      // closing add
      await this.closeAds(page);
      await page.waitForSelector('.cookiebanner5:nth-child(2)');
      await page.click('.cookiebanner5:nth-child(2)');

      await page.waitForSelector('#loginRegisterTabs .tabsList li');
      await page.click('#loginRegisterTabs .tabsList li');

      await page.waitForSelector('input[type="email"]');
      await page.click('input[type="email"]');
      await page.type('input[type="email"]', ogameEmail || this.ogameEmail, {
        delay: this.typingDelay,
      });

      await page.waitForSelector('input[type="password"]');
      await page.click('input[type="password"]');
      await page.type(
        'input[type="password"]',
        ogamePassword || this.ogamePassword,
        {
          delay: this.typingDelay,
        },
      );
      if (process.env.NODE_ENV === 'development') {
        await page.waitForSelector(
          '#loginTab > #loginForm > p > .button-primary > span',
        );
        await page.evaluate(() => {
          document.querySelector("button[type='submit']").click();
        });
      } else {
        // el inicio de sesion es mediante cookie
        await page.evaluate((token) => {
          console.log('el token: ', token);
          function setCookie(name, value, days) {
            let expires = '';
            if (days) {
              let date = new Date();
              date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
              expires = `; expires=${date.toUTCString()}`;
            }
            document.cookie = `${name}=${value || ''}${expires}; path=/`;
          }
          setCookie('gf-token-production', token, 7);
          console.log('COOKIE AGREGADO!');
          return true;
        }, config.GF_TOKEN);
        // await page.goto(
        //   "https://${config.SERVER}-${config.LANGUAGE}.ogame.gameforge.com/game/index.php?page=ingame&component=overview&relogin=1"
        // );
        await page.goto(
          `https://${config.SERVER}-${config.LANGUAGE}.ogame.gameforge.com/game/index.php?page=ingame&component=overview&relogin=1`,
        );
      }

      await page.waitForSelector('.column > div > #joinGame > a > .button', {
        timeout: 3000,
      });
      await page.click('.column > div > #joinGame > a > .button');

      // await page.waitForSelector(".open > .rt-tr > .rt-td > .btn > span");
      // await page.click(".open > .rt-tr > .rt-td > .btn > span");

      await page.waitForSelector('.open > .rt-tr > .rt-td > .btn > span');
      let pageToClose = page;
      // main page ogame
      page = await this.clickAndWaitForTarget(
        '.open > .rt-tr > .rt-td > .btn > span',
        page,
        this.browser,
      );
      // guardando cookies
      this.setCookies(page);
      await pageToClose.close();
      await page.close();
      // await this.closeAds();
      console.log('Logeo finalizado exitosamente');
      return true;
    } catch (error) {
      console.log(error);
      // intentando nuevo logeo
      console.log('intentando nuevamente');
      let secondLogin = await this.login(ogameEmail, ogamePassword, page);
      if (secondLogin) {
        return true;
      }
      return false;
    }
  }

  async createNewPage() {
    let mainMenuUrl = `https://${config.SERVER}-${config.LANGUAGE}.ogame.gameforge.com/game/index.php?page=ingame&component=overview&relogin=1`;
    let page = await this.browser.newPage();
    page.setDefaultTimeout(30000);
    await page.goto(mainMenuUrl, {
      waitUntil: 'networkidle0',
      timeout: 0,
    });
    return page;
  }

  async checkLoginStatus(page) {
    try {
      page = page || this.page;
      let currentPage = null;
      // refrescando pagina
      page = await this.createNewPage();
      currentPage = await page.evaluate(() => {
        let selector;
        selector = document.querySelector('div#toolbarcomponent');
        if (selector) {
          console.log('se cumplio mainPage');
          return 'mainPage';
        }
        selector = document.querySelector('#joinGame>a>button.button');
        if (selector) {
          console.log('se cumplio playoage');
          return 'playPage';
        }
        selector = document.querySelector(
          '.rt-td.action-cell>button[type="button"]',
        );
        if (selector) {
          console.log('se cumplio selecUniversePage');
          return 'selectUniversePage';
        }
      });
      console.log('se verificara en que pagina estamos...');
      switch (currentPage) {
        case 'mainPage':
          console.log('no paso nada.. seguimos normal');
          this.setCookies(page); // se reingrensan los cookies

          await page.close();
          break;
        case 'playPage':
          try {
            console.log('nos encontramos en vista playPage');
            await page.waitForSelector('#joinGame>a>button.button');
            await page.click('#joinGame>a>button.button');
            await page.waitForSelector(
              '.rt-td.action-cell>button[type="button"]',
            );
            page = await this.clickAndWaitForTarget(
              '.rt-td.action-cell>button[type="button"]',
              page,
              this.browser,
            );
            this.setCookies(page); // se reingrensan los cookies

            await page.close();
          } catch (error) {
            console.log('se dio un error en playpage');
            await this.checkLoginStatus(page);
          }
          break;
        case 'selectUniversePage':
          console.log('nos encontramos en vista universo');
          console.log('empezaremos el clickAndwait');
          page = await this.clickAndWaitForTarget(
            '.rt-td.action-cell>button[type="button"]',
            page,
            this.browser,
          );
          console.log('se termino el click and wait');
          // main page ogame
          this.setCookies(page); // se reingrensan los cookies

          await page.close();
          break;
        default:
          console.log('el caso default: a logearse');
          await this.login(null, null, page);
          console.log('cambiamos de pagina');
          break;
      }
      console.log('se retornara la pagina cerrada');
      // await page.close();
      return 0;
    } catch (error) {
      console.log('aaaaaa', error);
    }
  }

  async refreshPage(page) {
    page = page || this.page;
    console.log('refrescando ogame');
    await page.waitForSelector('.smallplanet', {
      timeout: 15000,
    });
    let planets = await page.$$('.smallplanet');
    let selectedPlanet = planets[0];
    await timeout(1.5 * 1000);
    await selectedPlanet.evaluate((e) => e.querySelector('a').click());
    // await this.navigationPromise;
  }

  async goToPage(pageName, page) {
    var page = page || this.page;
    // closing add
    switch (pageName) {
      case 'galaxy':
        this.currentPage = 'galaxy';
        console.log('yendo a vista galaxias');
        await page.waitForSelector(
          '#toolbarcomponent > #links > #menuTable > li:nth-child(9) > .menubutton',
        );
        await page.click(
          '#toolbarcomponent > #links > #menuTable > li:nth-child(9) > .menubutton',
        );
        // await navigationPromise
        break;
      case 'fleet':
        console.log('yendo a vista flota');
        await page.waitForSelector(
          '#toolbarcomponent > #links > #menuTable > li:nth-child(9) > .menubutton',
        );
        await page.click(
          '#toolbarcomponent > #links > #menuTable > li:nth-child(9) > .menubutton',
        );
        break;
      case 'fleetMovement':
        console.log('yendo a vista flota');
        await page.waitForSelector(
          '#toolbarcomponent > #links > #menuTable > li:nth-child(9)>span.menu_icon>a',
        );
        await page.click(
          '#toolbarcomponent > #links > #menuTable > li:nth-child(9)>span.menu_icon>a',
        );
        break;

      default:
        break;
    }
    // await this.closeAds();
  }

  /**
   *
   * @description Escanea planeta y luna (si lo tiene)
   */
  async checkPlanetActivity(coords) {
    let activities = [];
    try {
      let [galaxy, system, position] = coords.split(':');
      // el formato
      // {
      //   date: new Date(),
      //   lastActivity: null,
      //   type: moon | planet
      // }
      const response = await this.getSolarSystemInformation(galaxy, system);
      if (response.status === 200 && !response.data) {
        console.log('LOGUEATE DE NUEVO');
        throw new Error('Cookie vencida');
      } else {
        let { data } = response;
        let { galaxyContent } = data.system;
        for (const content of galaxyContent) {
          if (content.position === parseInt(position)) {
            for (const planet of content.planets) {
              let { planetType } = planet;
              if (planetType === 1 || planetType === 3) {
                activities.push({
                  date: new Date(),
                  lastActivity:
                    planet.activity.showActivity === 15
                      ? 'on'
                      : planet.activity.showActivity === false
                      ? 'off'
                      : String(planet.activity.idleTime),
                  type: planetType === 1 ? 'planet' : 'moon',
                  coords,
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      // si algo salio mal, repetir la accion
      let page = await this.createNewPage();
      await this.checkLoginStatus(page);
      return this.checkPlanetActivity(coords);
    }
    return activities;
  }

  async solarSystemScraping(galaxy, system) {
    let solarSystemPlanets = [];

    const response = await this.getSolarSystemInformation(galaxy, system);
    if (response.status === 200 && !response.data) {
      console.log('LOGUEATE DE NUEVO');
    } else {
      let { data } = response;
      let { galaxyContent } = data.system;
      for (const content of galaxyContent) {
        let planetJson = {};
        planetJson.server = config.SERVER;
        planetJson.galaxy = content.galaxy;
        planetJson.system = content.system;
        planetJson.position = content.position;
        if (
          content.position === 16 &&
          content.planets.planetName === 'Campo de escombros'
        ) {
          // verificar si tiene escombros de expediciones
          planetJson.debris = content.planets.resources;
        }
        planetJson.coords = `${content.galaxy}:${content.system}:${content.position}`;

        if (content.planets.length > 0 && content.player.playerId !== 99999) {
          planetJson.allianceId = content.player.allianceId;
          planetJson.allianceName = content.player.allianceName;
          planetJson.allianceTag = content.player.allianceTag;
          planetJson.alliancememberCount =
            content.player.actions.alliance.memberCount || 0;
          planetJson.highscorePositionAlliance = content.player
            .highscorePositionAlliance
            ? parseInt(content.player.highscorePositionAlliance)
            : 0;
          planetJson.name = content.planets[0].planetName;
          planetJson.playerName = content.player.playerName;
          planetJson.rank = content.player.highscorePositionPlayer;
          planetJson.isBanned = content.player.isBanned;
          planetJson.isAdmin = content.player.isAdmin;
          planetJson.isBuddy = content.player.isBuddy;
          planetJson.honor = content.player.isHonorableTarget;
          planetJson.isBanned = content.player.isBanned;
          planetJson.state = content.player.isAdmin
            ? 'admin'
            : content.player.isOnVacation
            ? 'vacation'
            : content.player.isInactive
            ? 'inactive'
            : content.player.isNewbie
            ? 'green'
            : content.player.rank.rankClass.includes('rank_starlord')
            ? 'starlord'
            : content.player.rank.rankClass.includes('rank_bandit')
            ? 'bandit'
            : 'normal';
          planetJson.rankTitle = content.player.rank.rankTitle;
          planetJson.moon = !!content.planets.find((el) => el.planetType === 3);
          if (planetJson.moon) {
            planetJson.moonDestroyed = content.planets.find(
              (el) => el.planetType === 3,
            ).isDestroyed;
          }
          planetJson.playerId = content.player.playerId;
          // verificando actividades
          for (const planet of content.planets) {
            let { planetType } = planet;
            if (planetType === 1) {
              planetJson.planetActivity =
                planet.activity.showActivity === 15
                  ? 'on'
                  : planet.activity.showActivity === false
                  ? 'off'
                  : String(planet.activity.idleTime);
            }
            if (planetType === 3) {
              planetJson.moonActivity =
                planet.activity.showActivity === 15
                  ? 'on'
                  : planet.activity.showActivity === false
                  ? 'off'
                  : String(planet.activity.idleTime);
            }
          }
        } else if (content.planets.length > 0) {
          // el planeta está vacio / sin jugador
          planetJson.isDestroyed = !!content.planets.find(
            (el) => el.isDestroyed,
          );
        }
        solarSystemPlanets.push(planetJson);
      }
    }
    return solarSystemPlanets;
  }

  async closeAds(page) {
    console.log('entrando a closeAds');
    var page = page || this.page;
    await timeout(2700);
    let adState = await page.evaluate(() => {
      let ad = document.querySelector('.openX_int_closeButton > a');
      return ad;
    });
    console.log('se encontro este add: ', adState);
    if (adState) {
      console.log('cerrando add en goToPage');
      await this.page.waitForSelector('.openX_int_closeButton > a');
      await this.page.click('.openX_int_closeButton > a');
    }
    return 0;
  }

  async clickAndWaitForTarget(clickSelector, page, browser) {
    const pageTarget = page.target(); // save this to know that this was the opener
    await page.click(clickSelector); // click on a link
    const newTarget = await browser.waitForTarget(
      (target) => target.opener() === pageTarget,
    ); // check that you opened this page, rather than just checking the url
    const newPage = await newTarget.page(); // get the page object
    // await newPage.once("load",()=>{}); //this doesn't work; wait till page is loaded
    await newPage.waitForSelector('body'); // wait for page to be loaded
    // newPage.on("console", consoleObj => console.log(consoleObj.text()));
    return newPage;
  }

  async hunter(playerInfo, page) {
    console.log('empezando hunter para...', playerInfo.nickname);
    for (const planet of playerInfo.planets) {
      let activity = await this.checkPlanetActivity();
      planet.activities.push(activity);
    }
    console.log('se termino de ejecutar hunter para..', playerInfo.nickname);
    console.log('info: ', JSON.stringify(playerInfo));
    return playerInfo;
  }

  async setCookies(page) {
    this.cookies = await page.cookies();
  }

  async getCookies() {
    return this.cookies;
  }

  getFormattedCookies() {
    return this.cookies
      .map(
        (cookie, index) =>
          `${cookie.name}=${cookie.value}${
            index !== this.cookies.length - 1 ? ';' : ''
          }`,
      )
      .join(' ');
  }

  async getSolarSystemInformation(galaxy, system) {
    return await axios({
      method: 'post',
      url: `https://${config.SERVER}-${config.LANGUAGE}.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy&action=fetchGalaxyContent&ajax=1&asJson=1`,
      headers: {
        accept: '*/*',
        'accept-language': 'en,en-US;q=0.9,es-ES;q=0.8,es;q=0.7',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest',
        Referer: `https://${config.SERVER}-${config.LANGUAGE}.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy`,
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        cookie: this.getFormattedCookies(),
      },
      data: `galaxy=${galaxy}&system=${system}`,
    });
  }

  async getPlayersInformation(page = 1) {
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
        Cookie: this.getFormattedCookies(),
      },
    });
    if (
      response.data.includes('You need to enable JavaScript to run this app')
    ) {
      console.log('LOGEATE');
      throw new Error('Cookie vencida');
    } else {
      let $ = cheerio.load(response.data);
      $('tbody tr').each((index, element) => {
        // console.log('El rank: ', $(element));
        console.log('el element: ', $('.score', element).text().trim());
        let linkToPrincipal = $('.name>a', element)
          .attr('href')
          .trim()
          .match(/\d+/g);
        players.push({
          playerId: parseInt($(element).attr('id').replace('position', '')),
          // name: $('.playername', element).text().trim(),
          numberOfShips: convertToInt(
            $('.score', element).attr('title').replace('Naves:', '').trim(),
          ),
          server: config.SERVER,
          militaryPoints: convertToInt($('.score', element).text().trim()),
          rankMilitary: convertToInt($('.position', element).text().trim()),
          mainPlanet: `${linkToPrincipal[1]}:${linkToPrincipal[2]}:${linkToPrincipal[3]}`,
        });
      });
    }
    return players;
  }
};
