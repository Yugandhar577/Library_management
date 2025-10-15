import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["member", "staff", "admin"], default: "member" },
  phone: String,
  fineBalance: { type: Number, default: 0 }
});

export default mongoose.model("User", userSchema);
