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
    mainPlanet: String,
    isHunted: { type: Boolean, default: false },
    isFriend: {
      // se usa para cosas como autowatchdog
      type: Boolean,
      default: false,
    },
    hasWatchdog: {
      // se usa para cosas como autowatchdog
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true },
);

schema.virtual('planets', {
  ref: 'Planets',
  localField: 'playerId',
  foreignField: 'playerId',
});

// auto populate
let autoPopulateLead = function (next) {
  this.populate({
    path: 'planets',
    options: { sort: { galaxy: 1, systemm: 1 } },
  });
  next();
};

schema.pre('findOne', autoPopulateLead).pre('find', autoPopulateLead);

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

mongoose.model('Players', schema).syncIndexes();

module.exports = mongoose.model('Players', schema);
