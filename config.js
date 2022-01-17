module.exports = {
  SERVER: 's183',
  LANGUAGE: 'es',
  UNIVERSE: 'Earth',
  PEPEBOTDOMAIN: 'http://localhost:7000',
  NUMBER_GALAXIES: 5,
  GF_TOKEN:
    process.env.NODE_ENV === 'development'
      ? '956fea0e-6f8d-447e-a744-b3f3e0dca441'
      : '8051ede3-16e5-4971-9696-80d7822169a1', // obtenido de cookies
  // GF_TOKEN: '16b8bf5c-35b0-43c5-a708-9c96a3a3e26c',
  PLAYER_ID: '', // el id de jugador del bot hunter
};
