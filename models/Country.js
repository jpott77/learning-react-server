const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const mongooseStringQuery = require('mongoose-string-query');

var CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  group: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F'],
  },
  stats: {
    gamesPlayed: Number,
    wins: Number,
    draws: Number,
    losses: Number,
    goalsScored: Number,
    goalsAgainst: Number
  },
  flag: String,
  lineup: [{
    name: String,
    age: Number,
    position: String,
    style: String
  }]
});

CountrySchema.virtual('points').get(function () {
  return (this.wins * 3) + this.draws
});

CountrySchema.virtual('goalDifference').get(function () {
  return this.goalsScored - this.goalsAgainst
});

CountrySchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
};

CountrySchema.plugin(timestamps);
CountrySchema.plugin(mongooseStringQuery);

CountrySchema.index({ name: 1 });

module.exports = mongoose.model('Country', CountrySchema);  