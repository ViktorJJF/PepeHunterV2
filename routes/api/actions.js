const express = require('express');

const router = express.Router();

const Planets = require('../../models/Planets');
const Players = require('../../models/Players');
const config = require('../../config');

router.post('/scan-universe', async (req, res) => {
  try {
    res.status(200).json({ ok: true, msg: 'Todo ok' });
    let { keepPrevious } = req.body;
    let { bot } = global;
    if (!keepPrevious) {
      await Planets.deleteMany({
        server: config.SERVER,
      });
    }
    for (let galaxy = 1; galaxy <= config.NUMBER_GALAXIES; galaxy++) {
      for (let solarSystem = 1; solarSystem <= 499; solarSystem++) {
        try {
          let solarSystemPlanets = await bot.solarSystemScraping(
            galaxy,
            solarSystem,
          );
          console.log('🚀 Aqui *** -> solarSystemPlanets', solarSystemPlanets);
          if (solarSystemPlanets.length > 0) {
            Planets.insertMany(solarSystemPlanets);
            // for (const planet of solarSystemPlanets) {
            //   // crear jugadores
            //   if (planet.playerId && !planet.isAdmin) {
            //     console.log('creando a: ', planet.playerName);
            //     new Players({
            //       playerId: planet.playerId,
            //       allianceId: planet.allianceId,
            //       allianceName: planet.allianceName,
            //       allianceTag: planet.allianceTag,
            //       alliancememberCount: planet.alliancememberCount,
            //       highscorePositionAlliance: planet.highscorePositionAlliance,
            //       name: planet.name,
            //       rank: planet.rank,
            //       isBanned: planet.isBanned,
            //       state: planet.state,
            //       rankTitle: planet.rankTitle,
            //       server: planet.server,
            //     }).save();
            //   }
            // }
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
      msg: `Terminado`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, msg: 'Algo salio mal' });
  }
});

module.exports = router;
