const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fineSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
  amount: Number,
  paid: { type: Boolean, default: false },
  generatedAt: { type: Date, default: Date.now }
});

const fine = mongoose.model("Fine", fineSchema);
module.exports = fine;