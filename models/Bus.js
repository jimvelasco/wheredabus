const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Create Schema

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const BusSchema = new Schema({
  ownerid: {
    type: ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip: {
    type: String
  },
  route: {
    type: String
  },
  lat: {
    type: Number
  },
  lon: {
    type: Number
  },
  curlat: {
    type: Number
  },
  curlon: {
    type: Number
  },

  location: {
    type: pointSchema,
    required: true
  },
  status: {
    type: Number,
    default: 0
  },

  driver: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }
});

BusSchema.index({ location: "2dsphere" });

module.exports = Bus = mongoose.model("buses", BusSchema);
// the users name is used for passport or when
// const User = mongoose.model("users");
// also is the name of the document in mongodb
