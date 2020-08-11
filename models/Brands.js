const mongoose = require('mongoose');

const { Schema } = mongoose;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'El nombre de la marca es requerido'],
    },
    description: String,
    status: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('Brands', brandSchema);
