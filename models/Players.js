const mongoose = require('mongoose');

let { Schema } = mongoose;

let schema = new Schema(
  {
    playerId: Number,
    allianceId: Number,
    allianceName: String,
    allianceTag: String,
    alliancememberCount: Number,
    highscorePositionAlliance: Number,
    name: String,
    rank: Number,
    isBanned: Boolean,
    state: String,
    rankTitle: String,
    server: String,
    militaryPoints: Number,
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('Players', schema);
