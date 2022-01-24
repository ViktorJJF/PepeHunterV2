const mongoose = require('mongoose');

let { Schema } = mongoose;

let schema = new Schema(
  {
    telegramUsername: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: [
        'watchPlayerOff', // avisar cuando el jugador este off en todos sus planetas
        'watchPlayerMainPlanet', // avisar cuando el jugador tenga actividad en planeta principal
        'watchPlayerPlanetsExceptMain', // avisar cuando jugador tenga actividad en algun planeta excepto principal
      ],
    },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Players',
    },
  },
  { versionKey: false, timestamps: true },
);

mongoose.model('Alarms', schema).syncIndexes();

module.exports = mongoose.model('Alarms', schema);
