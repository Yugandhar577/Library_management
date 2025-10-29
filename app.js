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
const fine = require("./models/fine.js");
const Transaction = require("./models/transaction.js");
const { bookSchema, userSchema, transactionSchema } = require("./models/schema.js");

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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const validateBook = (req, res, next) => {
  console.log("Validating book:", req.body.book);
  const { error } = bookSchema.validate(req.body.book);
  if (error) {
    const msg = Error.details.map((el) => el.message).join(",");
    throw new error(msg, 400);
  }
  next();
};

const validateTransaction = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) {
    const msg = Error.details.map((el) => el.message).join(",");
    throw new error(msg, 400);
  }
  next();
};

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = Error.details.map((el) => el.message).join(",");
    throw new error(msg, 400);
  }
  next();
};

// Routes
app.get("/", async (req, res) => {
  try {
    // 1️⃣ Fetch latest transactions (join-like behavior using manual lookups)
    const transactions = await Transaction.find()
      .sort({ issueDate: -1 })
      .limit(10)
      .lean();

    // Attach readable book + user names
    for (let t of transactions) {
      const book = await Book.findById(t.bookId).lean();
      const user = await User.findOne({ _id: t.userId }).lean();
      t.bookTitle = book ? book.title : "Unknown Book";
      t.memberName = user ? user.name : "Unknown User";
      t.date = t.issueDate ? t.issueDate.toISOString().slice(5, 10) : "";
      t.status = t.status || "Borrowed";
    }

    // 2️⃣ Prepare simple chart/trend data
    const genres = await Book.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $project: { genre: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topBooks = await Transaction.aggregate([
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Add book titles to topBooks
    for (let tb of topBooks) {
      const book = await Book.findById(tb._id).lean();
      tb.title = book ? book.title : "Unknown";
    }

    // 3️⃣ Prepare recent activities
    const activities = transactions.slice(0, 5).map((t) => ({
      member: t.memberName,
      type: t.status === "Returned" ? "returned" : "borrowed",
      book: t.bookTitle,
    }));

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 6); // Last 7 days

    const trendAgg = await Transaction.aggregate([
      {
        $match: {
          issueDate: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$issueDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Map MongoDB days (1=Sun, 7=Sat) → readable labels
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const trends = Array.from({ length: 7 }, (_, i) => {
      const found = trendAgg.find((t) => t._id === i + 1);
      return { label: dayLabels[i], count: found ? found.count : 0 };
    });

    // 4️⃣ Render home.ejs with real DB data
    res.render("home", {
      transactions,
      trends, 
      genres,
      topBooks,
      activities,
    });
  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.status(500).send("Error loading dashboard");
  }
});





// ------------------- User Routes -------------------
// List all users (members)
app.get(
  "/allmembers",
  wrapAsync(async (req, res) => {
    const allMembers = await User.find({});
    res.render("users/allMembers", { title: "All Members", allMembers });
  })
);

// New User Form
app.get("/users/addmember", (req, res) => {
  res.render("users/addmember", { title: "Add New Member" });
});

// Create New User
app.post(
  "/users",
  validateUser,
  wrapAsync(async (req, res) => {
    const newUser = new User(req.body.member); 
    await newUser.save();
    res.redirect("/allMembers");
  })
);

// Edit User Form
app.get(
  "/users/:id/editmember",
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error("User not found", 404);
    res.render("users/editmember", { title: "Edit Member", user });
  })
);

// Update User
app.put(
  "/users/:id",
  validateUser,
  wrapAsync(async (req, res) => {
    console.log(req); 
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body.user }
    );
    if (!updatedUser) throw new Error("User not found", 404);
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
app.get(
  "/allbooks",
  wrapAsync(async (req, res) => {
    const allBooks = await Book.find({});
    res.render("books/allbooks", { allBooks, title: "All Books" });
  })
);

// Add New Book Form
app.get("/books/addbook", (req, res) => {
  res.render("books/addbook", { title: "Add New Book" });
});

// Create New Book
app.post(
  "/books",
  validateBook,
  wrapAsync(async (req, res) => {
    const newBook = new Book(req.body.book);
    await newBook.save();
    res.redirect("/allbooks");
  })
);

// Edit Book Form
app.get(
  "/books/:id/edit",
  wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) throw new error("Book not found", 404);
    res.render("books/editbook", { title: "Edit Book", book });
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
    res.redirect("/allbooks");
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

//issue book
app.get(
  "/issuebooks/:id",
  wrapAsync(async (req, res) => {
    res.render("books/issue", { title: "Issue Book" });
  })
);

app.post(
  "/issuebooks/:id",
  wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) throw new error("Book not found", 404);

    // Create a new transaction
    const newTransaction = new Transaction({
      book: book._id,
      user: req.user._id,
      status: "issued",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    await newTransaction.save();

    res.redirect(`/books/${book._id}`);
  })
);

// return book
app.get(
  "/returnbooks/:id",
  wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) throw new error("Book not found", 404);
    res.render("books/return", { title: "Return Book", book });
  })
);

app.post(
  "/returnbooks/:id",
  wrapAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) throw new error("Book not found", 404);
    // Find the transaction and mark it as returned
    const transaction = await Transaction.findOneAndUpdate(
      { book: book._id, user: req.user._id, status: "issued" },
      { status: "returned", returnDate: new Date() },
      { new: true }
    );
    if (!transaction) throw new error("Transaction not found", 404);
    res.redirect(`/books/${book._id}`);
  })
);

//------------------- Transaction Routes -------------------

// List all transactions
app.get(
  "/alltransactions",
  wrapAsync(async (req, res) => {
    const transactions = await Transaction.find({});
    res.render("transactions/alltransactions", { title: "All Transactions", transactions });
  })
);

// New Transaction Form
// app.get("/transactions/new", (req, res) => {
//   res.render("transactions/new", { title: "Add New Transaction" });
// });

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
// app.get(
//   "/transactions/:id/edit",
//   wrapAsync(async (req, res) => {
//     const transaction = await Transaction.findById(req.params.id);
//     if (!transaction) throw new error("Transaction not found", 404);
//     res.render("transactions/edit", { title: "Edit Transaction", transaction });
//   })
// );

// Update Transaction
// app.put(
//   "/transactions/:id",
//   validateTransaction,
//   wrapAsync(async (req, res) => {
//     const updatedTransaction = await Transaction.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body.Transaction },
//       { new: true }
//     );
//     if (!updatedTransaction) throw new error("Transaction not found", 404);
//     res.redirect(`/transactions/${updatedTransaction._id}`);
//   })
// );

// Delete Transaction
app.delete(
  "/transactions/:id",
  wrapAsync(async (req, res) => {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) throw new error("Transaction not found", 404);
    res.redirect("/allTransactions");
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

// ------------------- Action Routes (issue / receive) -------------------
app.get("/actions/issue", (req, res) => {
  // render page to start the issue flow (select member, book, etc.)
  res.render("actions/issue", { title: "Issue Book" });
});

app.get("/actions/receive", (req, res) => {
  // render page to start the receive/return flow
  res.render("actions/receive", { title: "Receive Book" });
});
app.post(
  "/actions/issue",
  wrapAsync(async (req, res) => {
    const { memberId, issueDate, dueDate, books } = req.body;

    // 1️⃣ Parse books array safely
    const bookList = typeof books === "string" ? JSON.parse(books) : books;

    // 2️⃣ Find the member
    const user = await User.findOne({ memberId });
    if (!user) {
      return res.status(400).send("Member not found!");
    }

    // 3️⃣ Validate all books exist and are available
    const validBooks = [];
    for (const item of bookList) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res.status(400).send(`Book not found: ${item.bookId}`);
      }
      if (book.availableCopies <= 0) {
        return res.status(400).send(`Book "${book.title}" is not available`);
      }
      validBooks.push(book);
    }

    // 4️⃣ Process each book — create transaction + update DBs
    const createdTxns = [];

    for (const book of validBooks) {
      // a) Create a transaction
      const txn = new Transaction({
        bookId: book._id,
        userId: user._id,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: dueDate
          ? new Date(dueDate)
          : new Date(Date.now() + 21 * 86400000),
      });
      await txn.save();
      createdTxns.push(txn);

      // b) Update book stock
      book.availableCopies = Math.max(0, book.availableCopies - 1);
      await book.save();

      // c) Update user stats
      user.borrowedBooks += 1;
    }

    await user.save();

    const latestTxn = createdTxns[createdTxns.length - 1];
    res.redirect(`/transactions/${latestTxn._id}`);
  })
);

app.post("/actions/receive", async (req, res) => {
  try {
    const { memberId, memberName, receiveDate, remarks, books } = req.body;

    // Parse books (comes from hidden input as JSON)
    const parsedBooks = typeof books === "string" ? JSON.parse(books) : books;

    if (
      !parsedBooks ||
      !Array.isArray(parsedBooks) ||
      parsedBooks.length === 0
    ) {
      return res.status(400).send("No books specified for return");
    }

    // Update each book and corresponding transaction
    for (const bookItem of parsedBooks) {
      const { bookId } = bookItem;

      // 1️⃣ Update Transaction: mark as returned
      const txn = await Transaction.findOne({
        bookId: bookId,
        userId: memberId,
        returnDate: null, // still active
      });

      if (txn) {
        txn.returnDate = receiveDate ? new Date(receiveDate) : new Date();
        await txn.save();
      }

      // 2️⃣ Update Book availability
      const book = await Book.findById(bookId);
      if (book) {
        book.availableCopies = Math.min(
          book.totalCopies,
          book.availableCopies + 1
        );
        await book.save();
      }

      // 3️⃣ Update User borrowed count
      const user = await User.findById(memberId);
      if (user) {
        user.borrowedBooks = Math.max(0, user.borrowedBooks - 1);
        await user.save();
      }
    }

    // Optionally log or redirect
    console.log(`✅ Books received successfully from member ${memberId}`);
    res.redirect(`/transactions/${txn._id}`);
  } catch (err) {
    console.error("❌ Error receiving books:", err);
    res.status(500).send("Error processing returns");
  }
});

app.put(
  "/transactions/:id/return",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    // Find the transaction
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    // If it's already returned, skip update
    if (transaction.status === "Returned") {
      return res.redirect(`/transactions/${id}`);
    }

    // Update status and return date
    transaction.status = "Returned";
    transaction.returnDate = new Date();
    await transaction.save();

    // Update related Book (increment availableCopies)
    const book = await Book.findById(transaction.bookId);
    if (book) {
      book.availableCopies = (book.availableCopies || 0) + 1;
      await book.save();
    }

    // Update related User (decrement borrowedBooks)
    const user = await User.findById(transaction.userId);
    if (user && user.borrowedBooks > 0) {
      user.borrowedBooks -= 1;
      await user.save();
    }

    // ✅ Redirect back to this transaction's show page
    res.redirect(`/transactions/${transaction._id}`);
  })
);


// ------------------- Dashboard Setup -------------------
app.get("/api/stats", wrapAsync(async (req, res) => {
  const totalBooks = await Book.countDocuments({});
  const availableBooks = await Book.countDocuments({ availableCopies: { $gt: 0 } });
  const totalMembers = await User.countDocuments({});
  const overdueMembers = await User.countDocuments({ overdueCount: { $gt: 0 } });

  res.json({
    totalBooks,
    availableBooks,
    totalMembers,
    overdueMembers
  });
}));

// ------------------- Settings -------------------
app.get("/settings", (req, res) => {
  res.render("settings", { title: "Settings" });
});

// ------------------- Error Handler -------------------
app.use((Error, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = Error;
  res.status(statusCode).render("error", { statusCode, message });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
