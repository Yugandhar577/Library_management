const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Express layouts setup
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "Library Management System" });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
