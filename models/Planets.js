const mongoose = require('mongoose');

let { Schema } = mongoose;

let schema = new Schema(
  {
    server: String,
    galaxy: Number,
    system: Number,
    position: Number,
    allianceId: Number,
    allianceName: String,
    allianceTag: String,
    alliancememberCount: Number,
    highscorePositionAlliance: Number,
    name: String,
    playerName: String,
    rank: Number,
    isBanned: Boolean,
    isBuddy: Boolean,
    honor: Boolean,
    state: String,
    rankTitle: String,
    moon: Boolean,
    moonDestroyed: Boolean,
    coords: { type: String, unique: true },
    playerId: Number,
    debris: {},
    planetActivity: String,
    moonActivity: String,
  },
  { versionKey: false, timestamps: true },
);

schema.virtual('player', {
  ref: 'Players',
  localField: 'playerId',
  foreignField: 'playerId',
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

mongoose.model('Planets', schema).syncIndexes();

module.exports = mongoose.model('Planets', schema);
