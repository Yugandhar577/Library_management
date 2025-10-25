const Joi = require("joi");

// Book Schema Validation
const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  genre: Joi.string().required(),
  publisher: Joi.string().required(),
  edition: Joi.string().required(),   
  availableCopies: Joi.number().min(0).required(),
  totalCopies: Joi.number().min(1).required(),
  description: Joi.string().allow("")
});

// User Schema Validation
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  memberId: Joi.string().required(),
  membershipType: Joi.string().valid("Regular", "Premium", "Student", "Senior").required(),
  status: Joi.string().valid("Active", "Inactive", "Suspended").required(),
  borrowedBooks: Joi.number().min(0).required(),
  overdueCount: Joi.number().min(0).required(),
  role: Joi.string().valid("member", "staff", "admin").required(),
  phone: Joi.string().allow(""),
  fineBalance: Joi.number().min(0).required()
});

// Transaction Schema Validation
const transactionSchema = Joi.object({
  bookId: Joi.string().required(),
  userId: Joi.string().required(),
  issueDate: Joi.date().required(),
  returnDate: Joi.date().required()
});
module.exports = { bookSchema, userSchema, transactionSchema };