const mongoose = require('mongoose');

let { Schema } = mongoose;

let schema = new Schema(
  {
    lastActivity: String,
    type: String,
    coords: { type: String, required: true },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Players',
    },
  },
  { versionKey: false, timestamps: true },
);

mongoose.model('Activities', schema).syncIndexes();

module.exports = mongoose.model('Activities', schema);
