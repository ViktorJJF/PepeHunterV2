const express = require('express');

const router = express.Router();

const Planets = require('../../models/Planets');
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
      for (let solarSystem = 1; solarSystem < 499; solarSystem++) {
        try {
          let solarSystemPlanets = await bot.solarSystemScraping(
            galaxy,
            solarSystem,
          );
          console.log('🚀 Aqui *** -> solarSystemPlanets', solarSystemPlanets);
          if (solarSystemPlanets.length > 0) {
            Planets.insertMany(solarSystemPlanets);
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
module.exports = router;
