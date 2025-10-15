const express = require("express");
const app = express();
const mongoose = require('mongoose');
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
// const MongoStore = require("connect-mongo");
const wrapAsync = require('./utils/wrapAsync.js');
const error = require('./utils/error.js');
const User = require("./models/user");

// ---------------- MongoDB Connection ----------------
main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/EcoFinds');
}

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Express layouts setup
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('ejs', ejsMate);

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new error(msg, 400);
  }
  next();
};

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "Library Management System" });
});

// ------------------- User Routes -------------------
// List all users (members)
app.get(
  "/users",
  wrapAsync(async (req, res) => {
    const users = await User.find({});
    res.render("users/index", { title: "All Members", users });
  })
);

// New User Form
app.get("/users/new", (req, res) => {
  res.render("users/new", { title: "Add New Member" });
});

// Create New User
app.post(
  "/users",
  validateUser,
  wrapAsync(async (req, res) => {
    const newUser = new User(req.body.User);
    await newUser.save();
    res.redirect("/users");
  })
);

// Edit User Form
app.get(
  "/users/:id/edit",
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new error("User not found", 404);
    res.render("users/edit", { title: "Edit Member", user });
  })
);

// Update User
app.put(
  "/users/:id",
  validateUser,
  wrapAsync(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body.User },
      { new: true }
    );
    if (!updatedUser) throw new error("User not found", 404);
    res.redirect(`/users/${updatedUser._id}`);
  })
);

// Delete User
app.delete(
  "/users/:id",
  wrapAsync(async (req, res) => {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) throw new error("User not found", 404);
    res.redirect("/users");
  })
);

// Show User Details
app.get(
  "/users/:id",
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new error("User not found", 404);
    res.render("users/show", { title: "Member Details", user });
  })
);

// ------------------- Error Handler -------------------
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { statusCode, message });
});

// ------------------- Catch-All 404 -------------------
app.use((req, res, next) => {
  next(new error("Page Not Found", 404));
});

// ------------------- Start Server -------------------
app.listen(8080, () => {
  console.log(`Server running at http://localhost:8080`);
});

module.exports = app;