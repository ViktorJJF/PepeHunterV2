module.exports = {
  SERVER: 's183',
  LANGUAGE: 'es',
  UNIVERSE: 'Earth',
  PEPEBOTDOMAIN:
    process.env.PEPEBOTDOMAIN ||
    'https://f4cf-2001-1388-59a3-8e0f-dc3-128a-79e0-41a1.ngrok.io',
  PEPEHUNTERDOMAIN: 'https://pepehunter-v2.herokuapp.com',
  TELEGRAM_OWN_ID: '624818317',
  TELEGRAM_OWN_USERNAME: '@ViktorJJF',
  NUMBER_GALAXIES: 5,
  GF_TOKEN:
    process.env.GF_TOKEN ||
    (process.env.NODE_ENV === 'development'
      ? '648a327e-329c-4c4e-9238-25c976408ddd'
      : '8051ede3-16e5-4971-9696-80d7822169a1'), // obtenido de cookies
  // GF_TOKEN: '16b8bf5c-35b0-43c5-a708-9c96a3a3e26c',
  PLAYER_ID: '100269', // el id de jugador del bot hunter
  NEWBIE_RANK_THRESHOLD: 200,
};
