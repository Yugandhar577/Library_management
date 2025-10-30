const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingSchema = new Schema({
  libraryName: { type: String, default: "My Personal Library" },
  maxBooksPerUser: { type: Number, default: 5 },

  finePerDay: { type: Number, default: 5 },
  gracePeriod: { type: Number, default: 7 },

  emailNotifications: { type: String, default: "disabled" }
});

const settings = mongoose.model("settings", settingSchema);
module.exports = settings;