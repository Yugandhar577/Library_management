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

// Fetch details for autofill
app.get("/api/issue/fetch", async (req, res) => {
    const { memberId, bookId } = req.query;

    // Fetch from DB
    const member = await db.collection("members").findOne({ id: memberId });
    const book = await db.collection("books").findOne({ id: bookId });

    if (!member) return res.json({ error: "Member not found." });
    if (!book) return res.json({ error: "Book not found." });

    res.json({ member, book });
});

// Create transaction
app.post("/api/issue/create", async (req, res) => {
    const { memberId, bookId, issueDate, dueDate } = req.body;

    const transaction = {
        transactionId: Date.now(),
        memberId,
        bookId,
        issueDate,
        dueDate,
        status: "Issued"
    };

    await db.collection("transactions").insertOne(transaction);

    res.json({
        success: true,
        transactionId: transaction.transactionId,
        memberName: "Sample Member",
        bookTitle: "Sample Book"
    });
});

app.get("/issue", (req, res) => {
  res.render("issue", { title: "Issue Book" });
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
