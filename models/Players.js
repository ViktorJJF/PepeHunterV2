const mongoose = require('mongoose');

let { Schema } = mongoose;

let schema = new Schema(
  {
    playerId: { type: Number, unique: true, required: true },
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
    numberOfShips: Number,
    rankMilitary: Number,
  },
  { versionKey: false, timestamps: true },
);

mongoose.model('Players', schema).syncIndexes();

module.exports = mongoose.model('Players', schema);
