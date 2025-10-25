const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
// const MongoStore = require("connect-mongo");
const wrapAsync = require('./utils/wrapAsync.js');
const error = require('./utils/error.js');
const User = require("./models/user.js");
const Book = require("./models/book.js");
const issue = require("./models/issue.js");
const user = require("./models/user.js");

// ---------------- MongoDB Connection ----------------
main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/LibraryDB');
}

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Express layouts setup
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

const validateBook = (req, res, next) => {
  const { error } = bookSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new error(msg, 400);
  }
  next();
};

const validateTransaction = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new error(msg, 400);
  }
  next();
};

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

app.get(
  "/allbooks",
  wrapAsync(async (req, res) => {
    const allBooks = await Book.find({});
    res.render("allbooks", { allBooks, title: "All Books" });
  })
);


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

//--------------------- Book Routes -------------------

// List all books
app.get( "/books",
  wrapAsync(async (req, res) => {
    const allBooks = await books.find({});
    res.render("allbooks", { book: allBooks, title: "All Books" });
  })
);

// New Book Form
app.get("/books/new", (req, res) => {
  res.render("books/new", { title: "Add New Book" });
});

// Create New Book
app.post(
  "/books",
  validateBook,
  wrapAsync(async (req, res) => {
    const newBook = new Book(req.body.Book);
    await newBook.save();
    res.redirect("/books");
  })
);

// Edit Book Form
app.get(
  "/books/:id/edit",
  wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) throw new error("Book not found", 404);
    res.render("books/edit", { title: "Edit Book", book });
  })
);

// Update Book
app.put(
  "/books/:id",
  validateBook,
  wrapAsync(async (req, res) => {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body.Book },
      { new: true }
    );
    if (!updatedBook) throw new error("Book not found", 404);
    res.redirect(`/books/${updatedBook._id}`);
  })
);

// Delete Book
app.delete(
  "/books/:id",
  wrapAsync(async (req, res) => {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) throw new error("Book not found", 404);
    res.redirect("/books");
  })
);

// Show Book Details
app.get(
  "/books/:id",
  wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) throw new error("Book not found", 404);
    res.render("books/show", { title: "Book Details", book });
  })
);

//------------------- Transaction Routes -------------------

// List all transactions
app.get(
  "/transactions",
  wrapAsync(async (req, res) => {
    const transactions = await Transaction.find({});
    res.render("transactions/index", { title: "All Transactions", transactions });
  })
);

// New Transaction Form
app.get("/transactions/new", (req, res) => {
  res.render("transactions/new", { title: "Add New Transaction" });
});

// Create New Transaction
app.post(
  "/transactions",
  validateTransaction,
  wrapAsync(async (req, res) => {
    const newTransaction = new Transaction(req.body.Transaction);
    await newTransaction.save();
    res.redirect("/transactions");
  })
);

// Edit Transaction Form
app.get(
  "/transactions/:id/edit",
  wrapAsync(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) throw new error("Transaction not found", 404);
    res.render("transactions/edit", { title: "Edit Transaction", transaction });
  })
);

// Update Transaction
app.put(
  "/transactions/:id",
  validateTransaction,
  wrapAsync(async (req, res) => {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { ...req.body.Transaction },
      { new: true }
    );
    if (!updatedTransaction) throw new error("Transaction not found", 404);
    res.redirect(`/transactions/${updatedTransaction._id}`);
  })
);

// Delete Transaction
app.delete(
  "/transactions/:id",
  wrapAsync(async (req, res) => {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) throw new error("Transaction not found", 404);
    res.redirect("/transactions");
  })
);

// Show Transaction Details
app.get(
  "/transactions/:id",
  wrapAsync(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) throw new error("Transaction not found", 404);
    res.render("transactions/show", { title: "Transaction Details", transaction });
  })
);

// ------------------- Error Handler -------------------
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { statusCode, message });
});

// ------------------- Additional Routes -------------------
app.get("/allMembers",wrapAsync(async (req, res) => {
    const allMembers = await user.find({});
    res.render("allMembers", {allMembers, title: "All Members" });
  })
);

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
  });
});

// ------------------- Dashboard Setup -------------------
app.get("/api/stats", wrapAsync(async (req, res) => {
  const totalBooks = await Book.countDocuments({});
  const availableBooks = await Book.countDocuments({ availableCopies: { $gt: 0 } });
  const totalMembers = await user.countDocuments({});
  const overdueMembers = await user.countDocuments({ overdueCount: { $gt: 0 } });

  res.json({
    totalBooks,
    availableBooks,
    totalMembers,
    overdueMembers
  });
}));

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
