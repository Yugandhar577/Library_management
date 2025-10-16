const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: String,
  genre: String,
  publisher: String,
  edition: String,
  price: Number,
  availableCopies: { type: Number, default: 1 },
  totalCopies: { type: Number, default: 1 },
  description: String
});

const books = mongoose.model("books", bookSchema);
module.exports = books;