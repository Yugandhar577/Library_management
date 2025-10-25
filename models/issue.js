const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  bookId: { type: Schema.Types.ObjectId, ref: "Book" },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  returnDate: { type: Date },
  fine: { type: Number, default: 0 },
  status: { type: String, enum: ["issued", "returned"], default: "issued" }
});

const issue = mongoose.model("Issue", issueSchema);
module.exports = issue;