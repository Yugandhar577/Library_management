const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String},
  memberId: { type: String, unique: true, required: true },
  membershipType: { 
    type: String, 
    enum: ["Regular", "Premium", "Student", "Senior"], 
    default: "Regular" 
  },
  status: { 
    type: String, 
    enum: ["Active", "Inactive", "Suspended"], 
    default: "Active" 
  },
  borrowedBooks: { type: Number, default: 0 },
  overdueCount: { type: Number, default: 0 },
  role: { 
    type: String, 
    enum: ["member", "staff", "admin"], 
    default: "member" 
  },
  phone: String,
  fineBalance: { type: Number, default: 0 } 
});

const user = mongoose.model("User", userSchema);
module.exports = user;
