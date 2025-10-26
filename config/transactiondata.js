const transactionData = [
  // --- Alice Johnson (ID 1): Borrowed (All on time) ---
  { "bookId": "B001", "userId": 1, "issueDate": "2025-10-04", "dueDate": "2025-10-25", "returnDate": null },
  { "bookId": "B002", "userId": 1, "issueDate": "2025-10-10", "dueDate": "2025-10-31", "returnDate": null },
  { "bookId": "B003", "userId": 1, "issueDate": "2025-10-15", "dueDate": "2025-11-05", "returnDate": null },

  // --- Bob Smith (ID 2): 1 Overdue (issueDate: 2025-09-01) ---
  { "bookId": "B004", "userId": 2, "issueDate": "2025-09-01", "dueDate": "2025-09-22", "returnDate": null }, // Overdue
  { "bookId": "B005", "userId": 2, "issueDate": "2025-10-05", "dueDate": "2025-10-26", "returnDate": null }, // Due Today
  { "bookId": "B006", "userId": 2, "issueDate": "2025-10-10", "dueDate": "2025-10-31", "returnDate": null },
  { "bookId": "B007", "userId": 2, "issueDate": "2025-10-20", "dueDate": "2025-11-10", "returnDate": null },
  { "bookId": "B008", "userId": 2, "issueDate": "2025-10-25", "dueDate": "2025-11-15", "returnDate": null },

  // --- David Brown (ID 4): Borrowed ---
  { "bookId": "B009", "userId": 4, "issueDate": "2025-09-28", "dueDate": "2025-10-19", "returnDate": null },
  { "bookId": "B010", "userId": 4, "issueDate": "2025-10-20", "dueDate": "2025-11-10", "returnDate": null },

  // --- Eva Green (ID 5): 3 Overdue ---
  { "bookId": "B011", "userId": 5, "issueDate": "2025-08-15", "dueDate": "2025-09-05", "returnDate": null }, // Overdue
  { "bookId": "B012", "userId": 5, "issueDate": "2025-09-05", "dueDate": "2025-09-26", "returnDate": null }, // Overdue
  { "bookId": "B001", "userId": 5, "issueDate": "2025-09-15", "dueDate": "2025-10-06", "returnDate": null }, // Overdue
  { "bookId": "B002", "userId": 5, "issueDate": "2025-10-05", "dueDate": "2025-10-26", "returnDate": null }, // Due Today

  // --- Frank Davis (ID 6): Borrowed ---
  { "bookId": "B003", "userId": 6, "issueDate": "2025-10-18", "dueDate": "2025-11-08", "returnDate": null },

  // --- Henry Wilson (ID 8): Borrowed ---
  { "bookId": "B004", "userId": 8, "issueDate": "2025-10-01", "dueDate": "2025-10-22", "returnDate": null },
  { "bookId": "B005", "userId": 8, "issueDate": "2025-10-10", "dueDate": "2025-10-31", "returnDate": null },
  { "bookId": "B006", "userId": 8, "issueDate": "2025-10-22", "dueDate": "2025-11-12", "returnDate": null },

  // --- Leo Thomas (ID 12): 1 Overdue ---
  { "bookId": "B007", "userId": 12, "issueDate": "2025-09-10", "dueDate": "2025-10-01", "returnDate": null }, // Overdue
  { "bookId": "B008", "userId": 12, "issueDate": "2025-09-25", "dueDate": "2025-10-16", "returnDate": null },
  { "bookId": "B009", "userId": 12, "issueDate": "2025-10-05", "dueDate": "2025-10-26", "returnDate": null }, // Due Today
  { "bookId": "B010", "userId": 12, "issueDate": "2025-10-15", "dueDate": "2025-11-05", "returnDate": null },

  // --- Past Transactions (Returned items) ---
  { "bookId": "B011", "userId": 11, "issueDate": "2025-08-01", "dueDate": "2025-08-22", "returnDate": "2025-09-20" }, // Returned late
  { "bookId": "B012", "userId": 11, "issueDate": "2025-08-01", "dueDate": "2025-08-22", "returnDate": "2025-09-20" }, // Returned late
  { "bookId": "B013", "userId": 25, "issueDate": "2025-05-10", "dueDate": "2025-05-31", "returnDate": "2025-06-05" },

  // --- Ryan Harris (ID 18): 4 Overdue ---
  { "bookId": "B014", "userId": 18, "issueDate": "2025-07-20", "dueDate": "2025-08-10", "returnDate": null }, // Overdue
  { "bookId": "B015", "userId": 18, "issueDate": "2025-08-01", "dueDate": "2025-08-22", "returnDate": null }, // Overdue
  { "bookId": "B001", "userId": 18, "issueDate": "2025-08-15", "dueDate": "2025-09-05", "returnDate": null }, // Overdue
  { "bookId": "B002", "userId": 18, "issueDate": "2025-09-01", "dueDate": "2025-09-22", "returnDate": null }, // Overdue
  { "bookId": "B003", "userId": 18, "issueDate": "2025-10-05", "dueDate": "2025-10-26", "returnDate": null }, // Due Today
  { "bookId": "B004", "userId": 18, "issueDate": "2025-10-18", "dueDate": "2025-11-08", "returnDate": null },

  // --- Uma Robinson (ID 21): 1 Overdue ---
  { "bookId": "B005", "userId": 21, "issueDate": "2025-09-05", "dueDate": "2025-09-26", "returnDate": null }, // Overdue
  { "bookId": "B006", "userId": 21, "issueDate": "2025-10-10", "dueDate": "2025-10-31", "returnDate": null },
  { "bookId": "B007", "userId": 21, "issueDate": "2025-10-23", "dueDate": "2025-11-13", "returnDate": null },

  // --- Emily Nelson (ID 31): 2 Overdue ---
  { "bookId": "B008", "userId": 31, "issueDate": "2025-08-20", "dueDate": "2025-09-10", "returnDate": null }, // Overdue
  { "bookId": "B009", "userId": 31, "issueDate": "2025-09-01", "dueDate": "2025-09-22", "returnDate": null }, // Overdue
  { "bookId": "B010", "userId": 31, "issueDate": "2025-09-20", "dueDate": "2025-10-11", "returnDate": null },
  { "bookId": "B011", "userId": 31, "issueDate": "2025-10-05", "dueDate": "2025-10-26", "returnDate": null }, // Due Today
  { "bookId": "B012", "userId": 31, "issueDate": "2025-10-15", "dueDate": "2025-11-05", "returnDate": null }
];

module.exports = { data: transactionData };