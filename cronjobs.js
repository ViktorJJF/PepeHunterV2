const schedule = require('node-schedule');
const axios = require('axios');
const config = require('./config');
const startHunter = require('./scripts/hunter');

if (process.env.NODE_ENV === 'development') return;

console.log('EMPEZANDO CRONJOBS');

// '* * * * * *' - runs every second
// '*/5 * * * * *' - runs every 5 seconds
// '10,20,30 * * * * *' - run at 10th, 20th and 30th second of every minute
// '0 * * * * *' - runs every minute
// '0 0 * * * *' - runs every hour (at 0 minutes and 0 seconds)

// cada 15 min - Sincronizacion puntos militares
schedule.scheduleJob('*/15 * * * *', () => {
  console.log('EMPEZANDO ACTUALIZACION INFORMACION MILITAR');
  axios
    .post(`${config.PEPEHUNTERDOMAIN}/api/actions/sync-military-information`)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
});

// cada dia a las 4am (Hora Peru) - Escaneo del universo
let rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 4;
rule.minute = 30;

schedule.scheduleJob(rule, () => {
  console.log('EMPEZANDO A ESCANEAR UNIVERSO');
  axios
    .post(`${config.PEPEHUNTERDOMAIN}/api/actions/scan-universe`)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
});

// empezando hunter
startHunter();
