const express = require('express');

const router = express.Router();

const Planets = require('../../models/Planets');
const config = require('../../config');
const { updateCreatePlayer, keepTopPlayers } = require('../../utils/utils');

let playersUpdated = [];

router.post('/scan-universe', async (req, res) => {
  try {
    res.status(200).json({ ok: true, msg: 'Todo ok' });
    let { bot } = global;
    for (let galaxy = 1; galaxy <= config.NUMBER_GALAXIES; galaxy++) {
      scanGalaxy(bot, galaxy);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: 'Algo salio mal' });
  }
});

router.post('/scan-player', async (req, res) => {
  try {
    let { nickname } = req.body;
    let { bot } = global;
    // buscando sus coordenadas
    let regex = new RegExp(nickname, 'i');
    let planets = await Planets.find({ playerName: { $regex: regex } });
    let activities = [];
    let promises = planets.map((planet) =>
      bot.checkPlanetActivity(planet.coords),
    );
    let responses = await Promise.all(promises);
    for (let i = 0; i < planets.length; i++) {
      for (const response of responses[i]) {
        activities.push({
          ...response,
          name: planets[i].name,
        });
      }
    }
    res.status(200).json({
      ok: true,
      msg: `Escaneando a ${nickname}`,
      payload: {
        activities,
        player: {
          rank: planets[0].rank,
          alliance: planets[0].allianceTag,
          playerName: planets[0].playerName,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: 'Algo salio mal' });
  }
});

router.post('/sync-military-information', async (req, res) => {
  try {
    console.log('EMPEZANDO A SINCRONIZAR INFORMACION MILITAR');
    let { bot } = global;
    let page = 1;
    let hasNext = true;
    res.status(200).json({
      ok: true,
      msg: `Sincronizando información militar`,
    });
    while (hasNext) {
      try {
        let players = await bot.getPlayersInformation(page);
        if (players.length > 0 && page < 4) {
          players.map((player) => updateCreatePlayer(player.playerId, player));
          console.log('TERMINADA: ', page);
          page += 1;
        } else {
          hasNext = false;
        }
      } catch (error) {
        // no se suma la pagina
        console.log('Error obteniendo informacion: ', error);
        // si algo salio mal, repetir la accion
        let newPage = await bot.createNewPage();
        await bot.checkLoginStatus(newPage);
      }
    }
    keepTopPlayers();
    console.log('FINALIZADA INFO MILITAR');
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: 'Algo salio mal' });
  }
});

async function scanGalaxy(bot, galaxy) {
  for (let solarSystem = 1; solarSystem <= 499; solarSystem++) {
    console.log('escaneando ando');

    try {
      let solarSystemPlanets = await bot.solarSystemScraping(
        galaxy,
        solarSystem,
      );
      console.log(`Escaneado: ${galaxy}:${solarSystem}`);
      if (solarSystemPlanets.length > 0) {
        for (const planet of solarSystemPlanets) {
          if (planet.playerId) {
            // actualizando
            let planetToUpdate = await Planets.findOne({
              coords: planet.coords,
              server: config.SERVER,
            });
            if (planetToUpdate) {
              planetToUpdate.set(planet);
              planetToUpdate.save();
            }
            if (!playersUpdated.includes(planet.playerId)) {
              // creando o actualizando jugador
              updateCreatePlayer(planet.playerId, planet, true);
              playersUpdated.push(planet.playerId);
            }
          }
        }
        // Planets.insertMany(solarSystemPlanets);
      } else {
        throw new Error('Cookie vencido');
      }
    } catch (error) {
      // si algo salio mal, repetir la accion
      let page = await bot.createNewPage();
      page = await bot.checkLoginStatus(page);
      console.log('error escaneando universo: ', error);
      solarSystem -= 1;
    }
    // await timeout(5 * 1000);
  }
  playersUpdated = [];
}

module.exports = router;
