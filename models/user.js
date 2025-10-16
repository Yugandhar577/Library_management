const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["member", "staff", "admin"], default: "member" },
  phone: String,
  fineBalance: { type: Number, default: 0 }
});

const users = mongoose.model("User", userSchema);
module.exports = users;
