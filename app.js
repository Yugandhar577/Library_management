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

app.get("/allbooks", async (req, res) => {
  // Example data — later replace with DB fetch
  const books = [
    {
      _id: 1,
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      year: 1949,
      status: "Available",
      copies: 5,
    },
    {
      _id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      year: 1960,
      status: "Issued",
      copies: 2,
    },
    {
      _id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic",
      year: 1925,
      status: "Overdue",
      copies: 1,
    },
  ];
  res.render("allbooks", { layout: "layouts/boilerplate", title: "Books", books });
});

app.get("/allMembers", async (req, res) => {
  // Example data — later replace with database results
  const members = [
    {
      _id: 1,
      name: "Alice Johnson",
      memberId: "M001",
      email: "alice@mail.com",
      membershipType: "Regular",
      status: "Active",
      borrowedBooks: 3,
      overdueCount: 0,
    },
    {
      _id: 2,
      name: "Bob Williams",
      memberId: "M002",
      email: "bob@mail.com",
      membershipType: "Premium",
      status: "Overdue",
      borrowedBooks: 5,
      overdueCount: 2,
    },
    {
      _id: 3,
      name: "Carla Rivera",
      memberId: "M003",
      email: "carla@mail.com",
      membershipType: "Regular",
      status: "Active",
      borrowedBooks: 1,
      overdueCount: 0,
    },
  ];
  res.render("allMembers", {
    layout: "layouts/boilerplate",
    title: "All Members",
    members,
  });
});

app.get("/allTransactions", (req, res) => {
  const transactions = [
    {
      id: "TXN1001",
      memberName: "Alice Johnson",
      bookTitle: "The Art of Computer Programming",
      issueDate: "2025-09-20",
      dueDate: "2025-10-05",
      status: "Returned",
    },
    {
      id: "TXN1002",
      memberName: "Ravi Sharma",
      bookTitle: "Introduction to Algorithms",
      issueDate: "2025-10-01",
      dueDate: "2025-10-15",
      status: "Issued",
    },
    {
      id: "TXN1003",
      memberName: "Mina Lee",
      bookTitle: "Artificial Intelligence: A Modern Approach",
      issueDate: "2025-09-10",
      dueDate: "2025-09-25",
      status: "Overdue",
    },
  ];

  res.render("allTransactions", {
    layout: "layouts/boilerplate",
    title: "All Transactions",
    transactions,
  });});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
