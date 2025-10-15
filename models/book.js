import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
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

export default mongoose.model("Book", bookSchema);
