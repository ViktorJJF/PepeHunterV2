const mongoose = require('mongoose');

let { Schema } = mongoose;

let schema = new Schema(
  {
    lastActivity: String,
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Players',
    },
  },
  { versionKey: false, timestamps: true },
);

mongoose.model('OverviewActivities', schema).syncIndexes();

module.exports = mongoose.model('OverviewActivities', schema);
